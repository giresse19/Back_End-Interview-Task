var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expressSanitizer = require("express-sanitizer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'giresse19',
    database: 'be_task'
});
app.use(bodyParser.json());
app.use(expressSanitizer());

app.get("/api/get/:name/:offset*?", function(req, res) {
    // find count of users in db
    var orgName = req.sanitize(req.params.name); // sanitizing orgName before using it in sql query
    console.log(orgName);
    var limit = 100; // setting limits of page to be returned with one request
    var offset = 0; // req.query.offset(undefined);... getting offset number
    // console.log(offset);
    var sQuery = `
        SELECT orgs.org_name as org_name, 'parent' as relationship_type FROM orgs_relation
        JOIN orgs ON orgs_relation.parent_org_id = orgs.id
        WHERE orgs_relation.org_id = (SELECT id FROM orgs WHERE org_name= ?)
        UNION
        SELECT orgs.org_name as org_name, 'daughter' as relationship_type FROM orgs_relation
        JOIN orgs ON orgs_relation.org_id = orgs.id
        WHERE orgs_relation.parent_org_id = (SELECT id FROM orgs WHERE org_name= ?)
        UNION
        SELECT orgs.org_name as org_name, 'sister' as relationship_type FROM orgs_relation AS or1
        JOIN orgs_relation AS or2 ON or1.parent_org_id = or2.parent_org_id
        JOIN orgs ON or2.org_id = orgs.id
        WHERE or1.org_id = (SELECT id FROM orgs WHERE org_name= ?) AND orgs.org_name <> ?
        ORDER BY org_name ASC
        LIMIT ? OFFSET ?
    `;
    connection.query(sQuery, [orgName, orgName, orgName, orgName, limit, offset], function(error, results, fields) {
        if (error) {
            return console.log(error);
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
});

app.post("/api/create", function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
        // If someone is trying to nuke RAM, nuke the request
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6) {
            req.connection.destroy();
        }
    });
    req.on('end', function() {
        process_request(body);
    });
    function process_request(body) {
        // Continue with parsing json string in body and inserting organisation
        // json string is stored in the body variable
        var org = JSON.parse(body);
        insert_organisation(org, 0);
        res.end('INSERTED');
    }

    function insert_organisation(org, parent_id) {
        // normally check if organisation exists
        var sQuery = "INSERT INTO orgs (org_name) VALUES (?) ON DUPLICATE KEY UPDATE org_name = VALUES(org_name), id=LAST_INSERT_ID(id)";
        connection.query(sQuery, [org.org_name], function(error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            // Insert relation if any
            var new_parent_id = results.insertId;
            if (new_parent_id && parent_id > 0) {
                var rQuery = "INSERT INTO orgs_relation (org_id, parent_org_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE org_id = VALUES(org_id)";
                connection.query(rQuery, [new_parent_id, parent_id], function(error, results, fields) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    console.log(new_parent_id + ' - ' + parent_id + ' relation inserted');
                });
            }
            if (new_parent_id && org.daughters && org.daughters.length) {
                for (var i = 0; i < org.daughters.length; i++) {
                    insert_organisation(org.daughters[i], new_parent_id);
                }
            }
            console.log(org.org_name + ' inserted!');
        });
    }

});

app.listen(8080, function() {
    console.log("Server Running");
});

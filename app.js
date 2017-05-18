var express = require("express");
var app = express();
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'be_task'
});
 
 app.get("/api/get/:name", function (req, res) {
    // find count of users in db
    var orgName = req.params.name; //@TODO: sanitze orgName before using it in sql query
    var limit = 100;
    var offset = 0; //@TODO: get this offset from the request
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
 
    connection.query(sQuery, [orgName, orgName, orgName, orgName, limit, offset], function (error, results, fields) {
        if (error) {
            throw error
            //@TODO handle this and return nicely a response
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
 
});

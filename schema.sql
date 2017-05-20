 CREATE TABLE `orgs` (
 `id` int(10) UNSIGNED NOT NULL,
 `org_name` varchar(250) NOT NULL
 ) ENGINE=MyISAM DEFAULT CHARSET=utf16;
 
  INSERT INTO `orgs` (`id`, `org_name`) VALUES
 (1, 'Paradise Island'),
 (2, 'Banana tree'),
 (3, 'Big banana tree'),
 (4, 'Yellow Banana'),
 (5, 'Brown Banana'),
 (6, 'Black Banana'),
 (7, 'Green Banana'),
 (8, 'Phoneutria Spider');
 
  CREATE TABLE `orgs_relation` (
 `org_id` int(10) UNSIGNED NOT NULL,
 `parent_org_id` int(10) UNSIGNED NOT NULL
 ) ENGINE=MyISAM DEFAULT CHARSET=utf16;
 
  INSERT INTO `orgs_relation` (`org_id`, `parent_org_id`) VALUES
 (2, 1),
 (3, 1),
 (4, 2),
 (4, 3),
 (5, 2),
 (5, 3),
 (6, 2),
 (6, 3),
 (7, 3),
 (8, 6);
 
  ALTER TABLE `orgs`
 ADD PRIMARY KEY (`id`),
 ADD UNIQUE KEY `org_name` (`org_name`);
 
 ALTER TABLE `orgs_relation`
 ADD PRIMARY KEY (`org_id`,`parent_org_id`);
 
 
 ALTER TABLE `orgs`
 MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
 
  
 var body= {
        "org_name": "Paradise Island",
        "daughters": [{
            "org_name": "Banana tree",
            "daughters": [{
                "org_name": "Yellow Banana"
            }, {
                "org_name": "Brown Banana"
            }, {
                "org_name": "Black Banana"
            }]
        }, {
            "org_name": "Big banana tree",
            "daughters": [{
                "org_name": "Yellow Banana"
            }, {
                "org_name": "Brown Banana"
            }, {
                "org_name": "Green Banana"
            }, {
                "org_name": "Black Banana",
                "daughters": [{
                    "org_name": "Phoneutria Spider"
                }]
            }]
        }]
    };
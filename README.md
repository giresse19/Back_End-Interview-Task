# Organization-relations-Task
Organization relation-task for back-end

The goal of this task it to create a RESTful service that stores organisations with relations (parent to child relation).
Organization name is unique. One organisation may have multiple parents and daughters. 
All relations and organisations are inserted with one request (endpoint 1).  
API has a feature to retrieve all relations of one organization (endpoint 2). 
This endpoint response includes all parents, 
daughters and sisters of a given organization

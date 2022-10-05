/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Gazal Garg     Student ID: 107140212      Date: October01, 2022
*
* Your app’s URL (from Cyclic) : https://brave-erin-glasses.cyclic.app/
*
*************************************************************************/

//using express module
var express = require("express");
var data = require("./data-service.js");
var app = express();
var path = require("path");

//listen on process.env.PORT || 8080
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static('public')); //to get accurate css file

//Setting route for the home page
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

//Setting route for the about page
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

//Setting up route to get all employees
app.get("/employees", function(req, res){
    data.getAllEmployees()
    .then((data) => {res.json(data)})
    .catch((err) => {res.json({message: err})})
})

//Setting up route to get only the managers
app.get("/managers", function(req, res){
    data.getManagers()
    .then((data) => {res.json(data)})
    .catch((err) => {res.json({message: err})})
});

//Setting up route to get the departments
app.get("/departments", function(req, res){
    data.getDepartments()
    .then((data) => {res.json(data)})
    .catch((err) => {res.json({message: err})})
});

//Set up a route if no route is matched
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"/views/404.html"));
});

//creating local server
data.initialize().then(()=>{
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
})

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
var multer = require("multer")
let fs = require('fs');
let images = [];

//listen on process.env.PORT || 8080
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    } 
});

const upload = multer({ storage: storage });

app.use(express.static('public')); //to get accurate css file

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
    if (req.query.status) {
        data.getEmployeesByStatus(req.query.status)
        .then((data) => {res.json(data)})
        .catch((err) => {res.json({message: err})})
    }
    else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department)
        .then((data) => {res.json(data)})
        .catch((err) => {res.json({message: err})})
    }
    else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager)
        .then((data) => {res.json(data)})
        .catch((err) => {res.json({message: err})})
    }
    else{
        data.getAllEmployees()
        .then((data) => {res.json(data)})
        .catch((err) => {res.json({message: err})})
    }
})

app.get("/employee/:value", function(req, res){
        data.getEmployeeByNum(req.params.value)
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

//Setting up route to get the add employee page
app.get("/employees/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

//Setting up route to get the add image page
app.get("/images/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body)
    .then(() => {res.redirect('/employees')})
    .catch((err) => {res.json({ message: err })})
});

app.get("/images", (req, res) => {
    const dir = "./public/images/uploaded";
    fs.readdir(dir, function (err, items) {
      images.push(items)
      res.json({images})
    });
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

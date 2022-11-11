/*************************************************************************
* BTI325– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Gazal Garg     Student ID: 107140212      Date: October01, 2022
*
* Your app’s URL (from Heroku) : 
*
*************************************************************************/

//using express module
var express = require("express");
var app = express();

var data = require("./data-service.js");
var exphbs = require("express-handlebars");
var path = require("path");
var multer = require("multer");
var fs = require('fs');
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

app.engine(".hbs", exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
        navLink: function(url, options){
            return ('<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>');
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        } 
    }
}));
app.set("view engine", ".hbs");

//Configuring middleware
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Setting route for the home page
app.get("/", function(req, res){
    res.render("home");
});

//Setting route for the about page
app.get("/about", function(req, res){
    res.render("about");
});

//Setting up route to get all employees
app.get("/employees", function(req, res){
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department).then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager).then((data) => {
            res.render("employees", {employees: data});
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else{
        data.getAllEmployees().then((msg) => {
            res.render("employees", {employees: msg});
        }).catch((msg) => {
            res.render("employees", {msg: "no results"});
        })
    }
});

app.get("/employee/:value", function(req, res){
    data.getEmployeeByNum(req.params.value).then((data) => {
        console.log(data);
        res.render("employee", { emp: data });
    }).catch((err) => {
        res.render("employee",{message:"no results"});
    }) 
})

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body)
    .then(() => {res.redirect('/employees')})
    .catch((err) => {res.json({message: err})})
});

//Setting up route to get only the managers
app.get("/managers", function(req, res){
    data.getManagers()
    .then((data) => {res.json(data)})
    .catch((err) => {res.json({message: err})})
});

//Setting up route to get the departments
app.get("/departments", function(req, res){
    data.getDepartments().then((data) => {
        res.render("departments", {departments: data});
    }).catch((err) => {
        res.render("departments", {message: "no results"});
    })
});

//Setting up route to get the add employee page
app.get("/employees/add", function(req, res){
    res.render(path.join(__dirname, "/views/addEmployee"));
});

//Setting up route to get the add image page
app.get("/images/add", function(req, res){
    res.render(path.join(__dirname, "/views/addImage"));
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
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render("images", { items });
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

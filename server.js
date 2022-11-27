/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Gazal Garg       Student ID: 107140212        Date: November 26, 2022
*
* Online (Cyclic) Link: 
*
********************************************************************************/

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

/****************EMPLOYEES********************/

//Setting up route to get all employees
app.get("/employees", function(req, res){
    if(req.query.status){
        data.getEmployeesByStatus(req.query.status).then((data) => {
            if (employees.length > 0) {
                res.render("employees", { employees });
            } 
            else {
                res.render("employees", { message: "no results" })
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.department){
        data.getEmployeesByDepartment(req.query.department).then((data) => {
            if (employees.length > 0) {
                res.render("employees", { employees });
            } 
            else {
                res.render("employees", { message: "no results" })
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if(req.query.manager){
        data.getEmployeesByManager(req.query.manager).then((data) => {
            if (employees.length > 0) {
                res.render("employees", { employees });
            } 
            else {
                res.render("employees", { message: "no results" })
            }
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else{
        data.getAllEmployees().then((employees) => {
            if (employees.length > 0) {
                res.render("employees", { employees : employees });
            } 
            else {
                res.render("employees", { message: "no results" })
            }
        }).catch((msg) => {
            res.render("employees", {msg: "no results"});
        })
    }
});

app.get("/employee/:empNum", function(req, res){
     // initialize an empty object to store the values
     let viewData = {};
     data.getEmployeeByNum(req.params.empNum).then((data) => {
         if (data) {
             viewData.employee = data; //store employee data in the "viewData" object as "employee"
         } else {
             viewData.employee = null; // set employee to null if none were returned
         }
     }).catch(() => {
         viewData.employee = null; // set employee to null if there was an error
     }).then(data.getDepartments)
         .then((data) => {
             viewData.departments = data; // store department data in the "viewData" object as "departments"
             // loop through viewData.departments and once we have found the departmentId that matches
             // the employee's "department" value, add a "selected" property to the matching
             // viewData.departments object
             for (let i = 0; i < viewData.departments.length; i++) {
                 if (viewData.departments[i].departmentId == viewData.employee.department) {
                     viewData.departments[i].selected = true;
                 }
             }
         }).catch(() => {
             viewData.departments = []; // set departments to empty if there was an error
         }).then(() => {
             if (viewData.employee == null) { // if no employee - return an error
                 res.status(404).send("Employee Not Found");
             } else {
                 res.render("employee", { viewData: viewData }); // render the "employee" view
             }
         });
})

app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body)
    .then(() => {res.redirect('/employees')})
    .catch((err) => {res.json({message: err})})
});

//Setting up route to get the add employee page
app.get("/employees/add", function(req, res){
    data.getDepartments()
    .then((departments) => {
        if (departments.length > 0) {
            res.render("addEmployee", { departments: departments });
        } 
        else {
        res.render("addEmployee", { message: "no results" });
      }
    })
    .catch(() => {res.render("addEmployee", {departments: []})})
});

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body)
    .then(() => {res.redirect('/employees')})
    .catch((err) => {res.json({ message: err })})
});

app.get("/employees/delete/:empNum", function (req, res) {
    data.deleteEmployeeByNum(req.params.empNum)
    .then(() => {res.redirect("/employees")})
    .catch(() => {res.status(500).send("Employee not found!")});
});

//Setting up route to get only the managers
app.get("/managers", function(req, res){
    data.getManagers()
    .then((data) => {res.json(data)})
    .catch((err) => {res.json({message: err})})
});

/**********************************************************/

/*********************DEPARTMENTS*************************/

//Setting up route to get the departments
app.get("/departments", function(req, res){
    data.getDepartments().then((departments) => {
      if (departments.length > 0) {
        res.render("departments", { departments: departments });
      } else {
        res.render("departments", { message: "no results" });
      }
    })
    .catch(() => res.status(404));
});


app.get("/departments/add", function (req, res) {
    res.render("addDepartment");
});

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body).then(() => {
        res.redirect("/departments")})
      .catch((err) => {
        console.error(err)}
    );
});

app.post("/department/update", (req, res) => {
    data.updateDepartment(req.body).then(() => {
        res.redirect("/departments");})
      .catch((err) => {
        console.error(err)}
    );
});

app.get("/department/:departmentId", function (req, res) {
    data.getDepartmentById(req.params.departmentId)
    .then((department) => {res.render("department", { department: department[0] });})
    .catch(() => res.status(404).send("Department Not Found"))
});

/***********************************************************/

/*************************IMAGES***************************/

//Setting up route to get the add image page
app.get("/images/add", function(req, res){
    res.render(path.join(__dirname, "/views/addImage"));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
});

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render("images", { items });
      });
});

/***********************************************************/

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

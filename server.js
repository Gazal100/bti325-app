//using express module
var express = require("express");
var app = express();

var path = require("path")

//listen on process.env.PORT || 8080
var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static('public')); //to get accurate css file

//Setting route for the home page
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

//Setting route for the about page
app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/home.html"));
})

app.listen(HTTP_PORT, onHttpStart);
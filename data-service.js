let fs = require('fs');
let employees = [];
let departments = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json',(err,data)=>{
            if (err) reject("Failure to read file employees.json!");
            else {
                employees = JSON.parse(data)
                fs.readFile('./data/departments.json',(err,data)=>{
                    if (err) reject("Failure to read file departments.json!");
                    else departments = JSON.parse(data);
                        resolve("Successful")});
                }
        })
    })
}

module.exports.getAllEmployees = function(){
    return new Promise(function(reject, resolve){
        if(employees.length == 0) 
            reject("no results found");
        else
            resolve(employees);
    })
}

module.exports.getManagers = function(){
    return new Promise(function(reject, resolve){
        let managers = employees.filter(function(employee){
            return employee.isManager;
        });
        if(managers.length == 0)
            reject("no results found");
        else
            resolve(managers);
    })
}

module.exports.getDepartments = function(){
    return new Promise(function(reject, resolve){
        if(departments.length == 0)
            reject("no results found");
        else
            resolve(departments);
    })
}
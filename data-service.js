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

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        
        if (typeof employeeData.isManager === "undefined") {
             employeeData.isManager = false;
        } else {
             employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);

        if(employeeData) resolve (employees);
        else reject("Error adding post!");
    })
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        const EmployeesStatus = []
        for (let i = 0; i < employees.length; ++i) {
            if (employees[i].status == status) EmployeesStatus.push(employees[i])
        }
        if (EmployeesStatus.length == 0) reject(Error("no employees found with this status"))
        else resolve(EmployeesStatus)
    })
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        const EmployeesDepartment = []
        for (let i = 0; i < employees.length; ++i) {
            if (employees[i].department == department) EmployeesDepartment.push(employees[i])
        }
        if (EmployeesDepartment.length == 0) reject(Error("no employees found in this department"))
        else resolve(EmployeesDepartment)
    })
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        const employeesManager = []
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) employeesManager.push(employees[i])
        }
        if (employeesManager.length == 0) reject(Error("no employees found with this condition(manager)"))
        else resolve(employeesManager)
    })
}

module.exports.getEmployeeByNum = function(value){
    return new Promise((resolve, reject) => {
        const employee = employees.filter((e) => {
            return e.employeeNum == value
        })
        if (!employee) reject(Error("no employee found with this Employee Number"))
        resolve(employee)
    })
}
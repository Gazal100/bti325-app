const Sequelize = require('sequelize');

var sequelize = new Sequelize('svbmgoix', 'svbmgoix', 'gtb-D2WW0xHfuDrkldzhY7v9-LOs_xE8', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
   },
   query:{raw: true} // update here. You need it.
});

sequelize.authenticate()
    .then(()=> console.log('Connection success.'))
    .catch((err)=>console.log("Unable to connect to DB.", err));


//Employee Data Model
var Employee = sequelize.define("Employee", {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
});

//Department data model
var Department = sequelize.define("Department",{
      departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      departmentName: Sequelize.STRING,
});

module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        sequelize.sync()
        .then(() => {resolve()})
        .catch(() => {reject("unable to sync the database")});
    }) 
}

module.exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        Employee.findAll()
        .then((data) => {
            resolve(data)})
        .catch(() => reject("no results returned"))
    })
}

module.exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        reject();
    })
}

module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        Department.findAll()
        .then((data) => resolve(data))
        .catch(() => reject("no results returned"))
    })
}

module.exports.addEmployee = (employeeData) => {
    return new Promise((resolve, reject) => {
        employeeData.isManager = employeeData.isManager ? true : false;
        for (const emp in employeeData) {
            if (employeeData[emp] === "") {
            employeeData[emp] = null;
        }}
        Employee.create(employeeData)
            .then(() => {resolve()})
            .catch((err) => {reject("unable to create employee")
        });
    })
}

module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {status: status}})
            .then((data) => {resolve(data)})
            .catch((err) => {reject("no results returned")
        })
    })
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {department: department}})
            .then((data) => {resolve(data)})
            .catch((err) => {reject("no results returned")
        })
    })
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {employeeManagerNum : manager}})
            .then((data) => {resolve(data)})
            .catch((err) => {reject("no results returned")
        })
    })
}

module.exports.getEmployeeByNum = function(value){
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {employeeNum: value}})
            .then((data) => {resolve(data[0])})
            .catch((err) => {reject("no results returned")
        })
    })
}

module.exports.updateEmployee = function (employeeData) {
    return new Promise((resolve, reject)=> {
        employeeData.isManager = employeeData.isManager ? true : false;
        for (const emp in employeeData) {
            if (employeeData[emp] === "") {
                employeeData[emp] = null;
            }
        }
        Employee.update(employeeData,
            {where: {employeeNum: employeeData.employeeNum}})
            .then((result) => {
                console.log(employeeData)
                resolve(result)
            })
            .catch((err) => {reject("unable to update employee")
        });
    })
}

module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise(function (resolve, reject) {
      Employee.destroy({
            where: {employeeNum: empNum}
        })
        .then(() => {resolve("destroyed")})
        .catch((err) => {reject("was rejected")});
    });
}

module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (var i in departmentData) {
            if (departmentData[i] === "") {
                departmentData[i] = null;
            }
        }
        Department.create(departmentData)
            .then(function () {resolve();})
            .catch(() => {reject("unable to create department");})
    });
}

module.exports.updateDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (var i in departmentData) {
            if (departmentData[i] == "") 
            { departmentData[i] = null; }
        }
        Department.update(departmentData, {where: { departmentId: departmentData.departmentId}})
        .then((data) => {resolve(data)})
        .catch(() => {reject("unable to update department");})
    });
}

module.exports.getDepartmentById = function (id) {
    return new Promise((resolve, reject) => {
        Department.findAll({where: {departmentId: id}})
        .then((data) => resolve(data))
        .catch(() => reject("no results returned"))
    });
}
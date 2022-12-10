var mongoose = require("mongoose");
var bcrypt = require("bcryptjs")

var schema = mongoose.Schema;
var userSchema = new schema({
    userName: String,
    password: String,
    email: String,
    loginHistory:[{
        dateTime: Date,
        userAgent: String,
    }],
}) 

let User;

module.exports.initialize = function(){
    return new Promise(function(resolve, reject){
        let db = mongoose.createConnection(
            "mongodb+srv://ggarg4:Gazal321@SenecaWeb.psbytdd.mongodb.net/web322_week8"
          );
          db.once("open", () => {
            User = db.model("users", userSchema);
            resolve();
          });
          db.on("error", (err) => {
            reject(err); 
          });
    })
}

module.exports.registerUser = function(userData){
    return new Promise(function(resolve, reject){
        if (userData.password !== userData.password2) {
            reject(`Passwords do not match`);
        }
        else if(userData.password.length === 0 || userData.password2.length === 0){
            reject("Error: user name cannot be empty or only white spaces!")
        }
        else{
            var newUser = new User(userData);
            bcrypt.hash(newUser.password, 10)
            .then((hash)=>{
                newUser.password = hash;
                newUser.save().then(()=>{
                    resolve();
                })
                .catch((err) =>{
                    if(err.code == 1100){
                        reject("user name already taken")
                    }
                    else{
                        reject("There was an error creating the user: "+ err)
                    }
                })
            })
            .catch((err)=>{
                reject("There was an error encrypting the password.")
            })
        }
    })
}

module.exports.checkUser = function(userData){
    return new Promise(function(resolve, reject){
        User.findOne({userName : userData.userName}).exec()
        .then((user)=>{
            if(user){
                bcrypt.compare(userData.password, user.password)
                .then((check) =>{
                    if(check){
                        user.loginHistory.push({
                            dateTime: new Date().toString(),
                            userAgent:userData.userAgent
                        })

                        User.updateOne(
                            {userName: user.userName},
                            {$set:{loginHistory: user.loginHistory}}
                        )
                        .exec()
                        .then((update)=>{
                            if(update){
                                resolve(user);
                            }
                        })
                        .catch((err)=>{
                            reject(err)
                        })
                    }
                    else{
                        reject("Incorrect password for user: "+ userData.userName)
                    }
                })
            }
            else{
                reject("unable to find user: "+ userData.userName)
            }
        })
    })
}
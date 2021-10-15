const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../database/userModel");
const SECRET_TOKEN = process.env.ACCESS_TOKEN || "This is very secret";

// Handling POST Register req
exports.register = async (req, res) => {
  // capturing Client data
  let data = req.body;
  // Creating Hashed password
  const hashPwd = await bcrypt.hash(data.Password, 10);
  data.Password = hashPwd;

  // Saving data to database
  let user = new User(data);
  user
    .save()
    .then((data) => {
      res.status(200).send("Data stored successfully");
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Handling Post Login request
exports.login = (req, res) => {
  // Extracting data from login form
  let userEmail = req.body.Email;
  let userPassword = req.body.Password;

  // finding data with email id
  User.findOne({ Email: userEmail })

    .then((data) => {
      // If Email Matched
      if (data) {
        //Performing the comparison Between User pwd and hashed pwd
        bcrypt.compare(userPassword, data.Password).then((result) => {
          if (result) {
            res.json("Success");
            console.log("Login Success");
          } else {
            res.json("Failed");
            console.log("Incorrect Password");
          }
        });
      }
      // If Email Not Matched
      else {
        console.log("Incorrect Email ");
        res.json("Incorrect Email  ");
      }
    })
    // If database have some error
    .catch((err) => {
      console.log("DataBase fetching error " + err);
      res.status(404).send("database is facing some issue");
    });
};

// Getting profile using get method and jwt token
exports.profile = (req, res) => {
  let user = req.query.Token;
  res.send(user + "This is the id of abuzar u got it");
  console.log(user);
};

exports.edit = (req, res) => {
  let data = req.body;
  console.log(data);
  res.send(data);
};

exports.changePwd = (req, res) => {
  let passwords = req.body;
  console.log(passwords);
};

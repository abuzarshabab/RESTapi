// const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../database/userModel");
var jwt = require("jsonwebtoken");
const SECRET_TOKEN = "hello";
// const SECRET_TOKEN = process.env.ACCESS_TOKEN || "This is very secret";

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
        // Performing the comparison Between User pwd and hashed pwd
        bcrypt.compare(userPassword, data.Password).then((result) => {
          // Handling Authentication
          if (result) {
            // Handling Authorization
            const user = { Email: data.Email };
            // Assigning Access Token for Login
            const accessToken = jwt.sign(user, SECRET_TOKEN, {
              expiresIn: "10h",
            });
            // Responding Json token
            res.json({ accessToken: accessToken });

            console.log("Login Success : " + accessToken);
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
  console.log(req.user.Email);
  // Finding the respective data after authorization done
  User.findOne({ Email: req.user.Email })
    // Sending Response as Json Format
    .then((data) => {
      const user = {
        FirstName: data.FirstName,
        LastName: data.LastName,
        Email: data.Email,
        PhoneNumber: data.PhoneNumber,
        Gender: data.Gender,
      };

      res.json(user);
    })
    // If user not found in database
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
};
// Handling Patch Request
exports.edit = async (req, res) => {

 console.log(req.user.Email);
  const update = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    PhoneNumber: req.body.PhoneNumber,
    Gender: req.body.Gender,
  };
  // Finding the respective data after authorization done   
  try{
    const updater = await User.findOneAndUpdate(
      { Email: req.user.Email },
      update
    );
    // Sending Response as Json Format
    if(updater){
      res.json({ message: "Updated successfully" });
    }
  }
  catch(err){
    console.log(err)
    res.json({error:err});
  }

};

exports.changePwd = (req, res) => {
  let passwords = req.body;
  console.log(passwords);
};

exports.authenticateToken = function (req, res, next) {
  const token = req.headers["authorization"];

  if (token === null) {
    console.log("token Null");
    res.sendStatus(401);
  }
  // Verifying
  jwt.verify(token, SECRET_TOKEN, (err, user) => {
    if (err) {
      console.error("error : " + err);
      return res.sendStatus(403);
    } else {
      req.user = user;
      next();
    }
  });
};

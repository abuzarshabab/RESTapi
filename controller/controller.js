// const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../database/userModel");
var jwt = require("jsonwebtoken");
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
      res.json({msg: "Data stored successfully"});
    })
    // 
    .catch((err) => {
      res.json({ msg: "Failed" });
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

          } else {
            res.json({msg:"Failed"});
            console.log("Incorrect Password");
          }
        });
      }
      // If Email Not Matched
      else {
        console.log("Incorrect Email ");
        res.json({msg:"Incorrect Email  "});
      }
    })
    // If database have some error
    .catch((err) => {
      console.log("DataBase fetching error " + err);
      res.json({msg : "Error 401"})
    });
};



// Getting profile using get method and jwt token
exports.profile = (req, res) => {
  console.log(req.user.Email);

  // Finding the respective data after authorization done
  User.findOne({ Email : req.user.Email })

    // Sending Response as Json Format
    .then((data) => {
      if(data){
        const user = {
          FirstName: data.FirstName,
          LastName: data.LastName,
          Email: data.Email,
          PhoneNumber: data.PhoneNumber,
          Gender: data.Gender,
        };
        res.json(user);
      }else{
        res.json({msg:"Your password had been changed or toke expired : Please login again"})
      }
    })

    // If user not found in database
    .catch((err) => {
      console.log(err);
      res.status(400);
    });
};

// Handling Patch update Request
exports.edit = async (req, res) => {
  console.log(req.user.Email);

  // Creating Updated object
  const update = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    PhoneNumber: req.body.PhoneNumber,
    Gender: req.body.Gender,
  };

  // Finding the respective data after authorization done
  try {
    const updater = await User.findOneAndUpdate(
      { Email: req.user.Email },
      update
    );

    // Sending Response as Json Format
    if (updater) {
      res.json({ message: "Updated successfully" });
    }
  } catch (err) {
   
    res.json({msg : err });
  }
};

// Handling the put update request
exports.changePwd = async (req, res) => {
  const oldPwd = req.body.OldPassword;
  const newPwd = req.body.NewPassword;
  const confirmPwd = req.body.ConfirmPassword;

  // comparing confirm and New pwd
  if (oldPwd && newPwd) {
    try {
      const userD = await User.findOne({ Email: req.user.Email });
      if (userD) {

        // comparing old pwd with hashed
        bcrypt.compare(oldPwd, userD.Password).then(async (result) => {

          // If old password matches
          if (result) {

            // Generating Hashed password
            const hashPwd = await bcrypt.hash(newPwd, 10);
            userD.Password = hashPwd;

            // Saving hashed to database
            await userD.save();
            res.json({ msg: "Password Updated" });
          }
          
          // If Old password does not matches
          else {
            res.json({ msg: "You have entered Wrong Password" });
          }
        });
      }
    } catch (err) {
      res.json({ error: err });
    }
  } else {
    res.json({ msg: "Please Check your Confirm Password" });
  }
};



// Authenticating the user 

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

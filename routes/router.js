const express = require("express");
const controller = require("../controller/controller");
var jwt = require("jsonwebtoken");
// const SECRET_TOKEN = process.env.ACCESS_TOKEN || "This is very secret";
const SECRET_TOKEN = "hello";
const route = express.Router();
// Api lists

route.post("/register", controller.register);

// Handling Login request we can use connect method if there is two way communication
route.post("/login", controller.login);

// Handling Profile request
route.get("/profile", controller.authenticateToken, controller.profile);

// Handling profile edit request
route.patch("/update", controller.authenticateToken, controller.edit);

// Handling password change request
route.patch("/update", controller.changePwd);

module.exports = route;



const express = require("express");
const controller = require("../controller/controller");

const route = express.Router();
// Api lists

route.post("/register", controller.register);

// Handling Login request we can use connect method if there is two way communication
route.post("/login", controller.login);

// Handling Profile request
route.get("/profile", controller.profile);

// Handling profile edit request
route.put("/update", controller.edit);

// Handling password change request
route.patch("/update", controller.changePwd);

module.exports = route;
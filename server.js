const bodyParser = require("body-parser");
const express = require("express");
const connectDB = require("./database/connection");
const route = require("./routes/router");

const PORT = process.env.PORT || 5049;
const app = express();

// Connecting to data bas
connectDB();

// Attaching the body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Specifying the Route file
app.use("/", route);

app.listen(PORT, () => {
  console.log("Server is listening at localhost : " + PORT);
});

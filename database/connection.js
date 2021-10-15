const mongoose = require("mongoose");
const mongoUrl = " mongodb://127.0.0.1:27017/restapi";

const connectDB = async () => {
  // Mongo db connection string
  try {
    const con = await mongoose.connect(mongoUrl, {
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;

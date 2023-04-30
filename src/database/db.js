const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

//Kindly switch to PROD WHEN TESTING your code
const dbUrl = process.env.DATABASE_URL_DEV;

function connectDB() {
  mongoose
    .set("strictQuery", false)
    .connect(dbUrl)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
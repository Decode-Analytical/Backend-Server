const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL_DEV;

(function () {
  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(err);
    });
})();

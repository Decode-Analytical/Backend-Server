const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);

const dbUrl = process.env.DATABASE_URL_DEV;

(function () {
  mongoose
    .set("strictQuery", false)
    .connect(dbUrl)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log(err);
    });
})();

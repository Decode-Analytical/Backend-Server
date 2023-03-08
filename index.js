const express = require("express");
const bodyParser = require("body-parser");
const index = require("./src/routes/index");
require("./src/database/db");
require("dotenv").config();
const courseRoutes = require("./src/routes/courseRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/course", courseRoutes);

index(app);

app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});

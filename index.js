const express = require('express');
const bodyParser = require('body-parser');
const bootStrap = require('./src/routes/index');
const connectDB = require('./src/database/db');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
  
  //connect to DB
  connectDB();
  
  //connect to all routes
  bootStrap(app);
});

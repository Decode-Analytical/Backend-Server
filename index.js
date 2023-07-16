require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const xss = require('xss-clean');
const { useTreblle } = require("treblle");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const logger = require('morgan')
const connectDB = require("./src/database/db");
const cloudinaryConfig = require('./src/utils/cloudinary');
const courseRoutes = require('./src/routes/course.routes');
const userRoutes = require('./src/routes/user.routes');
const studentRoutes = require('./src/routes/student.routes');
const commentRoutes = require('./src/routes/comment.routes');
const likeRoutes = require('./src/routes/like.routes');
const paymentRoutes = require('./src/routes/payment.routes');

// const tutorRoutes = require('./src/routes/tutor.routes');

const app = express();
//connect to DB
connectDB();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(logger("dev")); //logger to log every request and response summary

app.get("/", (req, res) => {
  res.send("Hello World");
});

useTreblle(app, {
  apiKey: process.env.TREBLLE_API_KEY,
  projectId: process.env.TREBLLE_PROJECT_ID,
});

//cloudinary
app.use('/api', cloudinaryConfig);

//connect to all routes
app.use("/api/course/like", likeRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/comment", commentRoutes);
// app.use("/api/tutor", tutorRoutes);
app.use("/api/payment", paymentRoutes);

//start server
app.listen(port, () => {
  console.log(`Decode App is running on port, http://localhost:${port}`);
});



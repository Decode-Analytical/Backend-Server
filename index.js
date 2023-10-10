require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { useTreblle } = require("treblle");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./src/database/db");
const cloudinaryConfig = require("./src/utils/cloudinary");
const courseRoutes = require("./src/routes/course.routes");
const userRoutes = require("./src/routes/user.routes");
const studentRoutes = require("./src/routes/student.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const adminRoutes = require("./src/routes/admin.routes");
const questionRoutes = require("./src/routes/quiz.routes");
const answerRoutes = require("./src/routes/answer.routes");
const commentRoutes = require("./src/routes/comment.routes");
const likeRoutes = require("./src/routes/like.routes");

const app = express();

connectDB();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(mongoSanitize());

useTreblle(app, {
  apiKey: process.env.TREBLLE_API_KEY,
  projectId: process.env.TREBLLE_PROJECT_ID,
});

//cloudinary
app.use("/api", cloudinaryConfig);

//connect to all routes
app.use("/api/course", courseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/comments/", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/quizes", require("./src/routes/quiz.routes"));

app.listen(port, () => {
  console.log(`Decode App is running on port, http://localhost:${port}`);
});

require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
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


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

connectDB();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
app.use("/api/quizes", questionRoutes);


server.listen(port, () => {
  console.log(`Decode App is running on port, http://localhost:${port}`);
});

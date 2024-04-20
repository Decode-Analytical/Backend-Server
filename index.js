require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const promClient = require('prom-client');
// const { useTreblle } = require("treblle");
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
const messageRoutes = require('./src/routes/message.routes');
const walletRoutes = require('./src/routes/wallet.routes');
const pinRoutes = require('./src/routes/pin.routes');

const app = express();

connectDB();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(mongoSanitize());

// useTreblle(app, {
//   apiKey: process.env.TREBLLE_API_KEY,
//   projectId: process.env.TREBLLE_PROJECT_ID,
// });

const register = new promClient.Registry();
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_microseconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500, 1000, 2000, 5000]
});

// Register metrics
register.registerMetric(httpRequestDurationMicroseconds);

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});
app.use((req, res, next) => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const elapsedTime = process.hrtime(startTime);
    const durationInMicroseconds = (elapsedTime[0] * 1e9 + elapsedTime[1]) / 1e3;
    const labels = {
      method: req.method,
      route: req.route ? req.route.path : 'unknown',  
      status_code: res.statusCode
    };

    try {
      httpRequestDurationMicroseconds.observe(labels, durationInMicroseconds);
    } catch (error) {
      return res.status(500).json({ message: 'Error observing httpRequestDuration', error: error})
    }
  });

  next();
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
app.use('/api/chat', messageRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/pin", pinRoutes);

app.listen(port, () => {
  console.log(`Decode App is running on port, http://localhost:${port}`);
});

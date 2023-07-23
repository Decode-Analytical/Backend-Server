const express = require("express");
const upload = require("../utils/multer");
const limiter  = require("../middleware/rateLimit");
const { auth } = require("../middleware/auth");
const {
  signUp,
  userLogin,
  resetPassword,
  forgotPassword,
  emailVerify,
  viewUserProfile,
  updateStudentProfile,
  deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", limiter, userLogin);
router.get("/verify-email/:token", emailVerify );
router.post("/forgot-password", forgotPassword );
router.get("/reset-password/:token",  resetPassword );

router.use(auth);
router.get("/profile",  viewUserProfile );
router.put("/student", upload.fields([{ name: "picture", maxCount: 1}]), updateStudentProfile);
router.delete("/user", deleteUser)



module.exports = router;

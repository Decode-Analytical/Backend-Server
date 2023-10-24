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
  updateStudentProfilePicture
} = require("../controllers/user.controller");
const userValidator = require("../middleware/validator");
const router = express.Router();

router.post("/signup", userValidator, signUp);
router.post("/login", userLogin);
router.get("/emailVerify/:token", emailVerify );
router.post("/forgotpassword", forgotPassword );
router.get("/resetpassword",  resetPassword );

router.use(auth);
router.get("/viewprofile",  viewUserProfile );
router.put("/studentUpdate", upload.fields([{ name: "picture", maxCount: 1}]), updateStudentProfile);
router.delete("/studentDeleteCourse", deleteUser)
router.put("/userUpdateProfile", upload.fields([{ name: "picture", maxCount: 1}]), updateStudentProfilePicture );



module.exports = router;

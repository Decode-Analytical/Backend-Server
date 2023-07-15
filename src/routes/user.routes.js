const express = require("express");
const upload = require("../utils/multer");
const { auth } = require("../middleware/auth");
const {
  signUp,
  userLogin,
  resetPassword,
  forgotPassword,
  emailVerify,
  viewUserProfile,
  updateStudentProfile,
  deleteUser
} = require("../controllers/user.controller");
const router = express.Router();


router.post("/signup", upload.fields([{ name: "picture", maxCount: 1}]), signUp);
router.post("/login",  userLogin);
router.get("/emailVerify/:token", emailVerify );
router.post("/forgotpassword", forgotPassword );
router.get("/resetpassword/:token",  resetPassword );

router.use(auth);
router.get("/viewprofile",  viewUserProfile );
router.put("/studentUpdate", upload.fields([{ name: "picture", maxCount: 1}]), updateStudentProfile)
router.delete("/studentDeleteCourse", deleteUser)


module.exports = router;

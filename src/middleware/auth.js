const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const commonService = require("../utils/commonService");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
      return commonService.unAuthorizedResponse("Please authenticate", res);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findOne({ _id: decoded._id, "tokens.token": token });
    if (!user)
      return commonService.unAuthorizedResponse("Please authenticate", res);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = auth;

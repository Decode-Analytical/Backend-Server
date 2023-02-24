const signupController = require("../controllers/user");
const validator = require("../middleware/validator");
const joiSchema = require("../utils/joiSchema");

module.exports = (app) => {
  /*app.use('/api/routeName', yourRoute);  add new routes here
    e.g for auth
    app.use('/api/auth', authRoute);   
*/
  app.use("user/signup", validator(joiSchema.signup, "body"), signupController);
};

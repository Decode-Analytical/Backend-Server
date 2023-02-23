const signupController = require("../controllers/user");

module.exports = (app) => {
  /*app.use('/api/routeName', yourRoute);  add new routes here
    e.g for auth
    app.use('/api/auth', authRoute);   
*/
  app.use("user/signup", signupController);
};

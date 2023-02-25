const tutorRouter = require("./tutorRoutes");

module.exports = (app) => {
  /*app.use('/api/routeName', yourRoute);  add new routes here
    e.g for auth
    app.use('/api/auth', authRoute);   
*/

  app.use("/", tutorRouter);
};

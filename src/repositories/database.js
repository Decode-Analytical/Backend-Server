//create new js files for your database
const mongoose = require('mongoose')

const connectDB = () => {
    mongoose
    .connect(process.env.mongoUR)
    .then((connect) => console.log("db connected"))
    .catch((err) => console.log(err));

}
module.exports = connectDB
const User = require("../models/user");

const signUp = async (req, res) => {
  try {
    const { email, firstName } = req.body;
    const existingUser = User.findOne({ email });
    if (existingUser)
      res.status(422).json({
        STATUS: "FAILURE",
        MESSAGE: "User already exist",
      });
    const user = await User.create(req.body);
    //Generate token using JWT
    const token = await user.generateAuthToken();
    // Using nodemailer (SMTP) for email sending/testing
    sendWelcomeEmail({
      email,
      subject: "Thanks for joining in!",
      message: `Welcome to Learn More, ${firstName}. Let us know how you get along with the app`,
    });
    res.status(201).json({
      STATUS: "SUCESS",
      MESSAGE: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      STATUS: "FAILURE",
      MESSAGE: "Internal server error",
    });
  }
};







// const router = require("express").Router()
// const bycrypt = require("bcrypt")
// //loading user model
// const User = require('../../model/User')
 
// // router.get('/help', (req, res) => res.json({msg:'user work'}))

// // for registration of users
// router.post('/register', (req, res) => { 
//  User.findOne({email:req.body.email})
//  .then(user =>{
//     if(user){
//         return res.status(400).json({email:"email already exist"})
//     }else {
//         const newUser = new User({
//             name:req.body.name,
//             email:req.body.email,
//             password:req.body.password,
//             // avatar:avatar,
//         })
//         bycrypt.genSalt(10,(err, salt) => { 
//             bycrypt.hash(newUser.password, salt, (err,hash) =>{
//                 if(err) throw err
//                 newUser.password = hash
//                 newUser.save()
//                 .then(user => res .json(user))
//                 .catch(err > console.log(err))
//             })
//         })
//     }
//  })
// })
// module.exports = router

hello

module.exports = signUp;

const express = require('express');
const app = express();
app.use(express.json());
const userController = require('./src/controllers/user.controller');

app.get('/users', (req, res) => {
  res.status(200).json({ users: [{ id: 1, name: 'John Doe' }] });
});

;
app.post('/signup', userController.signUp);
app.post('/userLogin', userController.userLogin);



module.exports = app;

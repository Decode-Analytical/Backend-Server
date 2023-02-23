const express = require('express');
const index = require('./src/routes/index');
const app = express();

index(app);

app.listen(3000, ()=>{
    console.log('App is running on port 3000')
})
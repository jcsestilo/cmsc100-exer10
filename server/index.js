const express = require('express')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');

mongoose.connect(
  "mongodb://localhost:27017/USERS",
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err) => {
    if (err) { console.log(err); }
    else { console.log("Successfully connected to Mongo DB"); }
  });
  
// require('./models/user');
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


require('./router')(app)

app.listen(3001, (err) => {
  if (err) { console.log(err) }
  else {console.log('Server started at port 3001')}
})
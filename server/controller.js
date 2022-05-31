const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// require('./models/user');
//mongoose.connect('mongodb://localhost:27017/EXER5', { useNewUrlParser: true })


const User = require('./models/user.js');

exports.signUp = (req, res, next) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    age: req.body.age,
    password: req.body.password
  });

  console.log("New user: ");
  console.log(newUser);

  newUser.save((err) => {
    if (err) {
      res.send({ success: false}); 
      console.log("Error occured: ", err);
    }
    else {
      res.send({success: true });
      console.log("Successful.");
    }
  });
}

exports.logIn = (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    // check if email exists
    if (err || !user) {
      //  Scenario 1: FAIL - User doesn't exist
      console.log("user doesn't exist");
      return res.send({ success: false });
    }

    // check if password is correct
    user.comparePassword(password, (err, isMatch) => {
      if (err || !isMatch) {
        // Scenario 2: FAIL - Wrong password
        console.log("wrong password");
        return res.send({ success: false });
      }

      console.log("Successfully logged in");

      // Scenario 3: SUCCESS - time to create a token
      const tokenPayload = {
        _id: user._id
      }

      const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

      // return the token to the client
      return res.send({ success: true, token, username: user.name });


    })
  })
}

exports.findAll = (req, res, next) => {
  User.find((err, user) => {
    if (!err) { res.send(user) }
  })
}

exports.findById = (req, res, next) => {
  if (!req.query.id) { return res.send('No id provided') }

  User.findOne({ _id: req.query.id}, (err, user) => {
    if (!err) { res.send(user) }
  })
}

exports.findByIdPOST = (req, res, next) => {
  console.log('find by post')
  console.log(req.body)
  if (!req.body.id) { return res.send('No id provided') }

  User.findOne({ _id: req.body.id}, (err, user) => {
    if (!err) { res.send(user) }
  })
}

exports.add = (req, res, next) => {

  const newUser = new User({
    title: req.body.title,
    developer: req.body.developer,
    year: req.body.year,
    online: req.body.online,
    maxLocalPlayers: req.body.maxLocalPlayers
  })

  newUser.save((err) => {
    if (!err) { res.send(newUser)}
    else { res.send('Unable to save user') }
  })
}

exports.deleteById = (req, res, next) => {
  User.findOneAndDelete({ _id: req.body.id }, (err, user) => {
    if (!err && user) {
      res.send('Successfully deleted ' + user.firstName)
    }
    else {
      res.send('Unable to delete user')
    }
  })
}

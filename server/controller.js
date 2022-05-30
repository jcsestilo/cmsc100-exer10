const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/EXER5', { useNewUrlParser: true })

const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  email: String,
  age: Number,
  password: String
})

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
    if (err) {return res.send({ success: false}); }
    else { return res.send({success: true }); }
  });
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

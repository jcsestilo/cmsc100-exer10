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
    password: req.body.password,
    friends: [],
    friendReqs: [],
    posts: []
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
      return res.send({ success: true, token, firstName: user.firstName });


    })
  })
}

exports.checkIfLoggedIn = (req, res) => {
  if (!req.cookies || !req.cookies.authToken){
    // Scenario 1: FAIL - No cookies/no authToken cookie sent
    return res.send({isLoggedIn: false});
  }

  // Token is present, validate it
  // Token is present. Validate it
  return jwt.verify(
    req.cookies.authToken,
    "THIS_IS_A_SECRET_STRING",
    (err, tokenPayload) => {
      if (err) {
        // Scenario 2: FAIL - Error validating token
        return res.send({ isLoggedIn: false });
      }

      const userId = tokenPayload._id;

      // check if user exists
      return User.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          // Scenario 3: FAIL - Failed to find user based on id inside token payload
          return res.send({ isLoggedIn: false });
        }

        // Scenario 4: SUCCESS - token and user id are valid
        //console.log("user is currently logged in");
        return res.send({ isLoggedIn: true, user }); // return isLoggedIn and the user object
      });
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

exports.findByEmailPOST = (req, res, next) => {
  // if(!req.query.email) {return res.send('No email provided')}
  
  User.findOne({ email: req.body.email }, (err, user) => {
    // if fetch coming from Friends.js, will not use post
    // if fetch coming from Posts.js, will use posts only
    if (!err) {res.send({firstName: user.firstName, lastName: user.lastName, posts: user.posts ,success: true})}
    else {res.send({success: false})}
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

exports.addPost = (req, res, next) => {

  // create the post schema to be added
  const newPost = {
    postAuthor: req.body.postAuthor,
    timestamp: req.body.timestamp,
    content: req.body.content
  }

  // find the user that posted it and update the posts array
  User.findOneAndUpdate({_id: req.body.id },  // filter to find
    { $push: { posts: newPost } }, // push to the posts array our newPost
    function (err, user){
        if(err) {
          console.log("An error occured: "+err);
          return res.send({success: false});
        } else {
          console.log("New Post: ")
          console.log(newPost);
          return res.send({success:true});
        }
      }
  );
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

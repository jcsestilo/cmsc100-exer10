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

// exports.findAll = (req, res, next) => {
//   User.find((err, user) => {
//     if (!err) { res.send(user) }
//   })
// }

// exports.findById = (req, res, next) => {
//   if (!req.query.id) { return res.send('No id provided') }

//   User.findOne({ _id: req.query.id}, (err, user) => {
//     if (!err) { res.send(user) }
//   })
// }

exports.findProfile = (req, res, next) => {
  // case 1: first name is null but last name has value
  if(req.body.firstName=='' && req.body.lastName!=''){
    User.findOne({ lastName: req.body.lastName }, (err, user) => {
      if(!err) {
        res.send({success: true, 
          id: user._id,
          firstName: user.firstName, 
          lastName: user.lastName, 
          email: user.email, 
          age: user.age})
      } else{
        res.send({success:false, noInput: false})
      }
    })
  }
  // case 2: last name is null but first name has value
  else if(req.body.lastName=='' && req.body.firstName!=''){
    User.findOne({ firstName: req.body.firstName }, (err, user) => {
      if(!err) {
        return res.send({success: true,
          id: user._id, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          email: user.email, 
          age: user.age});
      } else{
        return res.send({success:false, noInput: false})
      }
    })
  }
  // case 3: first name and last name both have values
  else if(req.body.firstName!='' && req.body.lastName){
    // we will use the postAuthor in posts as a selector
    var fullName = req.body.firstName + ' ' + req.body.lastName;

    User.findOne({ "posts.$.postAuthor": fullName }, (err, user) => {
      if(!err){
        return res.send({
          success: true,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age
        });
      } else {
        return res.send({success:false, noInput: false})
      }
    })
  }
  // case 4: first name and last name both no values
  else{
    return res.send({success:false, noInput: true})
  }
}

exports.findByEmailPOST = (req, res, next) => {
  // if(!req.query.email) {return res.send('No email provided')}
  
  User.findOne({ email: req.body.email }, (err, user) => {
    // if fetch coming from Friends.js, will not use post
    // if fetch coming from Posts.js, will use posts only
    if (!err) {res.send({firstName: user.firstName, lastName: user.lastName, posts: user.posts , id: user._id, success: true})}
    else {res.send({success: false})}
  })
}

exports.rejectFriendRequest = (req, res, next) => {
  User.updateOne({ "_id": req.body.userID },
    {$pull: { friendReqs: req.body.requesteeEmail }},
    function(err, user) {
      if(err){
        console.log("Error for updating user:")
        console.log(err)
        return res.send({success:false})
      } else {
        console.log("Pulling requestee email from friend requests:")
        console.log(user)
      }
    }
  )
}

exports.acceptFriendRequest = (req, res, next) => {

  // add the email of the requestee to the friends of user
  User.updateOne({ "_id": req.body.userID }, 
  { $push: { friends: req.body.requesteeEmail }},
  function(err, user) {
    if(err){
      console.log("Error for updating user:")
      console.log(err)
      return res.send({success:false})
    } else {
      console.log("Pushing requestee email to friends:")
      console.log(user)
    }
  }
  )
  // also remove from friendReqs array the email of the requestee
  User.updateOne({ "_id": req.body.userID },
  {$pull: { friendReqs: req.body.requesteeEmail }},
  function(err, user) {
    if(err){
      console.log("Error for updating user:")
      console.log(err)
      return res.send({success:false})
    } else {
      console.log("Pulling requestee email from friend requests:")
      console.log(user)
    }
  }

  )

  // after updating the friends of user, we now update the friends of the requestee
  User.updateOne({ "_id": req.body.requesteeID },
  { $push: { friends: req.body.userEmail } },
  function(err, user){
    if(err){
      console.log("Error for updating requestee:")
      console.log(err)
      return res.send({success: false})
    } else { 
      console.log("Pushing user email to requestee friends:")
      console.log(user)
      // at this point, all operations are successful
      return res.send({success: true})
    }
  }
  )
}

exports.editPost = (req, res, next) => {
  User.findOneAndUpdate({ "_id": req.body.userID, "posts._id": req.body.postID},
  { $set: { "posts.$.content": req.body.editedPost }},
  function(err, user){
    if(err){
      console.log("An error occured")
      console.log(err)
      return res.send({success: false});
    } else {
      console.log("Result:")
      console.log(user)
      return res.send({success: true})
    }
  }
  )
}

exports.deletePost = (req, res, next) => {
  User.findOneAndUpdate({ "_id": req.body.userID },
  { $pull: { 'posts': { _id: req.body.postID} } },
  function(err, user){
    if(err){
      console.log("An error occured")
      console.log(err)
      return res.send({success: false});
    } else {
      console.log("Result:")
      console.log(user)
      return res.send({success: true});
    }
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

exports.getSuggestedUser = (req, res, next) => {
  var exclude = req.body.friends.slice()
  exclude.push(req.body.userEmail)


  // will return an array of users
  User.find({ $and: [{"email": {$nin: exclude}}, {"friendReqs": { $ne: req.body.userEmail} } ] }, 
  (err, user) => {
    if(!err){
      return res.send({ user, success:true})
    } else{
      console.log("Error on getting suggested users:")
      console.log(err)
      return res.send({success: false})
    }
  })
}

exports.sendFriendRequest = (req, res, next) => {
  User.updateOne({ "_id": req.body.receiverID },
    { $push: {friendReqs: req.body.userEmail}},
    (err, result) => {
      if(!err){
        console.log("Successful sending friend request.")
        return res.send({success: true})
      } else {
        console.log("Error sending friend request.")
        console.log(err)
        return res.send({success: false})
      }
    }
  )
}

// exports.add = (req, res, next) => {

//   const newUser = new User({
//     title: req.body.title,
//     developer: req.body.developer,
//     year: req.body.year,
//     online: req.body.online,
//     maxLocalPlayers: req.body.maxLocalPlayers
//   })

//   newUser.save((err) => {
//     if (!err) { res.send(newUser)}
//     else { res.send('Unable to save user') }
//   })
// }

// exports.deleteById = (req, res, next) => {
//   User.findOneAndDelete({ _id: req.body.id }, (err, user) => {
//     if (!err && user) {
//       res.send('Successfully deleted ' + user.firstName)
//     }
//     else {
//       res.send('Unable to delete user')
//     }
//   })
// }

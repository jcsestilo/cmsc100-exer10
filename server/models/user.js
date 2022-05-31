// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// create another schema for the posts, sub schema for userSchema
const postSubSchema = new mongoose.Schema({
  postAuthor: { type: String, required: true }, // email of the poster
  timestamp: { type: Date, required: true },
  content: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  friends: {type: [String]},
  friendReqs: {type: [String]},
  posts: {type: [postSubSchema]}  // an array of posts, with the schema from above
});

UserSchema.pre("save", function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model("User", UserSchema);
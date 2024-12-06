// User Document Schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');   
const SALT_WORK_FACTOR = 10;

const User = new mongoose.Schema({
    name: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    email: {type: String, required: true},
    reputation: {type: Number, default: 100},
    isAdmin: {type: Boolean, default: false},
    joinedDate: {type: Date, required: true, default: Date.now}
});


// Credit for this hashing code: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
User.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function(candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

// Post.virtual('url').get(function () {
//     return `/posts/${this._id}`;
// });

// Post.set('toJSON', { virtuals: true });
// Post.set('toObject', { virtuals: true });

module.exports = mongoose.model("User", User);
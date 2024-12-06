const mongoose = require('mongoose');
const CommunityModel = require('./models/communities');
const PostModel = require('./models/posts');
const CommentModel = require('./models/comments');
const LinkFlairModel = require('./models/linkflairs');
const UserModel = require('./models/users');


let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let mongoDB = userArgs[0];
mongoose.connect(mongoDB);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function testPasswords() {
    const gojo = await UserModel.findOne({ name: 'gojo' });
    // test a matching password
    var isMatch = await gojo.comparePassword('TheStrongest123');
    console.log("gojo - TheStrongest123: " + isMatch);


    // test a failing password
    isMatch = await gojo.comparePassword('TheWeakest456');
    console.log("gojo - TheWeakest456: " + isMatch);
}

testPasswords();
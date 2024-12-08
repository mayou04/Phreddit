// Post Document Schema
const mongoose = require('mongoose');
const Post = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 100},
    content: {type: String, required: true},
    linkFlairID: {type: mongoose.Schema.Types.ObjectId, ref: 'LinkFlair', default: null},
    postedBy: {type: String, required: true},
    postedDate: {type: Date, required: true, default: Date.now},
    commentIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    views: {type: Number, required: true, default: 0},
    voteCount: {type: Number, default: 1},
});

Post.virtual('url').get(function () {
    return `/posts/${this._id}`;
});

Post.set('toJSON', { virtuals: true });
Post.set('toObject', { virtuals: true });

module.exports = mongoose.model("Post", Post);
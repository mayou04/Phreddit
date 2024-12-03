// Comment Document Schema
const mongoose = require('mongoose');
const Comment = new mongoose.Schema({
    content: {type: String, required: true, maxLength: 500},
    commentIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    commentedBy: {type: String, required: true},
    commentedDate: {type: Date, required: true, default: Date.now}
});

Comment.virtual('url').get(function () {
    return `/comments/${this._id}`;
});

module.exports = mongoose.model("Comment", Comment);
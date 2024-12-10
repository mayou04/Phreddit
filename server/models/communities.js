// Community Document Schema
const mongoose = require('mongoose');
const Community = new mongoose.Schema({
    name: {type: String, required: true, maxLength: 100},
    description: {type: String, required: true, maxLength: 500},
    postIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    startDate: {type: Date, required: true, default: Date.now},
    members: [{type: String, required: true}],
    createdBy: {type: String, required: true},
});

Community.virtual('memberCount').get(function () {
    return this.members.length;
});

Community.virtual('url').get(function () {
    return `/communities/${this._id}`;
});

module.exports = mongoose.model("Community", Community);
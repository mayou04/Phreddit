// LinkFlair Document Schema
const mongoose = require('mongoose');
const LinkFlair = new mongoose.Schema({
    content: {type: String, required: true, maxLength: 30}
});

LinkFlair.virtual('url').get(function () {
    return `/linkFlairs/${this._id}`;
});

module.exports = mongoose.model("LinkFlair", LinkFlair);
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/phreddit");
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));

const CommunityModel = require('./models/communities');
const PostModel = require('./models/posts');
const CommentModel = require('./models/comments');
const LinkFlairModel = require('./models/linkflairs');

async function queryPosts(selector, selectorValue) {
    try {
        const query = {};
        if (Array.isArray(selector) && Array.isArray(selectorValue) && selector.length === selectorValue.length) {
            for (let i = 0; i < selector.length; i++) {
                query[selector[i]] = selectorValue[i];
            }
        }
        else if (typeof selector === "string") {
            query[selector] = selectorValue;
        }
        else {
            throw new Error("Invalid input for queryPosts");
        }
        const posts = await PostModel.find(query);
        return posts || null;
    } catch (err) {
        return "Error while fetching posts: " + err;
    }
}

async function queryCommunities(selector, selectorValue) {
    try {
        const query = {};
        if (Array.isArray(selector) && Array.isArray(selectorValue) && selector.length === selectorValue.length) {
            for (let i = 0; i < selector.length; i++) {
                query[selector[i]] = selectorValue[i];
            }
        }
        else if (typeof selector === "string") {
            query[selector] = selectorValue;
        }
        else {
            throw new Error("Invalid input for queryCommunities");
        }
        const communities = await CommunityModel.find(query);
        return communities || null;
    } catch (err) {
        return "Error while fetching communities: " + err;
    }
}

async function queryComments(selector, selectorValue) {
    try {
        const query = {};
        if (Array.isArray(selector) && Array.isArray(selectorValue) && selector.length === selectorValue.length) {
            for (let i = 0; i < selector.length; i++) {
                query[selector[i]] = selectorValue[i];
            }
        }
        else if (typeof selector === "string") {
            query[selector] = selectorValue;
        }
        else {
            throw new Error("Invalid input for queryComments");
        }
        const comments = await CommentModel.find(query);
        return comments || null;
    } catch (err) {
        return "Error while fetching comments: " + err;
    }
}

async function queryLinkFlairs(selector, selectorValue) {
    try {
        const query = {};
        if (Array.isArray(selector) && Array.isArray(selectorValue) && selector.length === selectorValue.length) {
            for (let i = 0; i < selector.length; i++) {
                query[selector[i]] = selectorValue[i];
            }
        }
        else if (typeof selector === "string") {
            query[selector] = selectorValue;
        }
        else {
            throw new Error("Invalid input for queryLinkFlairs");
        }
        const linkFlairs = await LinkFlairModel.find(query);
        return linkFlairs || null;
    } catch (err) {
        return "Error while fetching link flairs: " + err;
    }
}

module.exports = {queryPosts, queryComments, queryCommunities, queryLinkFlairs};
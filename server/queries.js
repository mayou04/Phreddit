const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/phreddit");
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));

const CommunityModel = require('./models/communities');
const PostModel = require('./models/posts');
const CommentModel = require('./models/comments');
const LinkFlairModel = require('./models/linkflairs');
const UserModel = require('./models/users');

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

async function queryUsers(selector, selectorValue) {
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
            throw new Error("Invalid input for queryUsers");
        }
        const users = await UserModel.find(query);
        return users || null;
    } catch (err) {
        return "Error while fetching users: " + err;
    }
}

async function passwordMatches(useremail, password) {
    const user = await UserModel.findOne({ email: useremail });
    var isMatch = await user.comparePassword(password);
    return isMatch;
}

async function deleteCommentAndReplies(commentID) {
    const comment = await CommentModel.findOne({ _id: commentID });
    var replies = comment.commentIDs;
    await CommentModel.updateMany(
        { commentIDs: commentID },
        { $pull: { commentIDs: commentID } }
    );
    await comment.deleteOne();
    for (let i = 0; i < replies.length; i++) {
        await deleteCommentAndReplies(replies[i]);
    }
}

async function deletePost(postID) {
    const post = await PostModel.findOne({ _id: postID });
    var comments = post.commentIDs;
    await post.deleteOne();
    for (let i = 0; i < comments.length; i++) {
        await deleteCommentAndReplies(comments[i]);
    }
}

async function deleteCommunity(communityID) {
    const community = await CommunityModel.findOne({ _id: communityID });
    var posts = community.postIDs;
    await community.deleteOne();
    for (let i = 0; i < posts.length; i++) {
        await deletePost(posts[i]);
    }
}

async function deleteUser(userID) {
    const user = await UserModel.findOne({_id: userID});
    var communities = getCommunitiesByCreator(user.name);
    for (let i = 0; i < communities.length; i++) {
        await deleteCommunity(communities[i]);
    }
    var posts = await PostModel.find({ postedBy: user.name });
    for (let i = 0; i < posts.length; i++) {
        await deletePost(posts[i]);
    }
    var comments = await CommentModel.find({ commentedBy: user.name });
    for (let i = 0; i < comments.length; i++) {
        await deleteCommentAndReplies(comments[i]);
    }
}

async function getCommunitiesByMember(memberName) {
    const communities = await CommunityModel.find({
        members: {
            $in: [memberName],
        }
    });
    return communities;
}

async function getCommunitiesByCreator(creatorName) {
    const communities = await CommunityModel.find({
        createdBy: creatorName,
    });
    return communities;
}

module.exports = {queryPosts, queryComments, queryCommunities, queryLinkFlairs, queryUsers, passwordMatches, deletePost, deleteCommentAndReplies, deleteCommunity, deleteUser, getCommunitiesByMember, getCommunitiesByCreator};
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = 8000;
const {queryPosts, queryComments, queryCommunities, queryLinkFlairs, queryUsers, passwordMatches, deletePost, deleteCommentAndReplies, deleteCommunity, deleteUser, getCommunitiesByMember, getCommunitiesByCreator} = require('./queries.js');
const cors = require('cors');

const CommunityModel = require('./models/communities');
const PostModel = require('./models/posts');
const CommentModel = require('./models/comments');
const LinkFlairModel = require('./models/linkflairs');
const UserModel = require('./models/users');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true   
}));
app.use(cookieParser());
app.use(session({
    secret: "mIFIyqgeFaMLAxSICzBAwaFlu2VHwl", // Usually would store this in a non-public file, but it's needed for graders cloning the repo
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Since we aren't implementing HTTPS for this project
        maxAge: 1000 /* ms */ * 60 /* sec */ * 60 /* min */ * 6 /* hours */,
    }
}));

const isAdminOrCreator = async (req, res, next) => {
    const user = req.session.user;
    if (!user) return res.json({error: "Unauthorized"});

    var postID = req.params.postID;
    if (postID) var item = await PostModel.findById(postID);
    if (item) {
        if (user.isAdmin || item.postedBy.toString() === user.name) {
            return next(); // User is authorized
        }
    }
    var commentID = req.params.commentID;
    if (commentID) var item = await CommentModel.findById(commentID);
    if (!item) return res.json({error: "Item not found"});

    if (user.isAdmin || item.commentedBy.toString() === user.name) {
        return next(); // User is authorized
    }

    res.json({error: "No permission to modify this item"});
};

const isAdminOrCommunityCreator = async (req, res, next) => {
    const { user } = req.session;
    if (!user) return res.json({error: "Unauthorized"});

    const { itemId } = req.params;
    if (!item) item = await CommunityModel.findById(itemId);
    if (!item) return res.json({error: "Item not found"});

    if (user.isAdmin || item.createdBy.toString() === user.name) {
        return next(); // User is authorized
    }

    res.json({error: "No permission to modify this item"});
};

const isAdminOrSelf = async (req, res, next) => {
    const { user } = req.session;
    if (!user) return res.json({error: "Unauthorized"});

    const { itemId } = req.params;
    const item = await UserModel.findById(itemId);
    if (!item) return res.json({error: "Item not found"});

    if (user.isAdmin || item.name === user.name) {
        return next(); // User is authorized
    }

    res.json({error: "No permission to modify this user"});
}

const isLoggedIn = async (req, res, next) => {
    if (req.session.user) next();
    else res.json({error: "Not logged in"});
};

app.get("/", async (req, res) => {
    res.json({message: "Running"});
});

app.get("/posts/", async (req, res) => {
    const posts = await queryPosts([], []);
    res.send(posts);
});

app.post("/posts/make", isLoggedIn, async (req, res) => {
    try {
        let newPost = req.body;
        const post = await PostModel.create({
            title: newPost.title,
            content: newPost.content,
            postedBy: req.session.user.name,
            postedDate: newPost.postedDate,
            views: newPost.views,
            linkFlairID: newPost.linkFlairID,
            commentIDs: newPost.commentIDs
        });
        res.send(post._id);
    }
    catch (err) {
        res.json({error: "Error making post"});
    }
});

app.put("/posts/update/:postID", isAdminOrCreator, async (req, res) => {
    try {
        const postID = req.params.postID;
        const newData = req.body;
        const updatedPost = await PostModel.findByIdAndUpdate(postID, newData);
        res.json(updatedPost);
    } 
    catch (err) {
        res.json({error: "Error updating post"});
    }
});

app.put("/posts/addView/:postID", async (req, res) => {
    try {
        const postID = req.params.postID;
        const result = await PostModel.findByIdAndUpdate(
            postID,
            {$inc: {views: 1}}
        );
        if (!result) return res.json({error: "Post not found"});
        res.json({message: "Success"});
    }
    catch (err) {
        res.json({error: "Error adding view to post"});
    }
});

app.put("/posts/addUpvote/:postID", async (req, res) => {
    try {
        const postID = req.params.postID;
        const result = await PostModel.findByIdAndUpdate(
            postID,
            {$inc: {voteCount: 1}},
            {new: true}
        );
        if (!result) return res.json({error: "Post not found"});
        const user = await UserModel.findOne({name: result.postedBy});
        await UserModel.findByIdAndUpdate(
            user._id,
            {$inc: {reputation: 5}},
        );
        res.json({message: "Success"});
    }
    catch (err) {
        res.json({error: "Error adding upvote to post"});
    }
});

app.put("/posts/addDownvote/:postID", async (req, res) => {
    try {
        const postID = req.params.postID;
        const result = await PostModel.findByIdAndUpdate(
            postID,
            {$inc: {voteCount: -1}},
            {new: true}
        );
        if (!result) return res.json({error: "Post not found"});
        const user = await UserModel.findOne({name: result.postedBy});
        await UserModel.findByIdAndUpdate(
            user._id,
            {$inc: {reputation: -10}},
        );
        res.json({message: "Success"});
    }
    catch (err) {
        res.json({error: "Error adding downvote to post"});
    }
});

app.delete("/posts/delete/:postID", isAdminOrCreator, async (req, res) => {
    try {
        const postID = req.params.postID;
        await deletePost(postID);
        res.json({message: "Post successfully deleted"});
    }
    catch (err) {
        res.json({error: "Error deleting post"});
    }
});

app.get("/communities/", async (req, res) => {
    const communities = await queryCommunities([], []);
    res.send(communities);
});

app.post("/communities/make", isLoggedIn, async (req, res) => {
    try {
        let newCommunity = req.body;
        const community = await CommunityModel.create({
            name: newCommunity.name,
            description: newCommunity.description,
            postIDs: newCommunity.postIDs,
            startDate: newCommunity.startDate,
            members: newCommunity.members,
            createdBy: req.session.user.name,
        });
        res.send(community._id);
    }
    catch (err) {
        res.json({error: "Error making community"});
    }
});

app.put("/communities/update/:communityID", isAdminOrCommunityCreator, async (req, res) => {
    try {
        const communityID = req.params.communityID;
        const newData = req.body;
        const updatedCommunity = await CommunityModel.findByIdAndUpdate(communityID, newData);
        res.json(updatedCommunity);
    } 
    catch (err) {
        res.json({error: "Error updating community"});
    }

});
app.put("/communities/addPost/:communityID", async (req, res) => {
    try {
        const communityID = req.params.communityID;
        const newData = req.body;
        const updatedCommunity = await CommunityModel.findByIdAndUpdate(communityID, newData);
        res.json(updatedCommunity);
    } 
    catch (err) {
        res.json({error: "Error updating community"});
    }
});

app.delete("/communities/delete/:communityID", isAdminOrCommunityCreator, async (req, res) => {
    try {
        const communityID = req.params.communityID;
        await deleteCommunity(communityID);
        res.json({message: "Community successfully deleted"});
    }
    catch (err) {
        res.json({error: "Error deleting community"});
    }
});

app.post("/communities/join/:communityID", isLoggedIn, async (req, res) => {
    try {
        const community = await CommunityModel.findById(req.params.communityID);
        if (!community) return res.json({error: "Community not found"});
        if (!community.members.includes(req.session.user.name)) {
            community.members.push(req.session.user.name);
            await community.save();
        }
        res.json({message: "Joined community"});
    } catch (err) {
        res.json({ error: "Error joining community" });
    }
});

app.post("/communities/leave/:communityID", isLoggedIn, async (req, res) => {
    try {
        const community = await CommunityModel.findById(req.params.communityID);
        if (!community) return res.json({error: "Community not found"});
        community.members = community.members.filter(
            (member) => (member !== req.session.user.name)
        );
        await community.save();
        res.json({message: "Left community"});
    } catch (err) {
        res.json({error: "Error leaving community"});
    }
});

app.get("/comments/", async (req, res) => {
    const comments = await queryComments([], []);
    res.json(comments);
});

app.post("/comments/make", isLoggedIn, async (req, res) => {
    console.log("ASA");
    try {
        let newComment = req.body;
        const comment = await CommentModel.create({
            content: newComment.content,
            commentedBy: newComment.commentedBy,
            commentedDate: newComment.commentedDate,
            commentIDs: newComment.commentIDs
        });
        res.send(comment._id);
    }
    catch (err) {
        res.json({error: "Error making comment"});
    }
});

app.put("/comments/update/:commentID", isAdminOrCreator, async (req, res) => {
    try {
        const commentID = req.params.commentID;
        const newData = req.body;
        await CommentModel.findByIdAndUpdate(commentID, newData);
        res.json({message: "Comment successfully updated"});
    } 
    catch (err) {
        res.json({error: "Error updating comment"});
    }
});

app.put("/comments/addUpvote/:commentID", async (req, res) => {
    try {
        const commentID = req.params.commentID;
        const result = await CommentModel.findByIdAndUpdate(
            commentID,
            {$inc: {voteCount: 1}},
            {new: true}
        );
        if (!result) return res.json({error: "Comment not found"});
        const user = await UserModel.findOne({name: result.commentedBy});
        await UserModel.findByIdAndUpdate(
            user._id,
            {$inc: {reputation: 5}},
        );
        res.json({message: "Success"});
    }
    catch (err) {
        res.json({error: "Error adding upvote to comment"});
    }
});

app.put("/comments/addDownvote/:commentID", async (req, res) => {
    try {
        const commentID = req.params.commentID;
        const result = await CommentModel.findByIdAndUpdate(
            commentID,
            {$inc: {voteCount: -1}},
            {new: true}
        );
        if (!result) return res.json({error: "Comment not found"});
        const user = await UserModel.findOne({name: result.commentedBy});
        await UserModel.findByIdAndUpdate(
            user._id,
            {$inc: {reputation: -10}},
        );
        res.json({message: "Success"});
    }
    catch (err) {
        res.json({error: "Error adding upvote to comment"});
    }
});

app.delete("/comments/delete/:commentID", isAdminOrCreator, async (req, res) => {
    try {
        const commentID = req.params.commentID;
        await deleteCommentAndReplies(commentID);
        res.json({message: "Comment successfully deleted"});
    }
    catch (err) {
        res.json({error: "Error deleting comment"});
    }
});

app.get("/linkflairs/", async (req, res) => {
    const linkFlairs = await queryLinkFlairs([], []);
    res.send(linkFlairs);
});

app.post("/linkflairs/make", isLoggedIn, async (req, res) => {
    try {
        let newLinkFlair = req.body;
        const linkFlair = await LinkFlairModel.create({
            content: newLinkFlair.content
        });
        res.send(linkFlair._id);
    }
    catch (err) {
        res.json({error: "Error making link flair"});
    }
});


app.get("/users/", async (req, res) => {
    const users = await UserModel.find().select("-password");
    res.send(users);
});

app.get("/users/byName/:userName", async (req, res) => {
    try {
        const user = await UserModel.find({name: req.params.userName}).select("-password");
        const posts = await PostModel.find({ postedBy: req.params.userName });
        const comments = await CommentModel.find({ commentedBy: req.params.userName });
        const memberOfCommunities = await getCommunitiesByMember(req.params.userName);
        const creatorOfCommunities = await getCommunitiesByCreator(req.params.userName);
        res.json({user, posts, comments, memberOfCommunities, creatorOfCommunities});
    } catch (err) {
        res.json({error: "Error fetching user profile"});
    }
});

app.get("/users/byID/:userID", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userID).select("-password");
        const posts = await PostModel.find({ postedBy: user.name });
        const comments = await CommentModel.find({ commentedBy: user.name });
        const memberOfCommunities = await getCommunitiesByMember(user.name);
        const creatorOfCommunities = await getCommunitiesByCreator(user.name);
        res.json({user, posts, comments, memberOfCommunities, creatorOfCommunities});
    } catch (err) {
        res.json({error: "Error fetching user profile"});
    }
});

app.put("/users/update/:userID", isAdminOrSelf, async (req, res) => {
    try {
        const userID = req.params.userID;
        const newData = req.body;
        await UserModel.findByIdAndUpdate(userID, newData);
    } 
    catch (err) {
        res.json({error: "Error updating user"});
    }
});

app.delete("/users/delete/:userID", isAdminOrSelf, async (req, res) => {
    try {
        const userID = req.params.userID;
        await deleteUser(userID);
        res.json({message: "User successfully deleted"});
    }
    catch (err) {
        res.json({error: "Error deleting user"});
    }
});

app.post("/register", async (req, res) => {
    try {
        let userDetails = req.body;
        let newReputation = 100;
        if (userDetails.isAdmin === true) newReputation = 1000;
        const user = await UserModel.create({
            name: userDetails.name,
            password: userDetails.password,
            email: userDetails.email,
            reputation: newReputation,
            isAdmin: userDetails.isAdmin,
            joinedDate: userDetails.joinedDate,
        });
        res.send(user.name);
    }
    catch (err) {
        res.json({error: "Error making user"});
    }
});

app.post("/login", async (req, res) => {
    let userDetails = req.body;
    isMatch = await passwordMatches(userDetails.email, userDetails.password);
    if (isMatch === false) return res.json({error: "Invalid password"});

    const user = await UserModel.findOne({email: userDetails.email});
    // console.log(user);
    req.session.user = {
        id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
    };
    req.session.save();
    res.json({message: 'Login successful'});
});

app.get("/status", (req, res) => {
    // console.log(req.session);
    if (req.session.user) return res.json({
        isLoggedIn: true,
        user: req.session.user,
    });
    return res.json({isLoggedIn: false, user: null});
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({message: "Successfully logged out"});
    });
});


app.listen(port, () => {console.log(`Server listening on port ${port}...`);});

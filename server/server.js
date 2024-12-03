// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const app = express();
const port = 8000;
const {queryPosts, queryComments, queryCommunities, queryLinkFlairs} = require('./queries.js');
const cors = require('cors');

const CommunityModel = require('./models/communities');
const PostModel = require('./models/posts');
const CommentModel = require('./models/comments');
const LinkFlairModel = require('./models/linkflairs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
    res.send({});
});

app.get("/posts/", async (req, res) => {
    const posts = await queryPosts([], []);
    res.send(posts);
});

app.post("/posts/make", async (req, res) => {
    try {
        let newPost = req.body;
        const post = await PostModel.create({
            title: newPost.title,
            content: newPost.content,
            postedBy: newPost.postedBy,
            postedDate: newPost.postedDate,
            views: newPost.views,
            linkFlairID: newPost.linkFlairID,
            commentIDs: newPost.commentIDs
        });
        res.send(post._id);
    }
    catch (err) {
        res.send("Error making post");
    }
});

app.put("/posts/update/:postID", async (req, res) => {
    try {
        const postID = req.params.postID;
        const newData = req.body;
        await PostModel.findByIdAndUpdate(postID, newData);
    } 
    catch (err) {
        res.send("Error updating post");
    }
});

app.get("/communities/", async (req, res) => {
    const communities = await queryCommunities([], []);
    res.send(communities);
});

app.post("/communities/make", async (req, res) => {
    try {
        let newCommunity = req.body;
        const community = await CommunityModel.create({
            name: newCommunity.name,
            description: newCommunity.description,
            postIDs: newCommunity.postIDs,
            startDate: newCommunity.startDate,
            members: newCommunity.members
        });
        res.send(community._id);
    }
    catch (err) {
        res.send("Error making community");
    }
});

app.put("/communities/update/:communityID", async (req, res) => {
    try {
        const communityID = req.params.communityID;
        const newData = req.body;
        const updatedCommunity = await CommunityModel.findByIdAndUpdate(communityID, newData);
        res.json(updatedCommunity);
    } 
    catch (err) {
        res.send("Error updating community");
    }
});

app.get("/comments/", async (req, res) => {
    const comments = await queryComments([], []);
    res.send(comments);
});

app.post("/comments/make", async (req, res) => {
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
        res.send("Error making comment");
    }
});

app.put("/comments/update/:commentID", async (req, res) => {
    try {
        const commentID = req.params.commentID;
        const newData = req.body;
        await CommentModel.findByIdAndUpdate(commentID, newData);
    } 
    catch (err) {
        res.send("Error updating comment");
    }
});

app.get("/linkflairs/", async (req, res) => {
    const linkFlairs = await queryLinkFlairs([], []);
    res.send(linkFlairs);
});

app.post("/linkflairs/make", async (req, res) => {
    try {
        let newLinkFlair = req.body;
        const linkFlair = await LinkFlairModel.create({
            content: newLinkFlair.content
        });
        res.send(linkFlair._id);
    }
    catch (err) {
        res.send("Error making link flair");
    }
});

app.put("/linkflairs/update/:linkFlairID", async (req, res) => {
    try {
        const linkFlairID = req.params._id;
        const newData = req.body;
        await LinkFlairModel.findByIdAndUpdate(linkFlairID, newData);
    } 
    catch (err) {
        res.send("Error updating link flair");
    }
});

app.listen(port, () => {console.log(`Server listening on port ${port}...`);});

const mongoose = require("mongoose");
const {deletePost} = require("./queries.js");
const CommentModel = require("./models/comments");
const PostModel = require("./models/posts");

async function createComment(commentObj) {
    let newCommentDoc = new CommentModel({
        content: commentObj.content,
        commentedBy: commentObj.commentedBy,
        commentedDate: commentObj.commentedDate,
        commentIDs: commentObj.commentIDs,
    });
    return newCommentDoc.save();
}

async function createPost(postObj) {
    let newPostDoc = new PostModel({
        title: postObj.title,
        content: postObj.content,
        postedBy: postObj.postedBy,
        postedDate: postObj.postedDate,
        views: postObj.views,
        linkFlairID: postObj.linkFlairID,
        commentIDs: postObj.commentIDs,
    });
    return newPostDoc.save();
}

// beforeAll(async () => {
//     await mongoose.connect("mongodb://localhost:27017/phreddit", { useNewUrlParser: true, useUnifiedTopology: true });
// });


test("When a post is deleted, it and all of its comments are removed from the database", async () => {
    const comment1 = {
        commentID: 'comment1',
        content: "Don't blame your team and maybe you'll start to climb...",
        commentIDs: [],
        commentedBy: 'dylanISCOOL',
        commentedDate: new Date('November 9, 2024 15:22:00'),
        voteCount: 11,
    };
    let commentRef1 = await createComment(comment1);
    const comment3 = {
        commentID: 'comment3',
        content: "Just like you carried against Sukuna? 💀",
        commentIDs: [],
        commentedBy: 'dylanISCOOL',
        commentedDate: new Date('November 10, 2024 09:00:03'),
        voteCount: 3,
    };
    let commentRef3 = await createComment(comment3);
    const comment2 = {
        commentID: 'comment2',
        content: "Just be The Strongest like me and you can carry every game",
        commentIDs: [commentRef3._id],
        commentedBy: 'gojo',
        commentedDate: new Date('November 10, 2024 08:36:00'),
        voteCount: -5,
    };
    let commentRef2 = await createComment(comment2);
    const post1 = {
        title: "How do I improve at League of Legends?",
        content: "I've been playing League of Legends for 7 years and I'm still stuck in the lowest rank. I think it's my teammates' fault, but I'm open to tips.",
        linkFlairID: null,
        postedBy: "dylanISCOOL",
        postedDate: new Date('November 9, 2024 12:47:00'),
        commentIDs: [commentRef1._id, commentRef2._id],
        views: 15,
        voteCount: -3,
    };
    let postRef1 = await createPost(post1);

    const postID = postRef1._id;
    const commentIDs = [commentRef1._id, commentRef2._id, commentRef3._id];

    expect(await PostModel.findById(postID)).not.toBeNull();
    expect(await CommentModel.findById(commentIDs[0])).not.toBeNull();
    expect(await CommentModel.findById(commentIDs[1])).not.toBeNull();
    expect(await CommentModel.findById(commentIDs[2])).not.toBeNull();

    await deletePost(postID);

    expect(await PostModel.findById(postID)).toBeNull();
    expect(await CommentModel.findById(commentIDs[0])).toBeNull();
    expect(await CommentModel.findById(commentIDs[1])).toBeNull();
    expect(await CommentModel.findById(commentIDs[2])).toBeNull();

});

afterAll(async () => {
    await mongoose.connection.close();
});
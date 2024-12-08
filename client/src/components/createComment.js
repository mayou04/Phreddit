import { useState, useEffect } from "react"; 
import { usePage } from "../contexts/pageContext.js";
import Error from './error.js';
import * as utils from '../utility.js';
import Post from "./post.js";

export default function CreateComment(props) {
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    
    const [commentContent, setCommentContent] = useState("");
    const [commentCreator, setCommentCreator] = useState("");
    const[post, setPost] = useState([]); // not really post
    const[community, setComm] = useState([]);
    const[linkFlair, setFlair] = useState([]);
    const[commentCount, setCommCount] = useState([]);

    const postID = props.postID;
    const parent = props.parent;
    // const post = props.post;
    // THIS IS THE PARENT POST/COMMENT

    useEffect(()=> {
        async function makePosts() {
            const post = await utils.getPostObject(postID);
            const community = await utils.getCommunityFromPost(postID);
            const flair = await utils.getFlairObject(post.linkFlairID);
            const commentCount = await utils.getCommentCountForPost(postID);
            
            if (post){
                setPost(post);
            }
            if (community){
                setComm(community);
            }
            if (flair){
                setFlair(flair);
            }
            if (commentCount){
                setCommCount(commentCount);
            }
        }

        makePosts();
    }, []);

    console.log(post);
    console.log(community);
    console.log(linkFlair);
    console.log(commentCount);


    const displayError = (errorStr) => {
        setErrorMessage(errorStr);
    };

    async function submitComment(){
        if (commentContent.length === 0) {
            displayError("Comment content cannot be empty");
        }
        else if (commentContent.length > 500) {
            displayError("Comment content cannot be more than 500 characters");
        }
        else if (commentCreator.length === 0) {
            displayError("Must specify username of comment creator");
        }
        else {
            let comment = {};
            comment.commentIDs = [];
            comment.commentedBy = commentCreator;
            comment.commentedDate = new Date();
            comment.content = commentContent;

            const commentID = await utils.createComment(comment);

            // update post or comment
            parent.commentIDs.push(commentID);
            console.log(parent);
            if (parent._id === postID){
                console.log("post");
                setPost(utils.updatePost(parent._id, parent));
            } else{
                setPost(utils.updateComment(parent._id, parent));
            }
            

            console.log('Comment created:', comment);
            // console.log('All coments in model after creation:', model.data.comments);

            setPage(<Post postID={post._id} 
                post={post} 
                community={community} 
                flair={linkFlair}
                commentCount={commentCount}/>
            );
        }
    }

    return (
        <div id="make-item">
            <div id="make-comment">
                <p>Replying to:</p>
                <h4>{post.content}</h4>
                <hr/>
                <h5>Comment Content: <span className="small">(required)</span></h5>
                <textarea autoComplete="off" id="comment-content-field"  onChange={(e) => setCommentContent(e.target.value)}></textarea>
                {/* NO USER FIELD, CURRENT USER IS USER */}
                <h5>Comment Creator: <span className="small">(required)</span></h5>
                <input type="text" autoComplete="off" id="comment-creator-field"  onChange={(e) => setCommentCreator(e.target.value)}/>
                <br/>
                <input type="button" id="comment-submit-button" value="Submit Comment" onClick={() => submitComment()}/>
                    {errorMessage && <Error message={errorMessage} onClose={() => {
                        setErrorMessage(null);
                    }} />}
            </div>
        </div>
    );
}
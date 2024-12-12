import { useState, useEffect } from "react"; 
import { usePage } from "../contexts/pageContext.js";
import Error from './error.js';
import * as utils from '../utility.js';
import Post from "./post.js";
import Profile from './profile.js';

export default function CreateComment(props) {
    const name = props.name;
    const commentObject = props.comment;
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    const [commentContent, setCommentContent] = useState(commentObject.content || "");
    const[post, setPost] = useState([]); // not really post
    const[community, setComm] = useState([]);
    const[linkFlair, setFlair] = useState([]);
    const[commentCount, setCommCount] = useState([]);
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    

    const postID = props.postID;
    const parent = props.parent;
    // const post = props.post;
    // THIS IS THE PARENT POST/COMMENT

    // useEffect(()=> {
    //     async function makePosts() {
    //         const post = await utils.getPostObject(postID);
    //         const community = await utils.getCommunityFromPost(postID);
    //         const flair = await utils.getFlairObject(post.linkFlairID);
    //         const commentCount = await utils.getCommentCountForPost(postID);
            
    //         if (post){
    //             setPost(post);
    //         }
    //         if (community){
    //             setComm(community);
    //         }
    //         if (flair){
    //             setFlair(flair);
    //         }
    //         if (commentCount){
    //             setCommCount(commentCount);
    //         }
    //     }

    //     makePosts();
    // }, []);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const statusResponse = await utils.status();
                setStatus(statusResponse);
                setIsLoggedIn(statusResponse.isLoggedIn);
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        };

        checkStatus();
        
        // Set up an interval to check status periodically
        const intervalId = setInterval(checkStatus, 1000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array since we're using interval

    useEffect(() => {
        const fetchUser = async () => {
            if (status.user) {
                const users = await utils.requestData("http://localhost:8000/users");
                const currentUser = users.find(user => user.name === status.user);
                // setProfile(currentUser);
            }
        };

        fetchUser();
    }, [status.user]); // Only run when status.user changes

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
        else {
            commentObject.content = commentContent;

            const response = await utils.updateComment(commentObject._id, commentObject);

            console.log('Comment created:', response);
            // console.log('All coments in model after creation:', model.data.comments);

            setPage(<Profile name={name}/>);
        }
    }
    
    async function deleteComment(){
        const response = await utils.deleteComment(commentObject._id);

        console.log('Comment deleted:', response);

        setPage(<Profile name={name}/>);
    }

    return (
        <div id="make-item">
            <div id="make-comment">
                <p>Replying to:</p>
                <h4>{post.content}</h4>
                <hr/>
                <h5>Comment Content: <span className="small">(required)</span></h5>
                <textarea autoComplete="off" id="comment-content-field" value={commentContent} onChange={(e) => setCommentContent(e.target.value)}></textarea>
                <br/>
                <input type="button" id="comment-submit-button" value="Submit Comment" onClick={() => submitComment()}/>
                &nbsp;
                <input type="button" id="comment-submit-button" value="Delete Comment" onClick={() => deleteComment()}/>
                    {errorMessage && <Error message={errorMessage} onClose={() => {
                        setErrorMessage(null);
                    }} />
                    }
            </div>
        </div>
    );
}
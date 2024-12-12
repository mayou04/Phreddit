import { useEffect, useState } from "react";
import { usePage } from "../contexts/pageContext.js";
import * as utils from '../utility.js';
import Error from './error.js';
import Home from './home.js';
import Profile from './profile.js';


export default function EditPost(props) {
    const postID = props.post._id;
    const postObject = props.post;
    const name = props.name;
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    
    // const[postObject, setPostObject] = useState([]);
    const[communities, setCommunities] = useState([]);
    const[linkFlairs, setFlairs] = useState([]);

    const displayError = (errorStr) => {
        setErrorMessage(errorStr);
    };

    const [postTitle, setPostTitle] = useState(postObject.title || "");
    const [postContent, setPostContent] = useState(postObject.content || "");
    const [postCreator, setPostCreator] = useState("");
    const [communityID, setCommunityID] = useState("");
    const [linkFlairID, setLinkFlairID] = useState("no-flair");
    const [customLinkFlairID, setCustomLinkFlairID] = useState("");
    const [showCustomField, setShowCustomField] = useState(false);
    
    useEffect(()=> {
        async function fetchData() {
            setCommunities(await utils.requestData("http://localhost:8000/communities"));    
            setFlairs(await utils.requestData("http://localhost:8000/linkflairs"));
            // setPostObject(await utils.getPostObject(postID));
        }

        fetchData();
    }, []);

    // Have to access the object, display error correctly.
    async function submitPost(){
        if (postObject.title.length > 100) {
            displayError("Post title cannot be more than 100 characters");
        }
        else if (postObject.title.length === 0) {
            displayError("Post title cannot be empty");
        }
        else if (postObject.content.length === 0) {
            displayError("Post content cannot be empty");
        }
        else {

            postObject.title = postTitle;
            postObject.content = postContent;

            const response = await utils.updatePost(postID, postObject);

            console.log('Post updated:', response);

            // if (response){
            //     displayError("Error updating post");
            //     return;
            // }

            setPage(<Profile name={name}/>);
        }
    }

    async function deletePost(){
        const response = await utils.deletePost(postID);

        console.log('Post deleted:', response);

        setPage(<Profile name={name}/>);
    }

    return (
        <div id="make-item">
            <div id="make-post">
                <h5>Post Title: <span className="small">(required)</span></h5>
                <input type="text" autoComplete="off" id="post-title-field" value={postTitle} onChange={(e) => setPostTitle(e.target.value)}/>
                <h5>Post Content: <span className="small">(required)</span></h5>
                <textarea autoComplete="off" id="post-content-field" value={postContent} onChange={(e) => setPostContent(e.target.value)}></textarea>
                <br/>
                <input type="button" id="post-submit-button" value="Submit Post" onClick={() => submitPost()}/>
                &nbsp;
                <input type="button" id="post-submit-button" value="Delete Post" onClick={() => deletePost()}/>
                {errorMessage && <Error message={errorMessage} onClose={() => {
                    setErrorMessage(null);
                }} />}
            </div>
        </div>
    );
}
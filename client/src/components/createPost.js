import { useEffect, useState } from "react";
import { usePage } from "../contexts/pageContext.js";
import * as utils from '../utility.js';
import Error from './error.js';
import Home from './home.js';


export default function CreatePost(props) {
    const name = props.name;
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    
    const[communities, setCommunities] = useState([]);
    const[linkFlairs, setFlairs] = useState([]);

    const displayError = (errorStr) => {
        setErrorMessage(errorStr);
    };

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [postCreator, setPostCreator] = useState("");
    const [communityID, setCommunityID] = useState("");
    const [linkFlairID, setLinkFlairID] = useState("no-flair");
    const [customLinkFlairID, setCustomLinkFlairID] = useState("");
    const [showCustomField, setShowCustomField] = useState(false);
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    const [userData, setUserData] = useState([]);
    
    useEffect(()=> {
        async function fetchData() {
            setCommunities(await utils.requestData("http://localhost:8000/communities"));
            setFlairs(await utils.requestData("http://localhost:8000/linkflairs"));
            const userObject = await utils.getUserProfile(name);
            setUserData(await userObject);
        }

        fetchData();
    }, []);

    async function createNewFlair(flairContent) {
        let linkFlair = {};
        linkFlair.content = flairContent;
      
        if (linkFlair.content.length > 30) {
          displayError("New flair cannot be longer than 30 characters");
          return null;
        }
        else if (linkFlair.content.length === 0) {
          displayError("New flair cannot be empty");
          return null;
        }
        else if (await utils.getFlairIDFromText(linkFlair.content) !== undefined) {
          displayError("Flair already exists");
          return null;
        }
        else {
            linkFlair._id = await utils.createLinkFlair(linkFlair);
            if (linkFlair._id === "Error making link flair"){
                displayError("Error making link flair");
                return null;
            }
            
            return linkFlair._id;
        }
    }

    // Have to access the object, display error correctly.
    async function submitPost(){
        if (communityID === "") {
            displayError("Must choose a community to post to");
        }
        else if (postTitle.length > 100) {
            displayError("Post title cannot be more than 100 characters");
        }
        else if (postTitle.length === 0) {
            displayError("Post title cannot be empty");
        }
        else if (linkFlairID === null) {
            return;
        }
        else if (postContent.length === 0) {
            displayError("Post content cannot be empty");
        }
        else {
            let post = {};
            post.title = postTitle;
            post.content = postContent;
            post.postedDate = new Date();
            post.views = 0;
            if (linkFlairID === "no-flair") {
                post.linkFlairID = "000000000000000000000000";
            } else if (linkFlairID === "create-new-flair") {
                post.linkFlairID = await createNewFlair(customLinkFlairID);
                if (post.linkFlairID === null){
                    return;
                }
            } else {post.linkFlairID = linkFlairID;}
            post.commentIDs = [];

            // model.data.posts.push(post);
            const postID = await utils.createPost(post);

            if (postID === "Error making post"){
                displayError("Error making post");
                return;
            }

            const community = communities.find((obj)=> {
                return obj._id === communityID;
            })
            
            community.postIDs.push(postID);
            console.log(community);

            const response = utils.updateCommunityPosts(communityID, community);
            console.log('Post created:', response);

            setPage(<Home/>);
        }
    }

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

    return (
        <div id="make-item">
            <div id="make-post">
                <h5>Community: <span className="small">(required)</span></h5>
                <select required defaultValue="" className="dropdown" id="communities-dropdown-field" onChange={(e) => setCommunityID(e.target.value)}>
                    <option value="" key="default" disabled>Select Community:</option>
                    {/* JOINED COMMS FIRST */}
                    {communities.map((community) => { return (
                        <option value={community._id} key={community._id} className={"community"}>{community.name}</option>)
                     })}
                </select>
                <h5>Post Title: <span className="small">(required)</span></h5>
                <input type="text" autoComplete="off" id="post-title-field" onChange={(e) => setPostTitle(e.target.value)}/>
                <h5>Post Flair: <span className="small">(optional)</span></h5>
                <select className="dropdown" id="flair-dropdown-field" onChange={(e) => {
                    setLinkFlairID(e.target.value);
                    if (e.target.value === "create-new-flair") {
                        setShowCustomField(true);
                    }
                    else {
                        setShowCustomField(false);
                        setCustomLinkFlairID("");
                    }
                }}>
                    <option value="no-flair" key="no-flair">No Flair</option>
                    <option value="create-new-flair" key="create-new-flair">Create New Flair</option>
                    {linkFlairs.map((flair) => { return (
                        <option value={flair._id} key={flair._id} className={"flair"}>{flair.content}</option>)
                    })} 
                </select>
                {showCustomField && (
                    <input type="text" autoComplete="off" id="flair-creation-field" onChange={(e) => setCustomLinkFlairID(e.target.value)} />
                )}
                <h5>Post Content: <span className="small">(required)</span></h5>
                <textarea autoComplete="off" id="post-content-field" onChange={(e) => setPostContent(e.target.value)}></textarea>
                <br/>
                <input type="button" id="post-submit-button" value="Submit Post" onClick={() => submitPost()}/>
                {errorMessage && <Error message={errorMessage} onClose={() => {
                    setErrorMessage(null);
                }} />}
            </div>
        </div>
    );
}
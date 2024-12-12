import { useEffect, useState } from 'react';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import EditPost from './editPost.js';
import EditCommunity from './editCommunity.js';
import EditComment from './editComment.js';
import CommentedComment from './commentedComment.js';
// import UserView from './userView.js';


export default function Profile(props){
    const [pageState, setPageState] = useState("users");
    const name = props.name;
    const [isAdmin, setAdmin] = useState(props.isAdmin);
    const [posts, setPosts] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [comments, setComments] = useState([]);
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    const [profiles, setProfiles] = useState([]);
    let currentUser = [];
    const [userData, setUserData] = useState(null);
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    const {setSelectedID} = useSelectedID();

    // const sortedPosts = (mode) => {
    //     setSortMode(mode);
    // }

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const statusResponse = await utils.status();
                const allProfiles = await utils.requestData("http://localhost:8000/users");
                setStatus(statusResponse);
                setProfiles(allProfiles);
                setIsLoggedIn(statusResponse.isLoggedIn);
                const userObject = await utils.getUserProfile(name);
                setUserData(await userObject);
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

    function displayPosts(){
        return (
            <div className="view-posts">
                Posts
                <div className="post-list">
                    {userData && userData.posts.map((post, index) => {
                        return <div className="post" id={post._id} onClick={() => {
                            setSelectedID("editPost");
                            setPage(<EditPost post={post} name={name}/>);
                        }}>
                            {(index === 0) ? <hr /> : <hr className="post-separator" />}
                            <h3>{post.title}</h3>
                        </div>
                    })}
                </div>
            </div>
        );
    }
    
    function displayCommunities(){
        return (
            <div className="view-posts">
                Communities
                <div className="community-list">
                    {userData && userData.creatorOfCommunities.map((post, index) => {
                        return <div className="post" id={post._id} onClick={() => {
                            setSelectedID("editCommunity");
                            setPage(<EditCommunity community={post} name={name}/>);
                        }}> 
                            {(index === 0) ? <hr /> : <hr className="post-separator" />}
                            <h3>{post.name}</h3>
                        </div>
                    })}
                </div>
            </div>
        );
    }
    
    function displayComments(){
        return (
            <div className="view-posts">
                Comments
                <div className="comment-list">
                    {userData && userData.comments.map((post, index) => {
                            return <CommentedComment comment={post} index={index} name={name}/>
                    })}
                </div>
            </div>
        );
    }
    
    function displayUsers(){
        return (
            <div className="view-posts">
                Users
                <div className="user-list">
                    {profiles && profiles.map((post, index) => {
                        return <div className="post" id={post._id} onClick={() => {
                            setSelectedID("editUser");
                            console.log(post);
                            setPage(<Profile key={Date.now()} name={post.name} isAdmin={true}/>);
                        }}> 
                            {(index === 0) ? <hr /> : <hr className="post-separator" />}
                            <h3>{post.name}</h3>
                            <h3>{post.email}</h3>
                            <h3>{post.reputation}</h3>
                            <input type="button" className={"register"} value="remove user" onClick={() => {
                                deleteUser(post._id);
                            }}/>
                        </div>
                    })}
                </div>
            </div>
        );
    }

    async function getPost(commentID){
        return utils.getPostFromComment(commentID);
    }

    useEffect(() => {
        if (userData && !userData.user[0].isAdmin) {
            setPageState("posts");
        }
    }, []);

    async function deleteUser(name){
        const response = await utils.deleteUser(name);

        console.log('User deleted:', response);

        setPage(<Profile name={status.user.name} isAdmin={false}/>);
    }
    
    return (
        <div className="profile-page">
            {(userData) ? 
            <div>
                <div className="user-data">
                    <div id="welcome-text">Display Name: {userData.user[0].name}</div>
                    <div id="welcome-text">Email: {userData.user[0].email}</div>
                    <div id="welcome-text">Joined: {utils.getTimestamp(userData.user[0].joinedDate)}</div>
                    <div id="welcome-text">Reputation: {userData.user[0].reputation}</div>
                    <br></br>
                </div>
                {(isAdmin) ? <div>
                    <input type="button" className={"register"} value="Back" onClick={() => {
                            setSelectedID("");
                            setPage(<Profile name={status.user.name} isAdmin={false} />);
                        }}/>
                </div> : <div/>}
                <div className="buttons">
                    {(userData && userData.user[0].isAdmin) &&
                        <input type="button" className={"register"} value="Users" onClick={() => {
                            setPageState("users");
                        }}/>
                    }
                    <input type="button" className={"register"} value="Posts" onClick={() => {
                        setPageState("posts");
                    }}/>
                    <input type="button" className={"login"} value="Communities" onClick={() => {
                        setPageState("communities");
                    }}/>
                    <input type="button" className={"guest"} value="Comments" onClick={() => {
                        setPageState("comments");
                    }}/>
                </div>
                <div className="content">
                    {(pageState === "users") ? displayUsers() : 
                    ((pageState === "posts") ? displayPosts() : 
                    ((pageState === "communities") ? displayCommunities() : 
                    ((pageState === "comments") ? displayComments() : displayUsers())))}
                </div>
            </div> : 
            <div></div>
            }
        </div>
    );

    // user display name
    // email address
    // member since stamp
    // reputation of user with labels

    // listing with buttons, default posts
    // set of communities by user
        // community name is link, clicked = edit (new community)
        // add delete community (deletes all posts frm comm) (confirmation box)
    // set of postst by user
        // POST TITLE same as uptop
        // no confirmation box
    // set of commetns by user
        // post tile + 20 chars of comment
    
    // 


    // IF ADMIN
    // adds list of all users to listing
    // default lists all users
        // display name, email, reputation
        // can go into profile view of them, can delete stuff
        // needs a button to go back
        // delete user button, dialog box to accept 
}
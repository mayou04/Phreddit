import { useEffect, useState } from 'react';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import EditPost from './editPost.js';
import EditCommunity from './editCommunity.js';
import EditComment from './editComment.js';
// import UserView from './userView.js';


export default function Profile(props){
    const [pageState, setPageState] = useState("users");
    const name = props.name;
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
                            setSelectedID("editPost");
                            setPage(<EditCommunity communityID={post._id}/>);
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
                        return <div className="post" id={post._id} onClick={() => {
                            setSelectedID("editPost");
                            setPage(<EditComment name={name} comment={post}/>);
                        }}> 
                            {(index === 0) ? <hr /> : <hr className="post-separator" />}
                            {/* post title v is first 20 chars */}
                            <h3>{post.content.substring(0,20)+"..."}</h3>
                        </div>
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
                            setSelectedID("editPost");
                            setPage(<Profile name={name} />);
                        }}> 
                            {(index === 0) ? <hr /> : <hr className="post-separator" />}
                            <h3>{post.name}</h3>
                            {/* DELETE USER BUTTON */}
                        </div>
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {(userData) ? 
            <div>
                <div className="user-data">
                    <div id="welcome-text">{userData.user[0].name}</div>
                    <div id="welcome-text">{userData.user[0].email}</div>
                    <div id="welcome-text">{utils.getTimestamp(userData.user[0].joinedDate)}</div>
                </div>
                <div className="buttons">
                    {/* {(userData.user[0].isAdmin)} */}
                    {(userData.user[0].isAdmin) ?
                    <input type="button" className={"register"} value="Users" onClick={() => {
                        setPageState("users");
                    }}/> : setPageState("posts")
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
            
            {/* {(status.user.isAdmin) ? 
            (pageState === "users") ? loginOptions() : 
            ((pageState === "posts") ? register() : 
            ((pageState === "login") ? login() : setPage(<Home/>)))} */}
        </div>
        // (community === undefined) ? <div>Loading...</div> :
        // <div className="view-posts">
        //     <div id="community-header">
        //         <span id="community-title">{community.name}</span>
        //         <SortButtons sortedPosts={sortedPosts} currentSortMode={sortMode} />
        //     </div>
        //     <p className="community-description">{community.description}</p>
        //     {/* Display Name of Creator (User) */}
        //     <h5 className="community-date">{communityDate()}</h5>
        //     <p className="post-counter">{posts.length} post{(posts.length === 1) ? "" : "s"} shown • Members: {community.members.length}</p>
        //     {/* join/leave if logged in */}
        //     <DisplayPosts setPostID={props.setPostID} postList={posts} isCommunity={true}/>
        // </div>
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
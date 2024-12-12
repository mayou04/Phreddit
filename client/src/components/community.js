import { useEffect, useState } from 'react';
import * as utils from '../utility.js';
import DisplayPosts from './displayPosts.js';
import SortButtons from './sortButtons.js';

export default function Community(props) {
    const [community, setCommunity] = useState();
    const [posts, setPosts] = useState([]);
    const [sortMode, setSortMode] = useState("newest");
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    // const [profile, setProfile] = useState([]);
    
    let monthName = new Intl.DateTimeFormat("en-us", { month: "long" }).format;

    useEffect(() => {
        async function fetchCommunity() {
            const communityData = await utils.getCommunityObject(props.commId);
            setCommunity(communityData);
            
            // Fetch and sort posts
            const postList = await Promise.all(
                communityData.postIDs.map(postID => utils.getPostObject(postID))
            );
            const sortedPosts = await utils.sortPosts(sortMode, postList);
            setPosts(sortedPosts);
            
            // GET ALL JOINED COMMUNITIES AT THE TOP
        }

        fetchCommunity();
    }, [props.commId, sortMode]);

    function communityDate() {
        if (!community) return '';
        const date = new Date((community.startDate));
        return `Created ${utils.getTimestamp(community.startDate)} on ${monthName(date)}
            ${date.getDate()}, ${date.getFullYear()}.`;
    }

    const sortedPosts = (mode) => {
        setSortMode(mode);
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
        (community === undefined) ? <div>Loading...</div> :
        <div className="view-posts">
            <div id="community-header">
                <span id="community-title">{community.name}</span>
                <SortButtons sortedPosts={sortedPosts} currentSortMode={sortMode} />
            </div>
            <p className="community-description">{community.description}</p>
            <h5 className="community-date">Created by: {community.createdBy + " • " + communityDate()}</h5>
            <p className="post-counter">{posts.length} post{(posts.length === 1) ? "" : "s"} shown • Members: {community.members.length}</p>
            {/* join/leave if logged in */}
            {(status.isLoggedIn) ? 
                ((status.user && community.members.includes(status.user.name)) ? 
                <p><input type="button" value="Leave" onClick={() => {
                    console.log(utils.leaveCommunity(community._id));
                }}/></p> :
                <p><input type="button" value="Join" onClick={() => {
                    console.log(utils.joinCommunity(community._id));
                }}/></p>) : 
            <p></p>}
            <DisplayPosts setPostID={props.setPostID} postList={posts} isCommunity={true}/>
        </div>
    );
}
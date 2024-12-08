import { useEffect, useState } from 'react';
import * as utils from '../utility.js';
import DisplayPosts from './displayPosts.js';
import SortButtons from './sortButtons.js';

export default function Community(props) {
    const [community, setCommunity] = useState();
    const [posts, setPosts] = useState([]);
    const [sortMode, setSortMode] = useState("newest");
    // const [loading, setLoading] = useState(true);
    
    console.log(props);
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
        console.log(community);
        if (!community) return '';
        const date = new Date(Date(community.startDate));
        return `Created ${utils.getTimestamp(community.startDate)} on ${monthName(date)}
            ${date.getDate()}, ${date.getFullYear()}.`;
    }

    const sortedPosts = (mode) => {
        setSortMode(mode);
    }

    // const posts = useMemo(() => {
    //     return utils.sortPosts(sortMode, community.postIDs);
    // }, [sortMode, community.postIDs]);
    
    // let posts = [];

    // useEffect(() => {
    //     async function sortPosts(){
    //         const postList = [];
    //         for (let postID of community.postIDs){
    //             const post = utils.getPostObject(postID);
    //             postList.push(post);
    //         } 
    //         const sorted = await utils.sortPosts(sortMode, postList);
    //         posts = sorted;
    // }
    //     sortPosts();
    // }, [])

    return (
        (community === undefined) ? <div>Loading...</div> :
        <div className="view-posts">
            <div id="community-header">
                <span id="community-title">{community.name}</span>
                <SortButtons sortedPosts={sortedPosts} currentSortMode={sortMode} />
            </div>
            <p className="community-description">{community.description}</p>
            {/* Display Name of Creator (User) */}
            <h5 className="community-date">{communityDate()}</h5>
            <p className="post-counter">{posts.length} post{(posts.length === 1) ? "" : "s"} shown • Members: {community.members.length}</p>
            {/* join/leave if logged in */}
            <DisplayPosts setPostID={props.setPostID} postList={posts} isCommunity={true}/>
        </div>
    );
}
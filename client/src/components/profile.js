// import { useEffect, useState } from 'react';
// import * as utils from '../utility.js';
// import DisplayPosts from './displayPosts.js';
// import SortButtons from './sortButtons.js';

// export default function user(){
//     const [profile, setProfile] = useState();
//     const [posts, setPosts] = useState([]);
//     const [communities, setCommunities] = useState([]);
//     const [comments, setComments] = useState([]);
    
//     let monthName = new Intl.DateTimeFormat("en-us", { month: "long" }).format;

//     useEffect(() => {
//         async function fetchData() {
            
//             setProfile(utils.getProfile)
//             const allPosts = await utils.requestData("http://localhost:8000/posts");
//             const allCommunities = await utils.requestData("http://localhost:8000/communities");
//             const allComments = await utils.requestData("http://localhost:8000/comments");
//             const allProfiles = await utils.requestData("http://localhost:8000/users");
            
//             // Fetch and sort posts
//             const postList = await Promise.all(
//                 communityData.postIDs.map(postID => utils.getPostObject(postID))
//             );
//             const sortedPosts = await utils.sortPosts(sortMode, postList);
//             setPosts(sortedPosts);
            
//         }

//         fetchCommunity();
//     }, [props.commId, sortMode]);

//     function communityDate() {
//         console.log(community);
//         if (!community) return '';
//         const date = new Date(Date(community.startDate));
//         return `Created ${utils.getTimestamp(community.startDate)} on ${monthName(date)}
//             ${date.getDate()}, ${date.getFullYear()}.`;
//     }

//     const sortedPosts = (mode) => {
//         setSortMode(mode);
//     }

//     // const posts = useMemo(() => {
//     //     return utils.sortPosts(sortMode, community.postIDs);
//     // }, [sortMode, community.postIDs]);
    
//     // let posts = [];

//     // useEffect(() => {
//     //     async function sortPosts(){
//     //         const postList = [];
//     //         for (let postID of community.postIDs){
//     //             const post = utils.getPostObject(postID);
//     //             postList.push(post);
//     //         } 
//     //         const sorted = await utils.sortPosts(sortMode, postList);
//     //         posts = sorted;
//     // }
//     //     sortPosts();
//     // }, [])

//     return (
//         (community === undefined) ? <div>Loading...</div> :
//         <div className="view-posts">
//             <div id="community-header">
//                 <span id="community-title">{community.name}</span>
//                 <SortButtons sortedPosts={sortedPosts} currentSortMode={sortMode} />
//             </div>
//             <p className="community-description">{community.description}</p>
//             {/* Display Name of Creator (User) */}
//             <h5 className="community-date">{communityDate()}</h5>
//             <p className="post-counter">{posts.length} post{(posts.length === 1) ? "" : "s"} shown • Members: {community.members.length}</p>
//             {/* join/leave if logged in */}
//             <DisplayPosts setPostID={props.setPostID} postList={posts} isCommunity={true}/>
//         </div>
//     );

//     // user display name
//     // email address
//     // member since stamp
//     // reputation of user with labels

//     // listing with buttons, default posts
//     // set of communities by user
//         // community name is link, clicked = edit (new community)
//         // add delete community (deletes all posts frm comm) (confirmation box)
//     // set of postst by user
//         // POST TITLE same as uptop
//         // no confirmation box
//     // set of commetns by user
//         // post tile + 20 chars of comment
    
//     // 


//     // IF ADMIN
//     // adds list of all users to listing
//     // default lists all users
//         // display name, email, reputation
//         // can go into profile view of them, can delete stuff
//         // needs a button to go back
//         // delete user button, dialog box to accept 
// }
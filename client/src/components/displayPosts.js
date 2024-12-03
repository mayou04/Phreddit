import { useEffect, useState } from 'react';
import { usePage } from '../contexts/pageContext.js';
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import Post from './post.js';

export default function DisplayPosts(props) {
    const postList = props.postList;
    const postIDList = postList.map(obj => obj._id);
    const isCommunity = props.isCommunity;
    const sortMode = props.sortMode;

    const { setPage } = usePage();
    const { setSelectedID } = useSelectedID();
    const[posts, setPosts] = useState([]);
    // const[communities, setCommunities] = useState([]);
    const[communityList, setCommunityList] = useState([]);
    const[linkFlairs, setFlairs] = useState([]);
    // const[comments, setComments] = useState([]);
    const[commentCounts, setCommentCounts] = useState([]);

    useEffect(()=> {
        async function makePosts() {
            const fetchedPosts = [];
            const fetchedComms = [];
            const fetchedFlairs = [];
            const fetchedCommCounts = [];
            // setCommunities(await utils.requestData("http://localhost:8000/communities"));
            // setFlairs(await utils.requestData("http://localhost:8000/linkflairs"));
            // setComments(await utils.requestData("http://localhost:8000/comments"));

            for (const postID of postIDList){
                const post = await utils.getPostObject(postID);
                const community = await utils.getCommunityFromPost(postID);
                const flair = await utils.getFlairObject(post.linkFlairID);
                const commentCount = await utils.getCommentCountForPost(postID);

                if (post) {
                    fetchedPosts.push(post);
                }

                if (community) {
                    fetchedComms.push([postID, community]);
                }

                if (flair) {
                    fetchedFlairs.push([postID, flair]);
                }

                if (!(commentCount === undefined)) {
                    fetchedCommCounts.push([postID, commentCount]);
                }
                
            }
            setPosts(fetchedPosts);
            setCommunityList(fetchedComms);
            setFlairs(fetchedFlairs);
            setCommentCounts(fetchedCommCounts);
        }

        makePosts();
        // setPosts(postList);    
    }, [sortMode, JSON.stringify(postList)]);

    function postContent(content) {
        if (content.length <= 80){
            return content;
        }
        content = content.substring(0, 80);
        while (content.endsWith(" ")) {
            content = content.substring(0, content.length-1);
        }
        content += "...";
        return content;
    }

    function postInfo(post) {
        if (communityList === undefined || communityList.find(obj => {
            return obj[0] === post._id;
        }) === undefined){
            return;
        }
        var str = (isCommunity) ? "" : `${communityList.find(obj => {
            return obj[0] === post._id;
        })[1].name} • `;
        str += `${post.postedBy} • ${utils.getTimestamp(post.postedDate)}`;
        return str;
    }

    return (
        <div id="post-list">
            {posts && posts.map((post, index) => {
                return (post === undefined) ? <div>Loading...</div> : 
                    
                    <div key={post._id}>
                        {(index === 0) ? <hr /> : <hr className="post-separator" />}
                        <div className="post" id={post._id} onClick={() => {
                            post.views += 1; // push this from the actual place
                            utils.updatePost(post._id, post);
                            setSelectedID(post._id);
                            setPage(<Post postID={post._id} post={post} community={communityList.find(obj => {
                                return obj[0] === post._id;
                            })[1]} flair={(post.linkFlairID === "000000000000000000000000") ? "000000000000000000000000" : linkFlairs.find(obj => {
                                return obj[0] === post._id;
                            })[1]} commentCount={commentCounts.find(obj => {
                                return obj[0] === post._id;
                            })[1]}/>);
                        }}>
                            <h5 className="post-info">{postInfo(post)}</h5>
                            <h3>{post.title}</h3>
                            {(post.linkFlairID === "000000000000000000000000") ? <h5 style={{display: "none"}}>{""}</h5> :
                            <h5 className="post-flair">{linkFlairs.find(obj => {
                                return obj[0] === post._id;
                            })[1].content}</h5>}
                            <h4 className="post-content-preview">{postContent(post.content)}</h4>
                            <h5>
                                <span className="post-views">{post.views}</span>
                                <span className="post-comments-count">{commentCounts.find(obj => {
                                return obj[0] === post._id;
                            })[1]}</span>
                            </h5>
                        </div>
                    </div>
                
            })}
        </div>
    );
}
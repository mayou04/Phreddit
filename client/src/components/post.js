import { useEffect, useState } from 'react';
import { usePage } from '../contexts/pageContext.js';
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import CreateComment from './createComment.js';
import Comment from './comment.js';

export default function Post(props) {
  var postID = props.postID;
  const [postVotes, setPostVotes] = useState(props.post.voteCount);
  const { setPage } = usePage();
  const { setSelectedID } = useSelectedID();
  const[commentCount, setCommentCount] = useState(props.commentCount);  
  const[post, setPost] = useState(props.post);
  const community = props.community;
  const linkFlair = props.flair;
  const[comments, setComments] = useState([]);
  const[directComments, setDirectComments] = useState();
  const [status, setStatus] = useState(utils.status());  
  const [isLoggedIn, setIsLoggedIn] = useState(false);    
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const checkStatus = async () => {
        try {
            const statusResponse = await utils.status();
            setStatus(statusResponse);
            setIsLoggedIn(statusResponse.isLoggedIn);
            setCurrentUser(await utils.getUserProfile(status.user.name));
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
            // setCurrentUser(await utils.getUserProfile(status.user.name));
        }
    };

  fetchUser();
  }, [status.user]); // Only run when status.user changes

  // Returns a div with all the comments on the post
  useEffect(()=> {
    const loadCommentsOnPostPage = async () => {
      const data = await utils.requestData("http://localhost:8000/comments");
      setComments(data);
      setPost(await utils.getPostObject(postID));
      let commentObjects = post.commentIDs.map((commentID) => {
        return data.find((obj) => {
          return obj._id === commentID;
        });
      });
      
      setDirectComments(utils.sortCommentsByNewest(commentObjects));
      setCommentCount(await utils.getCommentCountForPost(postID));

      console.log(directComments);
    }

    loadCommentsOnPostPage();
  }, [commentCount]);

  // console.log(comments);
  
    // Returns an array of comment components
    function loadCommentChain(commentObject, depth) {

      if (!commentObject || !commentObject.commentIDs){
        return commentObject;
      }

      let commentObjects = commentObject.commentIDs.map((commentID) => {
        return comments.find((obj) => {
          return obj._id === commentID;
        });
      });
      
      // console.log(commentObjects);
  
        let sortedReplies = utils.sortCommentsByNewest(commentObjects);

        let allReplies = [];
  
        // Puts a separator at the start of the comment
        if (depth === 0){
            allReplies.push(<hr className={"post-separator"}/>);
        }
  
        // Pushes first comment into array of all replies
        allReplies.push(displayComment(commentObject, depth));
        
        // Gets an array of all replies to comment
        allReplies = allReplies.concat(sortedReplies.map((reply) => {
            return loadCommentChain(reply, depth+1)
        }));
  
        return allReplies;
      // }
    }
  
    // console.log(directComments);
      
    // Returns a comment component
    function displayComment(commentObject, depth) {
      return <Comment commentObject={commentObject} depth={depth} postID={postID} />;
    }

  if (postID === " "){
      return;
  } else {
    return (
      (post === undefined) ? <div>Loading...</div> : 
      <div id="post-page">
        <h5><span id="community-name">{community.name}</span> • <span id="posted-date">{utils.getTimestamp(post.postedDate)}</span></h5>
        <h5 className="less-margin">Posted by <span id="posterName">{post.postedBy}</span></h5>
        <h3 id="post-title">{post.title}</h3>
        {(post.linkFlairID === "000000000000000000000000") ? <h5 style={{display: "none"}}>{""}</h5> :
        <h5 className="post-flair">{linkFlair.content}</h5>}
        <h4 id="post-content" className="post-content">{post.content}</h4>
        {/* UPVOTES, GREYED OUT */}
        <h5>
          <span id="post-votes">{postVotes}</span>
          {(status.isLoggedIn) ? <span><input type="button" id="post-upvotes" value="Updoot" onClick={()=> {
            // IF REP < 50 OR GUEST CANT VOTE
            utils.upvotePost(post._id);
            setPostVotes(postVotes+1);
          }}/>
          <input type="button" id="post-downvotes" value="Downvote" onClick={()=> {
            // IF REP < 50 OR GUEST CANT VOTE
            utils.downvotePost(post._id);
            setPostVotes(postVotes-1);
          }}/></span> : <span></span>}
          <span id="post-views">{post.views}</span>
          <span id="post-comments-count">{commentCount}</span>
        </h5>
        {/* GREY THIS OUT IF GUEST */}
        <input type="button" className="create-comment-button" value="Add a Comment" onClick={() => {
          setSelectedID(postID);
          setPage(<CreateComment postID={postID} parent={post}/>);
        }}
        />
        <hr/>
        <div id="comment-section">
          {(directComments === undefined || directComments.length === 0) ? <div></div> : directComments.map((commentObject, index) => {
           
            let commentChain = (loadCommentChain(commentObject,0));
            
            if (commentChain !== undefined && commentChain.length !== 0 && index === 0) {
              if (commentChain[0] !== undefined && commentChain[0].type === "hr"){
                commentChain.shift();
              }
            }
            return commentChain;
          })}
        </div>
      </div>
    );
  }
}
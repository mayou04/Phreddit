import { useEffect, useState } from 'react';
import { usePage } from '../contexts/pageContext.js';
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import CreateComment from './createComment.js';

export default function Post(props) {
  var postID = props.postID;
  const { setPage } = usePage();
  const { setSelectedID } = useSelectedID();
  // const[post, setPost] = useState();
  // const[community, setCommunity] = useState();
  // const[linkFlair, setFlair] = useState();
  // const[commentCount, setCommentCount] = useState();
  const[commentCount, setCommentCount] = useState(props.commentCount);  
  const[post, setPost] = useState(props.post);
  const community = props.community;
  const linkFlair = props.flair;
  // const comments = props.comments; // ??
  const[comments, setComments] = useState([]);
  const[directComments, setDirectComments] = useState();
  // let postComments;

  
  // const fetchData = async () => {
  //   try {
  //       const data = await utils.requestData("http://localhost:8000/posts");
  //       setAllPosts(data);
        
  //   } catch (error) {
  //       console.error("Error fetching posts:", error);
  //   }
  // };

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
      // console.log("displaying: " + commentObject.content + " \ndepth: " + depth)
      // let comment = utils.getCommentObject(commentID);
      let leftMargin = depth*50 + "px";
  
      return (
        <div key={commentObject._id} id={commentObject._id} className={"comment" + (depth > 0 ? " reply" : "")} style={{marginLeft: `${leftMargin}`}}>
          <h5>
            {commentObject.commentedBy} • {utils.getTimestamp(commentObject.commentedDate)}
          </h5>
          <h4>
            {commentObject.content}
          </h4>
          <input id={commentObject._id} className={"reply-button"} type="button" value="Reply" onClick={() => {
            setSelectedID(postID);
            setPage(<CreateComment postID={postID} parent={commentObject}/>);
          }}/>
        </div>
      );
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
        <h5><span id="post-views">{post.views}</span><span id="post-comments-count">{commentCount}</span></h5>
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
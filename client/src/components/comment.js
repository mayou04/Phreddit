import { useEffect, useState } from 'react';
import { usePage } from '../contexts/pageContext.js';
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import CreateComment from './createComment.js';

export default function Comment({commentObject, depth, postID}) {
    const [votes, setVotes] = useState(commentObject.voteCount);
    const { setPage } = usePage();
    const { setSelectedID } = useSelectedID();
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    const [profiles, setProfiles] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    
    let leftMargin = depth*50 + "px";
  
    
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

    return (
      <div key={commentObject._id} id={commentObject._id} className={"comment" + (depth > 0 ? " reply" : "")} style={{marginLeft: `${leftMargin}`}}>
        <h5>
          {commentObject.commentedBy} • {utils.getTimestamp(commentObject.commentedDate)}
        </h5>
        <h4>
          {commentObject.content}
        </h4>
        <span id="post-votes">{votes}</span>
        
        {(status.isLoggedIn) ? <span><input type="button" id="post-upvotes" value="Updoot" onClick={async () => {
        await utils.upvoteComment(commentObject._id);
        setVotes(prev => prev + 1);
        }}/>
        <input type="button" id="post-downvotes" value="Downvote" onClick={async () => {
        await utils.downvoteComment(commentObject._id);
        setVotes(prev => prev - 1);
        }}/>
        <input id={commentObject._id} className={"reply-button"} type="button" value="Reply" onClick={() => {
        setSelectedID(postID);
        setPage(<CreateComment postID={postID} parent={commentObject}/>);
        }}/>
      </span> : <span></span>}
      </div>
    );
  }

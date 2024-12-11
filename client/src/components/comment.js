import { useState } from 'react';
import * as utils from '../utility.js';
import { usePage } from '../contexts/pageContext.js';
import { useSelectedID } from '../contexts/selectedIDContext.js';
import CreateComment from './createComment.js';

export default function Comment({commentObject, depth, postID}) {
    const [votes, setVotes] = useState(commentObject.voteCount);
    const { setPage } = usePage();
    const { setSelectedID } = useSelectedID();
    
    let leftMargin = depth*50 + "px";
  
    return (
      <div key={commentObject._id} id={commentObject._id} className={"comment" + (depth > 0 ? " reply" : "")} style={{marginLeft: `${leftMargin}`}}>
        <h5>
            {commentObject.commentedBy} • {utils.getTimestamp(commentObject.commentedDate)}
        </h5>
        <h4>
            {commentObject.content}
        </h4>
        <span id="post-votes">{votes}</span>
        <input type="button" id="post-upvotes" value="Updoot" onClick={async () => {
            // IF REP < 50 OR GUEST CANT VOTE
          await utils.upvoteComment(commentObject._id);
          setVotes(prev => prev + 1);
        }}/>
        <input type="button" id="post-downvotes" value="Downvote" onClick={async () => {
            // IF REP < 50 OR GUEST CANT VOTE
          await utils.downvoteComment(commentObject._id);
          setVotes(prev => prev - 1);
        }}/>
        <input id={commentObject._id} className={"reply-button"} type="button" value="Reply" onClick={() => {
            setSelectedID(postID);
            setPage(<CreateComment postID={postID} parent={commentObject}/>);
          }}/>
      </div>
    );
  }

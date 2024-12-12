import { useEffect, useState } from 'react';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import EditPost from './editPost.js';
import EditCommunity from './editCommunity.js';
import EditComment from './editComment.js';

export default function CommentedComment(props){
    const comment = props.comment;
    const index = props.index;
    const name = props.name;
    const [parentPost] = useState(props.parentPost) ;
    // const [post, setPost] = useState(utils.getPostFromComment(comment._id));
    const {setPage} = usePage();
    const {setSelectedID} = useSelectedID();

    // useEffect(() => {
    //     async function getParentPost(commentID){
    //         const postObject = ;
    //         setPost(await postObject);
    //         console.log(postObject);
    //     }

    //     getParentPost(comment._id);

    // }, [])

    
    return <div className="post" id={comment._id} onClick={() => {
        setSelectedID("editPost");
        setPage(<EditComment name={name} comment={comment}/>);
    }}> 
    {/* {console.log(post)} */}
        {/* <h3>{parentPost.title}</h3> */}
        {(index === 0) ? <hr /> : <hr className="post-separator" />}
        <h3>{comment.content.substring(0,20)+"..."}</h3>
    </div>
}
import axios from "axios";
// const[posts, setPosts] = useState([]);
// const[communities, setComm] = useState([]);
// const[linkFlairs, setFlair] = useState([]);
// const[commentCounts, setCommCount] = useState([]);

// export async function fetchData(){
//   setPosts(await requestData("http://localhost:8000/posts"));
//   setComm(await requestData("http://localhost:8000/communities"));
//   setFlair(await requestData("http://localhost:8000/comments"));
//   setCommCount(await requestData("http://localhost:8000/linkflairs"));
// }

// useEffect(()=> {
//   fetchData();
// }, [])


export async function requestData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  }
  catch (err) {
    return null;
  }
}

/** Gets a post object from an ID. */
export async function getPostObject(postID) {
    const posts = await requestData("http://localhost:8000/posts");
    return posts.find(obj => {
        return obj._id === postID;
    });
}

/** Gets a community object from an ID. */
export async function getCommunityObject(communityID) {
    const communities = await requestData("http://localhost:8000/communities");
    return communities.find(obj => {
        return obj._id === communityID;
    });
}

/** Gets the community from a post's ID. */
export async function getCommunityFromPost(postID) {
  const communities = await requestData("http://localhost:8000/communities");
  return communities.find(obj => {
    return obj.postIDs.includes(postID);
  });
}

export async function communityNameExists(communities, name) {
  // const communities = await requestData("http://localhost:8000/communities");
  for (let community of communities) {
    if (community.name.toLowerCase() === name.toLowerCase()) return true;
  }
  return false;
}

/** Gets the comment object from an ID */
export async function getCommentObject(commentID) {
    const comments = await requestData("http://localhost:8000/comments");
    
    return comments.find(obj => {
        return obj._id === commentID;
    });
}

/** Get total # of comments */
export async function getCommentCountForPost(postID) {
  let count = 0;
  let post = await getPostObject(postID);
  for (let commentID of post.commentIDs) {
    count += await commentCountAux(commentID);
  }
  return count;
}

async function commentCountAux(commentID) {
  let count = 1;
  let comment = await getCommentObject(commentID);
  for (let child of comment.commentIDs) {
    count += await commentCountAux(child);
  }
  return count;
}

export async function getSearchResults(search_query) {
    let posts = await requestData("http://localhost:8000/posts");
    let comments = await requestData("http://localhost:8000/comments");
    let resultsList = [];
    for (let term of search_query) {
      posts = posts.filter(obj => {
        return (obj.content.toLowerCase().includes(term) || obj.title.toLowerCase().includes(term));
      }).map(obj => obj._id);
      resultsList = resultsList.concat(posts);
  
      comments = comments.filter(obj => {
        return obj.content.toLowerCase().includes(term);
      });
      comments = comments.map(obj => {
        return getPostFromComment(obj._id).postID;
      });
      resultsList = resultsList.concat(comments);
    }
    let removedDuplicates = [];
    resultsList.forEach(id => {
      if (!removedDuplicates.includes(id)) removedDuplicates.push(id);
    });
    return removedDuplicates;
}

export async function getPostFromComment(commentID) {
    const posts = await requestData("http://localhost:8000/posts");
    let post = posts.find(obj => {
      return obj._id.includes(baseCommentFinder(commentID));
    });
    return post;
}

async function baseCommentFinder(commentID) {
    const comments = await requestData("http://localhost:8000/comments");
    for (let comment of comments) {
      if (comment._id.includes(commentID)) {
        commentID = baseCommentFinder(comment._id);
      }
    }
    return commentID;
}

/** Gets the timestamp of a certain date relative to the time right now. Has a certain format. */
export function getTimestamp(date) { // Comment
    let currDate = new Date();
    let timeDifference = (currDate - Date.parse(date));
    timeDifference /= 1000;
    let units = "";
    do {
      if (timeDifference < 60) {units = "second"; break;} timeDifference /= 60;
      if (timeDifference < 60) {units = "minute"; break;} timeDifference /= 60;
      if (timeDifference < 24) {units = "hour"; break;} timeDifference /= 24;
      if (timeDifference < 30) {units = "day"; break;} timeDifference /= 30;
      if (timeDifference < 12) {units = "month"; break;} timeDifference /= 12;
      units = "year";
    } while (false);
    if ((timeDifference = Math.floor(timeDifference)) !== 1) {units += "s"};
    return `${timeDifference} ${units} ago`;
}

/** Gets the flair object from an ID */
export async function getFlairObject(flairID) {
    const linkFlairs = await requestData("http://localhost:8000/linkflairs");
    return linkFlairs.find(obj => {
      return obj._id === flairID;
    });
}

export async function getFlairIDFromText(flairText) {
  const linkFlairs = await requestData("http://localhost:8000/linkflairs");
  return linkFlairs.find(obj => {
      return obj.content === flairText;
  });
}
  
  /** Gets the time of the most recent activity on a post (most recent comment) */
export async function getMostRecentPostActivity(postObject) {
    let comments = [];
    if (postObject.commentIDs.length === 0) {
      return new Date(0);
    }
    for (let comment of postObject.commentIDs) {
      comments.push((await commentRecursion(comment)));
    }
    return comments.reduce((a, b) => {
      return (a > b) ? a : b;
    });
}


// Sorters
  
export async function sortByNewest(postList) {
  let posts = [];
  posts = postList.sort((a, b) => {
      return Date.parse(b.postedDate) - Date.parse(a.postedDate);
  });
  return posts;
}
  
export async function sortByOldest(postList) {
    return (await sortByNewest(postList)).reverse();
}
  
export async function sortByActive(postList) {
    let posts = [];
    for (let post of postList) {
      let postData = await getMostRecentPostActivity(post);
      posts.push([post, Date.parse(postData)]); // check if postData is correct?
    }
    posts = posts.sort((a, b) => {
      return b[1] - a[1];
    }).map(a => {
      return a[0];
    });
    return posts;
}
  
export function sortCommentsByNewest(commentList) {
  if (commentList === undefined){
    return commentList;
  }
  commentList = commentList.sort((a, b) => {
    return Date.parse(b.commentedDate) - Date.parse(a.commentedDate); // prob change here too
  });

  return commentList;
}

/** Get the most recent activity from a comment chain. */
export async function commentRecursion(commentID) {
    let comment = await getCommentObject(commentID);

    let activity = comment.commentedDate;
    for (let child of comment.commentIDs) {
      let childActivity = await commentRecursion(child);
      activity = (childActivity > activity) ? childActivity : activity;
    }
    return activity;
}
  
export async function sortPosts(sortMode, postList) {
  switch (sortMode) {
    case "newest":
      return (sortByNewest(postList));
    case "oldest":
      return (sortByOldest(postList));
    case "active":
      return (sortByActive(postList));
    default:
      return postList;
  }
}

export function displayError(errorString) {
  let errorBox = (
    <div className={"error-message"}>
      {errorString}
    </div>
  )

  setTimeout(function() {
    errorBox.classList.remove("displayed");
    setTimeout(function() {
      errorBox.remove();
    }, 500);
  }, 3000)
  return (errorBox);
}

export async function createPost(newPost){
  try {
    const response = await axios.post('http://localhost:8000/posts/make', {
      title: newPost.title,
      content: newPost.content,
      postedBy: newPost.postedBy,
      postedDate: newPost.postedDate,
      views: newPost.views,
      linkFlairID: newPost.linkFlairID,
      commentIDs: newPost.commentIDs
    });
    return response.data; // This will be the comment._id from the server
  } catch (error) {
      console.error('Error creating post:', error);
      throw error;
  }
}

export async function updatePost(postID, newData) {
  try {
      const response = await axios.put(`http://localhost:8000/posts/update/${postID}`, newData);
      return response.data;
  } catch (error) {
      console.error('Error updating post:', error);
      throw error;
  }
}

export async function addView(postID) {
  try {
    const response = await axios.put(`https://localhost:8000/posts/addView/${postID}`);
    return response.data;
  }
  catch (error) {
    console.error("Error adding view:", error);
    throw error;
  }
}

export async function createComment(newComment){
  try {
    const response = await axios.post('http://localhost:8000/comments/make', {
      content: newComment.content,
      commentedBy: newComment.commentedBy,
      commentedDate: new Date(),
      commentIDs: []
    });
    return response.data; // This will be the comment._id from the server
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function updateComment(commentID, newData) {
  try {
    const response = await axios.put(`http://localhost:8000/comments/update/${commentID}`, newData);
    return response.data;
  } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
  }
}

export async function createCommunity(newCommunity){
  try {
    const response = await axios.post('http://localhost:8000/communities/make', {
      name: newCommunity.name,
      description: newCommunity.description,
      startDate: new Date(),
      postIDs: [],
      members: newCommunity.members
    });
    return response.data; // This will be the comment._id from the server
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function updateCommunity(communityID, newData) {
  try {
    const response = await axios.put(`http://localhost:8000/communities/update/${communityID}`, newData);
    return response.data;
  } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
  }
}

export async function createLinkFlair(newLinkFlair){
  try {
    const response = await axios.post('http://localhost:8000/linkflairs/make', {
      content: newLinkFlair.content,
    });
    return response.data; // This will be the comment._id from the server
  } catch (error) {
    console.error('Error making flair:', error);
    throw error;
  }
}
import { useEffect, useState } from 'react';
import * as utils from '../utility.js';
import DisplayPosts from './displayPosts.js';
import SortButtons from './sortButtons.js';

export default function Search(props) {
    const postIDList = props.postList;
    const [postList, setPostList] = useState([]);
    const query = props.query;
    // const postList = props.postList;
    console.log(postIDList);
    console.log(query);
    // const[posts, setPosts] = useState([]);
    // const [sortedList, setSortedList] = useState([]);

    const sortedPosts = (mode) => {
        setSortMode(mode);
    }

    const [sortMode, setSortMode] = useState("newest");

    // MAKE THIS A STATE

    // FOR SOME REASON THIS SEARCH DOESNT WORK>>>>
    // useMemo(() => {
    //     setPostList(utils.sortPosts(sortMode, postList));
    //     return [];
    // }, [sortMode, props.postList]);

    useEffect(() => {
        async function getPosts(postList){
            // get all the stuff from post 
            const fetchedPosts = [];

            // NOT SURE IF THEY COME SORTED ALR
            for (const postID of postList){
                console.log(await postID);
                const postObject = await utils.getPostObject(postID);
                
                if (postObject) {
                    fetchedPosts.push(postObject);
                }
            }
            setPostList(fetchedPosts);
        }
        
        // async function sortPosts(){
        //     return utils.sortPosts(sortMode, props.postList);
        // }

        // setSortMode("newest");

        getPosts(postIDList);

        // setSortedList(sortPosts());

    }, [props.query, sortMode]);

    return (
        <div className="view-posts">
            <div id="home-header">
                <span id="home-title">{(postList.length === 0) ? "No results found for" : "Results for"}: {query}</span>
                <SortButtons sortedPosts={sortedPosts} currentSortMode={sortMode} />
            </div>
            <p className="post-counter">{postList.length} post{(postList.length === 1) ? "" : "s"} shown</p>
            <DisplayPosts setPage={props.setPage} postList={postList} isCommunity={false} />
        </div>
    );
}
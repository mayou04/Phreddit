import DisplayPosts from './displayPosts.js';
import SortButtons from './sortButtons.js';
import { useMemo, useState, useEffect } from 'react';
import * as utils from '../utility.js';

export default function Search(props) {
    const query = props.query;

    const sortedPosts = (mode) => {
        setSortMode(mode);
    }

    const [sortMode, setSortMode] = useState("newest");

    const posts = useMemo(() => {
        return utils.sortPosts(sortMode, props.postList);
    }, [sortMode, props.postList]);

    useEffect(() => {
        setSortMode("newest");
    }, [props.query]);

    return (
        <div className="view-posts">
            <div id="home-header">
                <span id="home-title">{(posts.length === 0) ? "No results found for" : "Results for"}: {query}</span>
                <SortButtons sortedPosts={sortedPosts} currentSortMode={sortMode} />
            </div>
            <p className="post-counter">{posts.length} post{(posts.length === 1) ? "" : "s"} shown</p>
            <DisplayPosts setPage={props.setPage} postList={posts} isCommunity={false} />
        </div>
    );
}
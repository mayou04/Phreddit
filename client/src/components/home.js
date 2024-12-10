import { useEffect, useState } from 'react';
import { usePage } from '../contexts/pageContext.js';
import * as utils from '../utility.js';
import DisplayPosts from './displayPosts.js';
import SortButtons from './sortButtons.js';

export default function Home() {
    const { setPage } = usePage();
    const [allPosts, setAllPosts] = useState([]);
    const [sortedList, setSortedList] = useState([]);

    // State to hold the current sorting mode
    const [sortMode, setSortMode] = useState("newest");

    const fetchData = async () => {
        try {
            const data = await utils.requestData("http://localhost:8000/posts");
            setAllPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        async function sortPosts(){
            const sorted = await utils.sortPosts(sortMode, allPosts);
            setSortedList(sorted);
        }
        sortPosts();
    }, [sortMode, allPosts])

    const sortedPosts = (mode) => {
        setSortMode(mode);
    }

    return (
        <div className="view-posts">
            <div id="home-header">
                <span id="home-title">All posts</span>
                <SortButtons sortedPosts={sortedPosts} currentSortMode={sortMode} />
            </div>
            <p className="post-counter">{sortedList.length} post{(sortedList.length === 1) ? "" : "s"} shown</p>
            {sortedList && <DisplayPosts setPage={setPage} postList={sortedList} isCommunity={false} sortMode={sortMode} />}
        </div>
    );
}
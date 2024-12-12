import { useEffect, useState } from 'react';
import { usePage } from '../contexts/pageContext.js';
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import CreatePost from './createPost.js';
import Home from './home.js';
import Profile from './profile.js';
import Search from './search.js';
import Welcome from './welcome.js';

export default function Header() {
    const {selectedID, setSelectedID} = useSelectedID();
    const {setPage} = usePage();
    const [postList, setPostList] = useState([]);
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    // const [profile, setProfile] = useState([]);

    async function searchForResults(event) {
        if (event.key !== "Enter" || event.target.value === "") return;
        let search_query = event.target.value.toLowerCase().split(" ");
        let posts = await utils.getSearchResults(search_query);
        setPostList(posts);
        setSelectedID(null);
        setPage(<Search query={event.target.value} postList={posts} />);
        event.target.value = "";
    }
    
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const statusResponse = await utils.status();
                setStatus(statusResponse);
                setIsLoggedIn(statusResponse.isLoggedIn);
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
                const currentUser = users.find(user => user.name === status.user);
            }
        };

        fetchUser();
    }, [status.user]); // Only run when status.user changes

    return (
        <div id="banner">
            <div className="logo">
                <div id="logo-link" className="home-button" onClick={() => {
                    setSelectedID("home");
                    setPage(((status.isLoggedIn) ?  <Home/> : <Welcome/>));
                }}>
                    <img className="logo-img" src={require('../nah-id-code.png')} alt="Logo" />
                    <p className="logo-text">phreddit</p>
                </div>
            </div>
            <div className="searchbar">
                <input type="search" id="searchbar" className="bar" autoComplete="off" onKeyDown={searchForResults} placeholder="Search Phreddit..." />
            </div> 
            <div className="create-post">
                {(status.isLoggedIn) ? 
                    <div>
                        <input type="button" id="create-post-button" value="Log out" className={""} onClick={()=> {
                            utils.logoutUser();
                            setSelectedID("");
                            setPage(<Welcome/>);
                        }}/>
                        <input type="button" id="create-post-button" value={status.user.name} className={""} onClick={()=> {
                            setSelectedID("profile");
                            setPage(<Profile name={status.user.name}/>);
                        }}/>
                        <input type="button" id="create-post-button" value="Create Post" className={((selectedID === "createPost") ? " selected" : "")} onClick={()=> {
                            setSelectedID("createPost");
                            setPage(<CreatePost />);
                        }}/>  
                    </div> : 
                    <div>
                        <input type="button" id="guest-button" value="Guest" className={""} /> 
                        <input type="button" id="guest-create-post-button" value="Create Post" className={((selectedID === "createPost") ? " selected" : "")} onClick={()=> {
                        }}/>  
                    </div> }

            </div>
        </div>
    );
}
import { usePage } from '../contexts/pageContext.js';
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
import CreatePost from './createPost.js';
import Home from './home.js';
import Search from './search.js';

export default function Header(props) {
    const {selectedID, setSelectedID} = useSelectedID();
    const {setPage} = usePage();

    function searchForResults(event) {
        if (event.key !== "Enter" || event.target.value === "") return;
        let search_query = event.target.value.toLowerCase().split(" ");
        let postList = utils.getSearchResults(search_query);
        setSelectedID(null);
        setPage(<Search query={event.target.value} postList={postList} />);
        event.target.value = "";
    }

    return (
        <div id="banner">
            <div className="logo">
                <div id="logo-link" className="home-button" onClick={() => {
                    setSelectedID("home");
                    setPage(<Home setPostID={props.setPostID}/>);
                    // THIS SENDS TO WELCOME PAGE
                }}>
                    <img className="logo-img" src={require('../nah-id-code.png')} alt="Logo" />
                    <p className="logo-text">phreddit</p>
                </div>
            </div>
            <div className="searchbar">
                <input type="search" id="searchbar" className="bar" autoComplete="off" onKeyDown={searchForResults} placeholder="Search Phreddit..." />
            </div> 
            <div className="create-post">
                {/* GUEST /  */}
                {/* Create post grey if guest /  */}
                {/* Profile button */}
                {/* LOGOUT BUTTON */}
                <input type="button" id="create-post-button" value="Create Post" className={((selectedID === "createPost") ? " selected" : "")} onClick={()=>
                {
                    setSelectedID("createPost");
                    setPage(<CreatePost />);
                }}
                />
            </div>
        </div>
    );
}
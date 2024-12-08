import { useSelectedID } from '../contexts/selectedIDContext.js';
import { usePage } from '../contexts/pageContext.js';
import Home from './home.js';
import Community from './community.js';
import CreateCommunity from './createCommunity.js';
import * as utils from '../utility.js';
import { useState, useEffect } from 'react';

function Members(props) {
    var plural = (props.length === 1) ? "" : "s";
    return <h4>{props.length} member{plural}</h4>;
}

export default function Navbar(props) {
    const {selectedID, setSelectedID} = useSelectedID();
    const {setPage} = usePage();
    const [communities, setCommunities] = useState([]);

    const fetchData = async () => {
        try {
            const data = await utils.requestData("http://localhost:8000/communities");
            setCommunities(data);
        } catch (error) {
            console.error("Error fetching communities:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [utils.requestData("http://localhost:8000/communities")]);

    function renderCommunityList(){
        if (communities === null){
            return;
        }
        // ORDER BY JOINED FIRST
        return communities.map((community) => 
            <div className={"community-link" + ((selectedID === community._id) ? " selected" : "")} id={community._id} key={community._id} onClick={() => {
                setSelectedID(community._id);
                setPage(<Community commId={community._id} posts={community.postIDs} />); // Pass posts in community (getall posts??)
            }} >
                <h3>{community.name}</h3>
                <Members length={community.members.length} />
            </div>
        )
    }

    return (
        <div id="left-sidebar">
            <div className="home-section">
                <input type="button" className={"home-button" + ((selectedID === "home") ? " selected" : "")} value="Home" onClick={() => {
                    setSelectedID("home");
                    setPage(<Home />);
                }} />
            </div>
            <hr />
            <div className="communities-section">
                <h2>Communities</h2>
                {/* GREYED OUT FOR GUEST */}
                <input type="button" className={"create-community-button" + ((selectedID === "createCommunity") ? " selected" : "")} value="Create Community" onClick={() => {
                    setSelectedID("createCommunity");
                    setPage(<CreateCommunity />);
                }} />
                <div id="community-list">
                    {renderCommunityList()}
                </div>
            </div>
        </div>
    );
  }
import Error from './error.js';
import { useState, useEffect } from "react"; 
import * as utils from '../utility.js';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import Community from './community.js';

export default function CreateCommunity() {
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    const {setSelectedID} = useSelectedID();
    const[communities, setCommunities] = useState();

    const displayError = (errorStr) => {
        setErrorMessage(errorStr);
    };

    // Set the object elements
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [communityCreator, setCommunityCreator] = useState("");

    useEffect(()=> {
        async function fetchData(){
            setCommunities(await utils.requestData("http://localhost:8000/communities"));    
        }
        fetchData();
    }, [])
    
    async function submitCommunity(){
        let community = {};
        community.description = communityDescription;
        community.members = [];
        community.members.push(communityCreator);
        community.name = communityName;
        community.postIDs = [];
        community.startDate = new Date();

        //arg check
        if (communityName.length > 100) {
            return displayError("Community name cannot be more than 100 characters");
        }
        else if (communityName.length === 0) {
            displayError("Community name cannot be empty");
        }
        else if (await utils.communityNameExists(communities, communityName)) {
            displayError("Community with this name already exists");
        }
        else if (communityDescription.length > 500) {
            displayError("Community description cannot be more than 500 characters");
        }
        else if (communityDescription.length === 0) {
            displayError("Community description cannot be empty");
        }
        else if (community.members[0] === "") {
            displayError("Must specify username of community creator");
        }
        else {
            const communityID = await utils.createCommunity(community);

        setSelectedID(communityID);
        setPage(<Community commId={communityID} posts={[]} />);
        }
    }

    return (
        <div id="make-item">
            <div id="make-community">
                {/* CHEKC IF ITS UNIQUE */}
                <h5>Community Name: <span className="small">(required)</span></h5>
                <input type="text" autoComplete="off" id="community-name-field" onChange={(e) => setCommunityName(e.target.value)}/>
                <h5>Community Description: <span className="small">(required)</span></h5>
                <textarea autoComplete="off" id="community-desc-field" onChange={(e) => setCommunityDescription(e.target.value)}></textarea>
                {/* NO CREATOR NAME, ITS THE USER */}
                <h5>Community Creator: <span className="small">(required)</span></h5>
                <input type="text" autoComplete="off" id="community-creator-field" onChange={(e) => setCommunityCreator(e.target.value)}/>
                <br/>
                <input type="button" id="community-submit-button" value="Engender Community" onClick={() => {submitCommunity()}}/>
                {errorMessage && <Error message={errorMessage} onClose={() => {
                    setErrorMessage(null);
                }} />}
            </div>
        </div>
    );
}
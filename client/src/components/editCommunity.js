import Error from './error.js';
import { useState, useEffect } from "react"; 
import * as utils from '../utility.js';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import Community from './community.js';

export default function EditCommunity() {
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    const {setSelectedID} = useSelectedID();
    const[communities, setCommunities] = useState();
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    const [profile, setProfile] = useState([]);

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

    
    // Remove the status check from dependency array and use a proper tracking method
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
                setProfile(currentUser);
            }
        };

        fetchUser();
    }, [status.user]); // Only run when status.user changes
    
    async function submitCommunity(){
        let community = {};
        community.description = communityDescription;
        community.members = [];
        community.members.push(status.user.name);
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
        else {
            const communityID = await utils.createCommunity(community);
            console.log(await communityID);
            setSelectedID(communityID);
            setPage(<Community commId={communityID} posts={[]} />);
        }
    }

    return (
        <div id="make-item">
            <div id="make-community">
                <h5>Community Name: <span className="small">(required)</span></h5>
                <input type="text" autoComplete="off" id="community-name-field" onChange={(e) => setCommunityName(e.target.value)}/>
                <h5>Community Description: <span className="small">(required)</span></h5>
                <textarea autoComplete="off" id="community-desc-field" onChange={(e) => setCommunityDescription(e.target.value)}></textarea>
                <h5>
                    <input type="button" id="community-submit-button" value="Engender Community" onClick={() => {submitCommunity()}}/>
                </h5>
                {errorMessage && <Error message={errorMessage} onClose={() => {
                    setErrorMessage(null);
                }} />}
            </div>
        </div>
    );
}
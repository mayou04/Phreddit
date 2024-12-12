import Error from './error.js';
import { useState, useEffect } from "react"; 
import * as utils from '../utility.js';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import Community from './community.js';
import Profile from './profile.js';

export default function EditCommunity(props) {
    const {setPage} = usePage();
    const name = props.name;
    const [errorMessage, setErrorMessage] = useState(null);
    const {setSelectedID} = useSelectedID();
    const[communities, setCommunities] = useState();
    const [status, setStatus] = useState(utils.status());  
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    const [profile, setProfile] = useState([]);
    const [deleteYes, setDeleteYes] = useState(false);

    const displayError = (errorStr) => {
        setErrorMessage(errorStr);
    };

    // Set the object elements
    const communityObject = props.community;
    const [communityName, setCommunityName] = useState(communityObject.name || "");
    const [communityDescription, setCommunityDescription] = useState(communityObject.description || "");

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
        //arg check
        if (communityName.length > 100) {
            return displayError("Community name cannot be more than 100 characters");
        }
        else if (communityName.length === 0) {
            displayError("Community name cannot be empty");
        }
        else if (communityDescription.length > 500) {
            displayError("Community description cannot be more than 500 characters");
        }
        else if (communityDescription.length === 0) {
            displayError("Community description cannot be empty");
        }
        else {
            communityObject.name = communityName;
            communityObject.description = communityDescription;

            const response = await utils.updateCommunity(communityObject._id, communityObject);
            console.log("Community created:", response);

            setPage(<Profile name={name}/>);
        }
    }

    async function deleteCommunity(){
        setDeleteYes(true);
    }
    
    async function actualDeleteCommunity(){
        setDeleteYes(false);
        const response = await utils.deleteCommunity(communityObject._id);
        console.log('Community deleted:', response);

        setPage(<Profile name={name}/>);
    }

    return (
        <div id="make-item">
            <div id="make-community">
                <h5>Community Name: <span className="small">(required)</span></h5>
                <input type="text" autoComplete="off" id="community-name-field" value={communityName} onChange={(e) => setCommunityName(e.target.value)}/>
                <h5>Community Description: <span className="small">(required)</span></h5>
                <textarea autoComplete="off" id="community-desc-field" value={communityDescription} onChange={(e) => setCommunityDescription(e.target.value)}></textarea>
                <h5>
                <input type="button" id="community-submit-button" value="Engender Community" onClick={() => {submitCommunity()}}/>
                &nbsp;
                <input type="button" id="community-submit-button" value="Delete Community" onClick={() => {deleteCommunity()}}/>
                {(deleteYes) ? 
                    <div>Are you sure? <br/>
                        <input type="button" id="community-submit-button" value="Affirm." onClick={() => {actualDeleteCommunity()}}/>
                    </div> : <div></div>}
                </h5>
                {errorMessage && <Error message={errorMessage} onClose={() => {
                    setErrorMessage(null);
                }} />}
            </div>
        </div>
    );
}
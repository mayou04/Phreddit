import { useState } from 'react';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import Error from './error.js';
import Home from './home.js';

export default function Welcome(){
    const [pageState, setPageState] = useState("welcome");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const {setPage} = usePage();
    const [errorMessage, setErrorMessage] = useState(null);
    const {setSelectedID} = useSelectedID();
    
    const displayError = (errorStr) => {
        setErrorMessage(errorStr);
    };

    function loginOptions(){
        return (
            <div id="make-item">
                <div id="register">
                    <input type="button" className={"register"} value="Register as New User" onClick={() => {
                        setPageState("register");
                    }}/>
                </div>
                <div id="login">
                    <input type="button" className={"login"} value="Login as Existing User" onClick={() => {
                        setPageState("login");
                    }}/>
                </div>
                <div id="guest">
                    <input type="button" className={"guest"} value="Continue as Guest" onClick={() => {
                        setPageState("guest");
                    }}/>
            </div>
        </div>
        );
    }

    function register(){
        return (
            <div>       
                <div id="make-item">
                    <div id="back-button">
                        <input type="button" className={"go-back"} value="Go Back" onClick={() => {
                            setPageState("welcome");
                        }}/>
                    </div>
                    <h5>First Name: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="first-name-field" onClick={(e) => {
                            setFirstName(e.target.value);
                    }}/>
                    <h5>Last Name: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="last-name-field" onClick={(e) => {
                            setLastName(e.target.value);
                        }}/>
                    <h5>Email: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="email-field" onClick={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    <h5>Display Name: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="display-name-field" onClick={(e) => {
                            setDisplayName(e.target.value);
                        }}/>
                    <h5>Password: <span className="small">(required)</span></h5>
                    <input type="password" autoComplete="off" id="password-field" onClick={(e) => {
                            setPassword(e.target.value);
                        }}/>
                    <h5>Retype Password: <span className="small">(required)</span></h5>
                    <input type="password" autoComplete="off" id="retype-password-field" onClick={(e) => {
                            setRetypedPassword(e.target.value);
                        }}/>
                    <br/>
                    <input type="button" className="login-submit-button" value="Login" onClick={() => {createUser()}}/>
                    {errorMessage && <Error message={errorMessage} onClose={() => {
                        setErrorMessage(null);
                    }} />}
                </div>
            </div>
        )
    }

    function login(){
        return (
            <div>
                <div id="make-item">
                    <input type="button" className={"go-back"} value="Go Back" onClick={() => {
                        setPageState("welcome");
                    }}/>
                </div>
                <div id="make-item">
                    <h5>Email: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="email-field" onClick={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    <h5>Password: <span className="small">(required)</span></h5>
                    <input type="password" autoComplete="off" id="password-field" onClick={(e) => {
                            setPassword(e.target.value);
                        }}/>
                    <br/>
                    <input type="button" className="login-submit" value="Login"onClick={() => {logUserIn()}}/>
                    {errorMessage && <Error message={errorMessage} onClose={() => {
                        setErrorMessage(null);
                    }} />}
                </div>
            </div>
        )

    }
    
    async function createUser(){
        // let community = {};
        // community.description = communityDescription;
        // community.members = [];
        // community.members.push(communityCreator);
        // community.name = communityName;
        // community.postIDs = [];
        // community.startDate = new Date();

        // //arg check
        // if (communityName.length > 100) {
        //     return displayError("Community name cannot be more than 100 characters");
        // }
        // else if (communityName.length === 0) {
        //     displayError("Community name cannot be empty");
        // }
        // else if (await utils.communityNameExists(communities, communityName)) {
        //     displayError("Community with this name already exists");
        // }
        // else if (communityDescription.length > 500) {
        //     displayError("Community description cannot be more than 500 characters");
        // }
        // else if (communityDescription.length === 0) {
        //     displayError("Community description cannot be empty");
        // }
        // else if (community.members[0] === "") {
        //     displayError("Must specify username of community creator");
        // }
        // else {
        //     const communityID = await utils.createCommunity(community);

        //     setSelectedID(communityID);
        //     setPage(<Community commId={communityID} posts={[]} />);
        // }
    }

    async function logUserIn(){

    }

    return (
        <div className="welcome-page">
            <div id="welcome-text">Welcome to Phreddit</div>
            {(pageState === "welcome") ? loginOptions() : 
            ((pageState === "register") ? register() : 
            ((pageState === "login") ? login() : setPage(<Home/>)))}
        </div>
    );
}
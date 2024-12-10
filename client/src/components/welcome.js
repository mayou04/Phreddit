import { useState } from 'react';
import { usePage } from "../contexts/pageContext.js";
import { useSelectedID } from '../contexts/selectedIDContext.js';
import * as utils from '../utility.js';
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
                    <input type="text" autoComplete="off" id="first-name-field" onChange={(e) => {
                            setFirstName(e.target.value);
                    }}/>
                    <h5>Last Name: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="last-name-field" onChange={(e) => {
                            setLastName(e.target.value);
                        }}/>
                    <h5>Email: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="email-field" onChange={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    <h5>Display Name: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="display-name-field" onChange={(e) => {
                            setDisplayName(e.target.value);
                        }}/>
                    <h5>Password: <span className="small">(required)</span></h5>
                    <input type="password" autoComplete="off" id="password-field" onChange={(e) => {
                            setPassword(e.target.value);
                        }}/>
                    <h5>Retype Password: <span className="small">(required)</span></h5>
                    <input type="password" autoComplete="off" id="retype-password-field" onChange={(e) => {
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
                    <div id="back-button">                
                        <input type="button" className={"go-back"} value="Go Back" onClick={() => {
                            setPageState("welcome");
                        }}/>
                    </div>
                    <h5>Email: <span className="small">(required)</span></h5>
                    <input type="text" autoComplete="off" id="email-field" onChange={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    <h5>Password: <span className="small">(required)</span></h5>
                    <input type="password" autoComplete="off" id="password-field" onChange={(e) => {
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
        let user = {};
        
        user.name = displayName;
        user.password = password;
        user.email = email;
        user.isAdmin = false;
        user.joinedDate = new Date();

        //arg check
        if (firstName.length === 0) {
            return displayError("First name cannot be empty");
        }
        else if (lastName.length === 0) {
            displayError("Last name cannot be empty");
        }
        else if (email.length === 0) {
            displayError("Email cannot be empty");
        }
        else if (!email.includes("@")) {
            displayError("Email not properly formatted");
        }
        else if (displayName.length === 0) {
            displayError("Display name cannot be empty");
        }
        else if (password.length === 0) {
            displayError("Password cannot be empty");
        }
        else if (password.includes(firstName) || password.includes(lastName) || password.includes(displayName) || password.includes(email.split("@")[0])) {
            displayError("Password cannot include first name, last name, display name, and email ID");
        }
        else if (password !== retypedPassword) {
            displayError("Password does not match");
        }
        else {
            let userID = await utils.registerUser(user);
            if (userID !== "Error making user"){
                setPage(<Welcome/>);
            }
        }
    }

    async function logUserIn (){
        let user = {};
        
        user.email = email;
        user.password = password;

        //arg check
        if (email.length === 0) {
            displayError("Email cannot be empty");
        }
        else if (!email.includes("@")) {
            displayError("Email not properly formatted");
        }
        else if (password.length === 0) {
            displayError("Password cannot be empty");
        }
        else {
            let userID;
            try {
                userID = await utils.loginUser(email, password);
                displayError("Account created.");
                setPage(<Home/>);
            } catch(err){
                displayError("Error logging in");
                
            }
            // if (userID !== "Error logging in"){
            // }
        }
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
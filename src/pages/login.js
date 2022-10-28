import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { sendApiRequest } from '../utils/helper';
import Popup from '../components/popUp';
import Spinner from '../components/spinner';
import HOST from '..';

export default function Login({ authorization, systemAlert }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [popup, setPopup] = useState(false);
    // const [verification, setVerification] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(()=> {
        document.getElementById('login').disabled = true;
    },[]);

    const sendOtpMail = async (email) => {

        if(!email) return {status: false, message:'email required.'};

        let config = {
            method: 'POST',
            url: HOST + '/app/otp',
            data: {
                email: email, 
                password: password
            }
        }

        let response = await sendApiRequest(config);

        console.log(response);
        // 404 user doesnt exists
        // otp generation failed, email/password incorrect.

        if([404,406].includes(response.status)) {
            // display any OTP related error.
            systemAlert({message: response.data.message, type: 'alert'});

        }
        
        return response.data;

    }

    const handleInputChange = (event) => {

        event.preventDefault();
        
        const name = event.target.name;
        const value = event.target.value;
        
        if(name === 'email') setEmail(value);
        if(name === 'password') setPassword(value);

        // enable login submit button only when email and password fields are filled.
        if(email && password){
            document.getElementById('login').disabled = false;
        }
    }

    const SubmitCredentials = async (event) => {

        event.preventDefault();

        // navigate to register page if users clicks register button.
        if (event.target.name === "register") {
            return navigate('/app/register');
        }
        if (event.target.name === 'login') {
            // OTP genration status
            let otpGenerated = await sendOtpMail(email);
            // if OTP generation failed/Password mismatch return.
            if(!otpGenerated.status) return 
            // OTP is successfully generated bring up the OTP verification screen.
            return setPopup(true);
        }

        let config = {
            method: 'POST',
            url: HOST + '/app/login',
            data: {
                email: email,
                password: password
            }
        }
        console.log("sending data..");

        let response = await sendApiRequest(config);

        console.log('data',response);

        if (response.status === 200) {
            // store jwt in localstorage
            localStorage.setItem("token", response.data.data.token)
            // store user_id in localstorage
            localStorage.setItem("user_id", response.data.data.user_id)
            // setting the authorization to true for accessing the app routes.
            authorization(true);
            // navigating to the next page after authorization.
            navigate("/app");
        }
        else if (response.status === 404) {
            // if user does'nt exists.
            systemAlert({message: response.data.message, type: 'alert'});
            // navigate to register page.
            navigate("/app/register");

        }
        else if (response.status === 406) {
            systemAlert({message: response.data.message, type: 'alert'});
        }
        else systemAlert({message: "Something went wrong. Please try after sometime.", type:'alert'});

    }

    return (
        <div className='container mt-3'>
            {popup ? <Popup popup={setPopup} verification={setLoading} email={email} login={SubmitCredentials} systemAlert={systemAlert}/> : (loading) ? <Spinner/>: <div className='row'>
                <h2>Login Portal</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" name="email" className="form-control" id="exampleInputEmail1" value={email} onChange={handleInputChange} />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" name="password" className="form-control" id="exampleInputPassword1" value={password} onChange={handleInputChange} />
                    </div>
                    <button type="submit" id="login" name="login" className="btn btn-primary m-2" onClick={SubmitCredentials}>Login</button>
                    <button type="submit" name="register" className="btn btn-outline-primary m-2" onClick={SubmitCredentials}>Register</button>
                </form>

            </div>
            }

        </div>
    )

}
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

import { sendApiRequest } from "../utils/helper";

import HOST from "..";


export default function Register({systemAlert}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    async function SubmitCredentials(event) {
        event.preventDefault();

        if(event.target.name === "back") {
            return navigate("/");
        }

        // form validations
        if(!email)  return systemAlert({message:"Email address is required.", type:"alert"});
        if(!password) return systemAlert({message:"Password is required.",type:"alert"});
        if(!username) return systemAlert({message:"Username is required",type:"alert"});

        let response = await sendApiRequest({
            method: 'POST',
            url: HOST + '/app/register',
            data: {
                user_name:username,
                password:password,
                email: email
            }
        });

        console.log(response);

        if (response.status === 200 && response.data.status) {
            // alert user after registration.
            systemAlert({message:"User Registered Successfully. Please login.",type:"success"})
            // navigating to the next page after authorization
            navigate("/");
        }
        else if (response.status === 404) {
            // if user does'nt exists.
            systemAlert({message:response.data.message,type:"alert"});
            // navigate to register page.
            navigate("/app/register");

        }
        else if (response.status === 406) {
            systemAlert({message:response.data.message,type:"alert"});
        }
        else systemAlert({message:"Something went wrong. Please try after sometime.",type:"alert"});

    }

    return (
        <div className='container mt-3'>
            <div className='row'>
                <h2>User Registration Portal</h2>
                <form onSubmit={SubmitCredentials}>
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">User Name</label>
                        <input type="text" className="form-control" id="userName" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <div id="usernameHelp" className="form-text">Please enter a username to register.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" name="login" className="btn btn-primary m-2" onClick={SubmitCredentials}>Register</button>
                    <button type="submit" name="back" className="btn btn-outline-danger m-2" onClick={SubmitCredentials}>Cancel</button>
                </form>
            </div>
        </div>
    )

}
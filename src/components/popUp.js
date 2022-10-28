import { useState , useEffect } from "react"
import { sendApiRequest } from "../utils/helper";
import { useNavigate } from 'react-router-dom';


import HOST from "..";

export default function Popup({verification, popup, login, email, systemAlert}) {

    let [length, setLength] = useState(0);
    const [otp, setOtp] = useState('');

    let navigate = useNavigate();

    useEffect(()=>{
        document.getElementById('otp-sub').disabled = true;
        document.getElementById('otp-resub').disabled = true;
    },[])

    function handleChange(e){
        // set input value.
        setOtp(e.target.value);
        // if delete button is pressed reduce the count.
        if(!e.nativeEvent.data) {
            setLength(--length);
            document.getElementById('otp-sub').disabled = true;
            return;
        }
        // if other than del and characters increase the count.
        setLength(++length);
        // if otp input length equal to 4 enable otp verify button.
        if(length == 4) {
            document.getElementById('otp-sub').disabled = false;
        }

    }

    async function handleClick(e) {

        console.log(e);
        if(!email) return systemAlert({message:'Email is required.', type: 'alert'});

        let config = {
            method: 'POST',
            url: HOST + '/app/verify',
            data: {
                email: email,
                otp: parseInt(otp)
            }
        }

        let response = await sendApiRequest(config);

        console.log(response);

        if (response.status === 200) {
            // make otp verification true(success).
            verification(true);
            // disable the otp verfication screen.
            popup(false);
            // make login request.
            login(e);
        
        }
        else if ([404,406].includes(response.status)) {
            // if user otp is not generated or for otp incorrect .
            systemAlert({message:response.data.message, type:'alert'});
            // nagivate to login page.
            navigate('/');
            
        }
        else systemAlert({message:"Something went wrong. Please try after sometime.",type:'alert'});
        
    }

    return (
        <div className="container">
            <div className="row">
                <h1>OTP Verification</h1>
                <div className="mb-3">
                    <input
                        type="text"
                        minLength="4"
                        maxLength="4"
                        className="form-control"
                        placeholder='Please enter OTP sent to your email'
                        onChange={(e)=>handleChange(e)} 
                        value={otp}
                        id="userName" required />
                </div>
            </div>
            <button type="submit" id="otp-sub" name="otp-submit" className="btn btn-primary m-2"  onClick={handleClick}>Verify</button>
            <button type="submit" id="otp-resub" name="otp-resend" className="btn btn-outline m-2">Resend</button>
        </div>
    )
};
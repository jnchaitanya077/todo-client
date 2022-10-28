import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import ToDo from './pages/todo';
import Register from './pages/register';

import { sendApiRequest } from './utils/helper';

import HOST from '.';

export default function AppRouter() {

    const [authorized, setAuthorization] = useState(false);
    const alertMessage = useRef(0);

    useEffect(() => {
      
        async function checkUserSession() {

            let isActive = await sendApiRequest({
                method: 'GET',
                url: HOST + '/app/login'
            });

            console.log("active==>", isActive.data)
            isActive = isActive.data;
            if (isActive) setAuthorization(isActive);

        }

        checkUserSession();

    }, [])

    function createAlert({ message, type }) {

        alertMessage.current.innerHTML = message;
        alertMessage.current.style.display = "block";

        let alertClass = 'alert-danger';

        if (type === 'success') alertClass = 'alert-success';
        document.getElementById('alert-div').classList.add(alertClass);

        setTimeout(() => {
            alertMessage.current.style.display = "none";
            document.getElementById('alert-div').classList.remove(alertClass);

        }, 3000)
    }

    function handleAuthorization(isAuthorized) {

        if (!isAuthorized) {
            // clear all the stored localStorage varibales when logout and when not authorized.
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user_id');

        }

        setAuthorization(isAuthorized);
    }

    async function handleLogout(event) {

        event.preventDefault();

        let response = await sendApiRequest({
            method: 'POST',
            url: HOST + '/app/logout',
            data: {
                user_id: localStorage.user_id
            }
        })

        console.log(response);

        if (response.status === 440) {
            // alert user before logout.
            alert("Session Expired. Please login");
            // if response code is 440 set authorization to false.
            handleAuthorization(false);
        }
        else if (response.status === 200 && response.data.status) {
            // And set authorizatio to flase to navigate to login page.
            handleAuthorization(false);
            // alert user before logging out.
            alert('logged out successfully!! ');

        }

    }

    return (
        <>
            <div id="alert-div" className="alert shadow p-3 mb-5 rounded" ref={alertMessage} role="alert" style={{ display: "none" }}>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={authorized ? <ToDo authorization={handleAuthorization} logout={handleLogout} systemAlert={createAlert} /> : <Login authorization={handleAuthorization} systemAlert={createAlert} />} />
                    <Route path='/app' element={authorized ? <ToDo authorization={handleAuthorization} logout={handleLogout} systemAlert={createAlert} /> : <Login authorization={handleAuthorization} systemAlert={createAlert} />} />
                    <Route path='/app/register' element={<Register systemAlert={createAlert} />} />
                    <Route path='*' element={'Its funny people always gets lost!!'} />
                </Routes>
            </BrowserRouter>

        </>

    )
}
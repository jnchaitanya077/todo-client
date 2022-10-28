import axios from 'axios';

axios.defaults.withCredentials = true;

async function sendApiRequest(config) {

    try {
        config.headers = {'x-access-token': localStorage.getItem('token')};
        let response = await axios(config);
        return response;
        
    } catch (error) {
        console.log("Error==>", error);
        return error.response;
    }
    
}

function formatDate(date) {

    return date.split('T')[0]
    
}

export { sendApiRequest, formatDate };
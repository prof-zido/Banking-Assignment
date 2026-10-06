const axios = require('axios');

let token = null
let tokenExpiration = null;

//create an axios instance with the NIBSS API base URL and authorization header
const nibssClient = axios.create({
    baseURL: process.env.NIBSS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    },
});

//function to fetch a new token from the NIBSS API
const fetchToken = async () => {
    try {
        const response = await axios.post(`${process.env.NIBSS_BASE_URL}/api/auth/token`, {
            apiKey: process.env.NIBSS_API_KEY,
            apiSecret: process.env.NIBSS_API_SECRET
        });
        token = response.data.token;
        tokenExpiration = Date.now() + (3600 * 1000);
    } catch (error) {
        console.error('External API Authentication Failed:', error);
        throw error;
    }
};

//function to get a valid token, fetching a new one if necessary
const getValidToken = async () => {
    if (!token || Date.now() >= tokenExpiration) { 
        await fetchToken();
        nibssClient.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return token;
}


module.exports = {
    nibssClient,
    getValidToken,
};
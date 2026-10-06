
const { getValidToken, nibssClient } = require('../Config/NibbsConfig')

//Get account name from account number
nameEnquiry = async (userName, accountNumber) => {
    try {

        //Get valid token from NIBSS API
        const token = await getValidToken();

        //Get all account from NIBSS API
        const response = await nibssClient.get(`/api/account/name-enquiry/${accountNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.data.accountName == userName){
            return true
        }else{
            return false
        }

    } catch (error) {
        console.error('Error getting accounts:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            message: 'Error getting accounts',
            error: error.response?.data || error.message,
        });
    }
}

module.exports = nameEnquiry;
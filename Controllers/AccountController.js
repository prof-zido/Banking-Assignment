const Account = require('../Models/Account');
const generate11DigitString = require('../Utility/GenerateBvn');
const User = require('../Models/Users');
const { getValidToken, nibssClient } = require('../Config/NibbsConfig');

//create account
exports.createAccount = async (req, res) => {
    try {

        //verify user token
        const decodedToken = req.user;
        if (!decodedToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        } 

        const user = await User.findById(decodedToken.id);

         //Get user data of from user model
        const dateOfBirth = user.dateOfBirth;
        const phoneNumber = user.phoneNumber;
        const email = user.email;
        const firstName = user.fullName.split(' ')[0];
        const lastName = user.fullName.split(' ')[1];
     
        
        const account = await Account.findOne({ email: email });
        

        //check if the user already has an account using the acccount number
        if (account) {
            return res.status(400).json({ message: 'User already has an account' });
        }

        //generate unique account BVN
        const NIN = generate11DigitString();
       

        //Get valid token from NIBSS API
        const token = await getValidToken();
      

        //insert NIN in NIBSS API
          const responseNIN = await nibssClient.post('/api/insertNin', {
            "nin": NIN,
            "firstName": firstName,
            "lastName": lastName,
            "dob": dateOfBirth,
            "phoneNumber": phoneNumber
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log(responseNIN.data);

        //Create account number from NIBSS API
        const response = await nibssClient.post('/api/account/create', {
            "kycType": "nin",
            "kycID": NIN,
            "dob": dateOfBirth,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log(response.data);

     
        //save account details in the database
        const accountNumber = response.data.account.accountNumber;
        const accountBalance = response.data.account.balance;
        const newAccount = new Account({
            accountNumber: accountNumber,
            email: email,
            phoneNumber: phoneNumber,
            NIN: NIN,
            accountBalance: accountBalance,
        });
        await newAccount.save();

        res.status(201).json({ message: 'Account created successfully', account: newAccount });

    } catch (error) {
        console.error('NIBSS status:', error.response?.status);
        console.error('NIBSS response:', error.response?.data);
        console.error('NIBSS URL:', error.config?.baseURL + error.config?.url);
        console.error('NIBSS headers:', {
            authorization: error.config?.headers?.Authorization ? 'present' : 'missing',
            contentType: error.config?.headers?.['Content-Type']
        });

        return res.status(500).json({
            message: 'Error creating account',
            error: error.response?.data || error.message
        });
    }
};

//Get all accounts
exports.getAllAccounts = async (req, res) => {
    try {
        //verify user token
        const decodedToken = req.user;
        if (!decodedToken || decodedToken.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized' });
        } 

        //Get valid token from NIBSS API
        const token = await getValidToken();

        //Get all account from NIBSS API
        const response = await nibssClient.get(`/api/accounts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        res.status(200).json({
            message: 'Accounts retrieved successfully',
            accounts: response.data,
        });

    } catch (error) {
        console.error('Error getting accounts:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            message: 'Error getting accounts',
            error: error.response?.data || error.message,
        });
    }
}

//Get account balance
exports.getAccountBalance = async (req, res) => {
    try {
        //verify user token
        const decodedToken = req.user;
        if (!decodedToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        } 

        //get account number
        const account = await Account.findOne({ email: decodedToken.email });

        if (!account){
             return res.status(400).json({ message: 'User does not have an account' });
        }


        //Get valid token from NIBSS API
        const token = await getValidToken();

        //Get all account from NIBSS API
        const response = await nibssClient.get(`/api/account/balance/${account.accountNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        res.status(200).json({
            message: 'Account balance retrieved successfully',
            accounts: response.data,
        });
    
    } catch (error) {
        console.error('Error getting accounts:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            message: 'Error getting accounts',
            error: error.response?.data || error.message,
        });
    }
}



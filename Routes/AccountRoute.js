const express = require('express');
const router = express.Router();
const accountController = require('../Controllers/AccountController');
const { verifyToken } = require('../Middleware/auth');

//define the routes
router.post('/createAccount', verifyToken, accountController.createAccount);
router.get('/getAllaccounts', verifyToken, accountController.getAllAccounts)
router.get('/getAccountBalance', verifyToken, accountController.getAccountBalance)
router.get('/nameEnquiry', verifyToken, accountController.getAccountBalance)

module.exports = router;
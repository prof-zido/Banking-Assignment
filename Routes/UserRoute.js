const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');

//define the routes
router.post('/createUser', userController.createUser);
router.post('/loginUser', userController.loginUser);


module.exports = router;
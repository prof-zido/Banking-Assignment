const User = require('../Models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const { fullName, gender, dateOfBirth, phoneNumber, email, password, role, hasAdminAccess} = req.body;
        
    
        //check if all required fields are provided
        if (!fullName || !gender || !dateOfBirth || !phoneNumber || !email || !password || !role || !hasAdminAccess) {
            return res.status(400).json({ message: 'All fields are required' });
        }

      
        //check if email already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

       

        //check if phone number already exists
        const existingPhoneNumber = await User.findOne({ phoneNumber: phoneNumber });
        if (existingPhoneNumber) {
            return res.status(400).json({ message: 'User already exists' });
        }

    
        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = new User({
            fullName: fullName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            phoneNumber: phoneNumber,
            email: email,
            password: hashedPassword,
            role: role,
            hasAdminAccess: hasAdminAccess
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        //generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({ message: 'Login successful', user: { name: user.fullName, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

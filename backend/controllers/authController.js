const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//User Registration
exports.register = async (req, res) => {
    try{
        const {name, email, password, role} = req.body;

        // Check if admin registration is allowed
        if(role === 'admin'){
            return res.status(400).json({message: 'Admin registration is not allowed'});
        };

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // Create user
        const user = new User({name, email, password: hashedPassword, role});
        await user.save();

        res.status(201).json({message: 'User registered successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Server error'});

    }
};




//User Login
exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;


        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: 'Invalid credentials'});
        };


        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid credentials'});
        };


        // Generate token
        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};
       
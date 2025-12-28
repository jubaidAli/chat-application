import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js'


export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        // hash password ( bcrypt )
        if(!fullName || !email || !password) {
            return  res.status(400).json({message: 'Please enter all fields'});
        }

        if(password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({message: 'User already exists'});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser) {
            // generate JWT token ( jsonwebtoken )
            generateToken(newUser._id, res);
            await newUser.save();


            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic || null,
            });
            
        } else {
            return res.status(400).json({message: 'Invalid user data'});
        }

    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({message: error.message || 'Server error'});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // generate JWT token
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic || null,
        }); 
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: error.message || 'Internal Server error' });
    } 
}

export const logout = async (req, res) => {
    try {
        // Clear the auth cookie with matching attributes
        res.clearCookie('jwt_token', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
            path: '/',
        });
        res.status(200).json({message: 'Logged out successfully'});
    } catch (error) {
        console.error('Logout error:', error.message);
        res.status(500).json({message: error.message || 'Internal Server error'});
    }
}

export const updateProfile = async (req, res) => {
    
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;
       
        if(!profilePic) {
            return res.status(400).json({message: 'No profile picture provided'});
        }
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        if(!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error.message);
        res.status(500).json({ message: error.message || 'Internal Server error' });
    }
}

export const checkAuth = async (req, res) => {
    try {
        // const user = req.user;
        res.status(200).json(req.user);
    } catch (error) {
        console.error('Check auth error:', error.message);
        res.status(500).json({ message: error.message || 'Internal Server error' });
    }
}

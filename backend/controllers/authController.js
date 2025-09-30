const jwt = require('jsonwebtoken');
const User = require('../model/User');

// Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, avatar, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password, avatar, role });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || '',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
              avatar: user.avatar,  
            token: generateToken(user._id),
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            companyLogo: user.companyLogo || '',
            resume: user.resume || '',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get logged in user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

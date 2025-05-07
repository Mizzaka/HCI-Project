const User = require('../model/userModel');
const { generateToken } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');

const cookieOptions = {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000    //exp in 3d
}

const staffRegister = async (req, res) => {
    const { name, email, password, phone } = req.body;
    const convEmail = email.toLowerCase();
    const role = req.role;

    try {
        if (role !== 'admin') return res.status(401).json({ msg: 'Access denied' });

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }    

        const user = await User.findOne({ email: convEmail });
        if (user) return res.status(400).json({ msg: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email: convEmail,
            password: hash,
            phone: phone,
            role: 'staff'
        });

        if (newUser) {
            await newUser.save();
            res.status(201).json({ id: newUser._id });            
        } else {
            res.status(500).json({ msg: "Account creation failed" });
        }
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const cookies = req.cookies;
    const convEmail = email.toLowerCase();

    try {
        const user = await User.findOne({ email: convEmail });
        if (!user) return res.status(404).json({ msg: "Invalid credentials" });      
    
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ msg: "Invalid credentials" });      
    
        let token;
        
        if (cookies?.jwt) {
            try{
                jwt.verify(cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
                token = cookies.jwt;
            } catch (err) {
                token = generateToken(user._id, user.role);
                res.cookie("jwt", token, cookieOptions);
            }
        } else {
            token = generateToken(user._id, user.role);
            res.cookie("jwt", token, cookieOptions);
        } 
  
        res.status(200).json({ id: user._id, role: user.role });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

const logout = (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.status(401).json({ msg: 'No token' });

    res.clearCookie('jwt', {
        httpOnly: cookieOptions.httpOnly, 
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
    });
    res.status(200).json({ msg: 'logout success' });    
}

const checkAuth = async (req, res) => {
    const userid = req.userid;
    const role = req.role;

    try {
        res.status(200).json({ id: userid, role });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { staffRegister, login, logout, checkAuth };
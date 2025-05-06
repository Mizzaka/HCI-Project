const jwt = require('jsonwebtoken');

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });

const verifyJwt = (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) return res.status(401).json({ msg: "No token provided" });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if(err) return res.status(403).json({ msg: err.message });
            
            req.userid = data.id;
            req.role = data.role;
            next();
        })
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { generateToken, verifyJwt };
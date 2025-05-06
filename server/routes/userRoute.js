const express = require('express');
const router = express.Router();
const users = require('../controller/userController');
const { verifyJwt } = require('../middleware/authMiddleware');

router.post('/register', verifyJwt, users.staffRegister);
router.post('/login', users.login);
router.get('/logout', users.logout);
router.get("/check", verifyJwt, users.checkAuth);

module.exports = router;
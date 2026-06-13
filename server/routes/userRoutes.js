const express = require('express');
const router = express.Router();
const { 
  requestVerificationCode, 
  verifyCode,
  getUserById
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request-otp', requestVerificationCode);
router.post('/verify-otp', verifyCode);

router.get('/me', authMiddleware, getUserById); 

module.exports = router;
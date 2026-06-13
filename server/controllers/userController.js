const User = require('../models/userModel');
const { generateCode } = require('../utils/generateCode');
const { sendVerificationEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

exports.requestVerificationCode = async (req, res, next) => {
  try {
    const defaultEmail = 'kamdilichukwu2020@gmail.com';
    
    const user = await User.findOne({ email: defaultEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const code = generateCode(6); // Generate 6-digit code
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    user.verificationCode = {
      code,
      expiresAt,
      ipAddress: req.ip,
      timestamp: new Date()
    };

    await user.save();
    
    const emailSent = await sendVerificationEmail(defaultEmail, code);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(200).json({ 
      message: 'Please verify email: OTP sent to kamdi***@gmail.com' 
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const defaultEmail = 'kamdilichukwu2020@gmail.com';
    
    const user = await User.findOne({ email: defaultEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.verificationCode || 
        user.verificationCode.code !== code || 
        user.verificationCode.expiresAt < new Date() ||
        code.length !== 6) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update IP address and last login
    user.lastLogin = new Date();
    user.ipAddress = req.ip;
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      message: 'Verification successful',
      token,
      userInfo: {
        id: user._id,
        name: user.name,
        email: 'kamdi***@gmail.com',
        ipAddress: user.ipAddress,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select('-password -verificationCode'); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      userInfo: {
        id: user._id,
        name: user.name,
        email: user.email, 
        ipAddress: user.ipAddress,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};
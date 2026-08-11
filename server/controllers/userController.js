const User = require('../models/userModel');
const { generateCode } = require('../utils/generateCode');
const { sendVerificationEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

// Array of allowed emails
const allowedEmails = [
  'kamdilichukwu2020@gmail.com',
  'ofuanidonald20@gmail.com',
  'azamexico630@gmail.com'
];

exports.requestVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body; // Get email from request body
    
    // Check if email is in the allowed list
    if (!email || !allowedEmails.includes(email)) {
      return res.status(403).json({ 
        message: 'Unauthorized email. Only authorized users can request OTP.' 
      });
    }
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const code = generateCode(6);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationCode = {
      code,
      expiresAt,
      ipAddress: req.ip,
      timestamp: new Date()
    };

    await user.save();
    
    const emailSent = await sendVerificationEmail(email, code);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(200).json({ 
      message: `Please verify email: OTP sent to ${email}` 
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyCode = async (req, res, next) => {
  try {
    const { code, email } = req.body; // Get email from request body
    
    // Check if email is in the allowed list
    if (!email || !allowedEmails.includes(email)) {
      return res.status(403).json({ 
        message: 'Unauthorized email. Only authorized users can verify.' 
      });
    }
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.verificationCode || 
        user.verificationCode.code !== code || 
        user.verificationCode.expiresAt < new Date() ||
        code.length !== 6) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

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
        email: email,
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
    const user = await User.findById(userId).select('-password -verificationCode');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      userInfo: {
        id: user._id,
        name: user.name,
        email: user.email, // Use actual email from database
        ipAddress: user.ipAddress,
        lastLogin: user.lastLogin,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// Optional: Helper to add new email to allowed list
exports.addAllowedEmail = (email) => {
  if (!allowedEmails.includes(email)) {
    allowedEmails.push(email);
  }
};
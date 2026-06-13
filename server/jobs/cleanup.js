const User = require('../models/userModel');

const cleanupExpiredCodes = async () => {
  try {
    await User.updateMany(
      { 'verificationCode.expiresAt': { $lt: new Date() } },
      { $unset: { verificationCode: 1 } }
    );
    console.log('Expired verification codes cleaned up');
  } catch (error) {
    console.error('Cleanup job error:', error);
  }
};

module.exports = { cleanupExpiredCodes };
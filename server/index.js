require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Connect to MongoDB and create default user
const initializeApp = async () => {
  await connectDB();
  
  // Check if default user exists
  const defaultEmail = 'kamdilichukwu2020@gmail.com';
  let user = await User.findOne({ email: defaultEmail });
  
  if (!user) {
    user = new User({
      name: 'Kamdi', 
      email: defaultEmail,
      password: await bcrypt.hash('KAMDILIc1#', 10), 
      isVerified: true
    });
    await user.save();
    // console.log(`Default user created with email: ${defaultEmail}`);

    // Generate token for the default user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    // console.log(`JWT Token for default user: ${token}`);
  }
};


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 500,
//   message: "Too many requests, please try again after an hour"
// }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
initializeApp().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
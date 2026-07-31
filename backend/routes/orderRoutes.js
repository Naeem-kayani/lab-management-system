const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateStatus,
  assignStaff,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('patient'), createOrder);
router.get('/', protect, authorize('admin', 'staff'), getAllOrders);
router.get('/my', protect, authorize('patient'), getMyOrders);
router.put('/:id/status', protect, authorize('staff', 'admin'), updateStatus);
router.put('/:id/assign', protect, authorize('admin'), assignStaff);

module.exports = router;

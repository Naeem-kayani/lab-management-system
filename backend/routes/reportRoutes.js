const express = require('express');
const router = express.Router();
const { uploadReport, getReportByOrder } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('staff', 'admin'), upload.single('file'), uploadReport);
router.get('/:orderId', protect, getReportByOrder);

module.exports = router;

const express = require('express');
const router = express.Router();
const { uploadReport, getReportByOrder, getReportFile } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, authorize('staff', 'admin'), upload.single('file'), uploadReport);
router.get('/:orderId', protect, getReportByOrder);
router.get('/file/:id', getReportFile);

module.exports = router;

const Report = require('../models/Report');
const Order = require('../models/Order');

// @desc  Upload a report result (staff) - sets order status to Completed
// @route POST /api/reports
const uploadReport = async (req, res) => {
  try {
    const { orderId, resultValue } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const report = await Report.create({
      orderId,
      resultValue: resultValue || '',
      fileUrl,
      uploadedBy: req.user._id,
    });

    await Order.findByIdAndUpdate(orderId, { status: 'Completed' });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get a report by orderId
// @route GET /api/reports/:orderId
const getReportByOrder = async (req, res) => {
  try {
    const report = await Report.findOne({ orderId: req.params.orderId })
      .populate('uploadedBy', 'name')
      .populate({
        path: 'orderId',
        populate: [
          { path: 'patientId', select: 'name email' },
          { path: 'testId', select: 'name price category' },
        ],
      });

    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadReport, getReportByOrder };

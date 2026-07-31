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

    const report = await Report.create({
      orderId,
      resultValue: resultValue || '',
      fileData: req.file ? req.file.buffer : undefined,
      fileType: req.file ? req.file.mimetype : undefined,
      fileName: req.file ? req.file.originalname : undefined,
      uploadedBy: req.user._id,
    });
    
    // Set fileUrl to API endpoint for this file
    if (req.file) {
      report.fileUrl = `${req.protocol}://${req.get('host')}/api/reports/file/${report._id}`;
      await report.save();
    }

    await Order.findByIdAndUpdate(orderId, { status: 'Completed' });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get report file
// @route GET /api/reports/file/:id
const getReportFile = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || !report.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.set('Content-Type', report.fileType);
    res.send(report.fileData);
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

module.exports = { uploadReport, getReportByOrder, getReportFile };

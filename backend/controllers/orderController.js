const Order = require('../models/Order');

// @desc  Patient books a new test
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { testId, age, gender } = req.body;
    if (!testId || !age || !gender) {
      return res.status(400).json({ message: 'Please provide testId, age and gender' });
    }

    const order = await Order.create({
      patientId: req.user._id,
      testId,
      age,
      gender,
      status: 'Pending',
    });

    const populated = await order.populate('testId');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all orders (admin/staff view)
// @route GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .populate('patientId', 'name email')
      .populate('testId', 'name price category')
      .populate('staffId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged-in patient's own orders
// @route GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ patientId: req.user._id })
      .populate('testId', 'name price category')
      .populate('staffId', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update order status (staff/admin)
// @route PUT /api/orders/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Sample Collected', 'Processing', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patientId', 'name').populate('testId', 'name price category');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Assign staff member to an order (admin)
// @route PUT /api/orders/:id/assign
const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { staffId },
      { new: true }
    ).populate('staffId', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getMyOrders, updateStatus, assignStaff };

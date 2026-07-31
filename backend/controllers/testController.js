const Test = require('../models/Test');

// @desc  Get all tests
// @route GET /api/tests
const getTests = async (req, res) => {
  try {
    let tests = await Test.find().sort({ category: 1, name: 1 });
    
    // Auto-seed dummy tests if none exist (useful for Vercel edge cases)
    if (tests.length === 0) {
      await Test.insertMany([
        { name: 'Complete Blood Count (CBC)', price: 1500, category: 'Hematology' },
        { name: 'Lipid Profile', price: 2500, category: 'Biochemistry' },
        { name: 'Liver Function Test (LFT)', price: 1800, category: 'Biochemistry' },
        { name: 'Thyroid Profile', price: 3000, category: 'Endocrinology' },
        { name: 'Urine Routine Examination', price: 800, category: 'Pathology' }
      ]);
      tests = await Test.find().sort({ category: 1, name: 1 });
    }

    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a new test
// @route POST /api/tests
const createTest = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || price === undefined || !category) {
      return res.status(400).json({ message: 'Please provide name, price and category' });
    }
    const test = await Test.create({ name, price, category });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a test
// @route PUT /api/tests/:id
const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a test
// @route DELETE /api/tests/:id
const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTests, createTest, updateTest, deleteTest };

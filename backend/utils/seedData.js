const User = require('../models/User');
const Test = require('../models/Test');
const Order = require('../models/Order');
const Report = require('../models/Report');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return; // Already seeded
    }

    console.log('Seeding dummy data...');

    // 1. Create Users (1 Admin, 3 Staff, 6 Patients = 10 Users)
    const admin = await User.create({ name: 'System Admin', email: 'admin@medilab.com', password: 'admin123', role: 'admin' });
    
    const staff1 = await User.create({ name: 'Dr. Sarah', email: 'sarah@medilab.com', password: 'password123', role: 'staff' });
    const staff2 = await User.create({ name: 'Dr. John', email: 'john@medilab.com', password: 'password123', role: 'staff' });
    const staff3 = await User.create({ name: 'Nurse Emily', email: 'emily@medilab.com', password: 'password123', role: 'staff' });

    const patients = [];
    for (let i = 1; i <= 6; i++) {
      const patient = await User.create({
        name: `Patient ${i}`,
        email: `patient${i}@test.com`,
        password: 'password123',
        role: 'patient'
      });
      patients.push(patient);
    }

    // 2. Create Tests
    const tests = await Test.insertMany([
      { name: 'Complete Blood Count (CBC)', price: 1500, category: 'Hematology' },
      { name: 'Lipid Profile', price: 2500, category: 'Biochemistry' },
      { name: 'Liver Function Test (LFT)', price: 1800, category: 'Biochemistry' },
      { name: 'Thyroid Profile', price: 3000, category: 'Endocrinology' },
      { name: 'Urine Routine Examination', price: 800, category: 'Pathology' }
    ]);

    // 3. Create Orders (Samples)
    // Order 1: Pending
    await Order.create({
      patientId: patients[0]._id,
      testId: tests[0]._id,
      age: 25,
      gender: 'Male',
      status: 'Pending'
    });

    // Order 2: Sample Collected
    await Order.create({
      patientId: patients[1]._id,
      testId: tests[1]._id,
      staffId: staff1._id,
      age: 34,
      gender: 'Female',
      status: 'Sample Collected'
    });

    // Order 3: Processing
    await Order.create({
      patientId: patients[2]._id,
      testId: tests[2]._id,
      staffId: staff2._id,
      age: 45,
      gender: 'Male',
      status: 'Processing'
    });

    // Order 4: Completed with Report
    const completedOrder1 = await Order.create({
      patientId: patients[3]._id,
      testId: tests[3]._id,
      staffId: staff1._id,
      age: 28,
      gender: 'Female',
      status: 'Completed'
    });

    await Report.create({
      orderId: completedOrder1._id,
      resultValue: 'Normal range observed. Cholesterol: 180 mg/dL.',
      uploadedBy: staff1._id
    });

    // Order 5: Completed with Report
    const completedOrder2 = await Order.create({
      patientId: patients[4]._id,
      testId: tests[4]._id,
      staffId: staff3._id,
      age: 60,
      gender: 'Male',
      status: 'Completed'
    });

    await Report.create({
      orderId: completedOrder2._id,
      resultValue: 'Slightly elevated WBC count. Needs further review.',
      uploadedBy: staff3._id
    });

    console.log('Dummy data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;

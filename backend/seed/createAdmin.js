// Run this once to create the first Admin account:
//   node seed/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  await connectDB();

  const email = 'admin@medilab.com';
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  await User.create({
    name: 'System Admin',
    email,
    password: 'admin123',
    role: 'admin',
  });

  console.log('Admin created!');
  console.log('Email:    admin@medilab.com');
  console.log('Password: admin123');
  process.exit(0);
};

run();

const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- Creation JWT ---
const createToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// --- Register a new admin ---
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Checking if an admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this username already exists' });
    }

    // Creating a new admin
    const newAdmin = await Admin.create({
      username,
      password,
      role: 'admin',
    });

    const token = createToken(newAdmin._id, newAdmin.role);

    res.status(201).json({
      token,
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Admin login ---
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).select('+password');
    if (!admin || !(await admin.correctPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(admin._id, admin.role);

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Get data about yourself ---
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({
      id: admin._id,
      username: admin.username,
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');

const Admin = require('../models/Admin');
const Score = require('../models/Score');
const errorHandler = require('../middlewares/errorHandler');
const validateAdmin = require('../middlewares/validateAdmin');
const validateScore = require('../middlewares/validateScore');
const adminAuth = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

// Register admin
router.post(
  '/register',
  [
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 chars'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  validateAdmin,
  adminController.register
);

// Admin login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateAdmin,
  adminController.login
);

// Get admin profile
router.get('/me', adminAuth, adminController.getMe);

// Edit scores (admin only)
router.put(
  '/scores/:id',
  [
    param('id').isMongoId().withMessage('Invalid score ID'),
  ],
  adminAuth,
  validateScore,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedScore = await Score.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedScore) {
        return res.status(404).json({ message: 'Score not found' });
      }

      res.json({ message: 'Score updated', updatedScore });
    } catch (err) {
      next(err);
    }
  }
);

// Delete score (admin only)
router.delete(
  '/scores/:id',
  [param('id').isMongoId().withMessage('Invalid score ID')],
  adminAuth,
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const deleted = await Score.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Score not found' });
      }

      res.json({ message: 'Score deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// Error handler middleware
router.use(errorHandler);

module.exports = router;
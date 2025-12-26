/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin endpoints
 */

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

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Validation error
 */
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

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 */
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

/**
 * @swagger
 * /api/admin/me:
 *   get:
 *     summary: Get admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile
 */
// Get admin profile
router.get('/me', adminAuth, adminController.getMe);

/**
 * @swagger
 * /api/admin/scores/{id}:
 *   put:
 *     summary: Update score (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Score updated
 */
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

/**
 * @swagger
 * /api/admin/scores/{id}:
 *   delete:
 *     summary: Delete score (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 65c123abc456def789012345
 *     responses:
 *       200:
 *         description: Score deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Score not found
 */
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
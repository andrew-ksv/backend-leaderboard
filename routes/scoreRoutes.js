/**
 * @swagger
 * tags:
 *   name: Scores
 *   description: Scores endpoints
 */

const express = require('express');
const router = express.Router();

const Score = require('../models/Score');
const validateScore = require('../middlewares/validateScore');

/**
 * @swagger
 * /api/scores:
 *   get:
 *     summary: Get all scores
 *     tags: [Scores]
 *     responses:
 *       200:
 *         description: List of scores
 */
// Get all results
router.get('/', async (req, res, next) => {
  try {
    const scores = await Score.find().sort({ score: -1, time: 1 }); 
    res.json(scores);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/scores:
 *   post:
 *     summary: Create new score
 *     tags: [Scores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - score
 *               - time
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: Player1
 *               score:
 *                 type: number
 *                 example: 120
 *               time:
 *                 type: string
 *                 example: "02:34"
 *     responses:
 *       201:
 *         description: Score created
 */
// Add new result
router.post('/', validateScore, async (req, res, next) => {
  try {
    const { nickname, score, time } = req.body;

    const newScore = new Score({
      nickname,
      score,
      time
    });

    await newScore.save();
    res.status(201).json(newScore);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/scores/top10:
 *   get:
 *     summary: Get top 10 scores
 *     tags: [Scores]
 *     responses:
 *       200:
 *         description: Top 10 scores
 */
// Get TOP-10 results
router.get('/top10', async (req, res, next) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1, time: 1 })
      .limit(10);

    res.json(scores);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

const Score = require('../models/Score');
const validateScore = require('../middlewares/validateScore');

// Get all results
router.get('/', async (req, res, next) => {
  try {
    const scores = await Score.find().sort({ score: -1, time: 1 }); 
    res.json(scores);
  } catch (err) {
    next(err);
  }
});

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
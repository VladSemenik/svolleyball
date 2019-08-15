const express = require('express');
const Game = require('./Game');

const router = express.Router();

router.use('/game', Game);

module.exports = router;
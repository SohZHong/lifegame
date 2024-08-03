const express = require('express');
const router = express.Router();


router.get('/rollDice', (req, res) => {
    const rollDice = () => Math.floor(Math.random() * 6) + 1;
    const diceResult = rollDice();
    res.json({ result: diceResult });
});

module.exports = router;

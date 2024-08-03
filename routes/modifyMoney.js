const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/modifyMoney/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const query = 'SELECT total_money FROM Wallet WHERE player_id = ?';

  db.query(query, [playerId], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).send('Player not found');
    }
    const totalMoney = results[0].total_money;
    res.render('modifyMoney', { playerId: playerId, totalMoney: totalMoney });
  });
});

router.post('/updateMoney', (req, res) => {
  const playerId = req.body.playerId;
  const amount = parseFloat(req.body.amount);
  const operation = req.body.operation;
  let query, values;

  if (operation === 'add') {
    query = 'UPDATE Wallet SET total_money = total_money + ? WHERE player_id = ?';
    values = [amount, playerId];
  } else if (operation === 'subtract') {
    query = 'UPDATE Wallet SET total_money = total_money - ? WHERE player_id = ?';
    values = [amount, playerId];
  }

  if (operation === 'complete') {
    return res.redirect(`/`);
  }

  db.query(query, values, (err, result) => {
    if (err) throw err;
    res.redirect(`/modifyMoney/${playerId}`);
  });
});

module.exports = router;

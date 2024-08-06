const express = require('express');
const router = express.Router();

module.exports = (db) => {
  const updateSessionData = (req, playerId, newAmount) => {
    if (!req.session.playerData) return;
    req.session.playerData = req.session.playerData.map(player => {
      if (player.playerId == playerId) {
        player.totalMoney = newAmount;
        console.log(playerId);
      }
      return player;
    });
  };

  router.get('/modifyMoney/:playerId', (req, res) => {
    const playerId = req.params.playerId;
    const query = 'SELECT total_money FROM Wallet WHERE player_id = ?';

    db.query(query, [playerId], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(404).send('Player not found');
      }
      const totalMoney = results[0].total_money;
      updateSessionData(req, playerId, totalMoney);
      res.render('modifyMoney', { playerId, totalMoney });
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
    } else if (operation === 'complete') {
      return res.redirect(`/modifyMoney/${playerId}`);
    }

    db.query(query, values, (err, result) => {
      if (err) throw err;
      // Fetch the updated amount from the database after the operation
      const newQuery = 'SELECT total_money FROM Wallet WHERE player_id = ?';
      db.query(newQuery, [playerId], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
          return res.status(404).send('Player not found');
        }
        const newAmount = results[0].total_money;
        updateSessionData(req, playerId, newAmount);
        res.redirect(`/modifyMoney/${playerId}`);
      });
    });
  });

  router.get('/gameDetails/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    // Assuming you fetch game and player data from the database here
    // For simplicity, let's assume playerData is available in session

    if (!req.session.playerData) {
      return res.status(404).send('Player data not found');
    }

    res.render('gameDetails', {
      gameId,
      playerData: req.session.playerData,
    });
  });

  return router;
};

const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/game/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const query = `
    SELECT p.player_id, p.player_name, w.total_money, g.player1, g.player2, g.player3, g.player4
    FROM Game g
    JOIN Player p ON g.player1 = p.player_id OR g.player2 = p.player_id OR g.player3 = p.player_id OR g.player4 = p.player_id
    JOIN Wallet w ON p.player_id = w.player_id
    WHERE g.game_id = ?
  `;

  db.query(query, [gameId], (err, results) => {
    if (err) throw err;
    const players = results.map(row => ({
      playerId: row.player_id,
      playerName: row.player_name,
      totalMoney: row.total_money,
      playerSlot: row.player1 === row.player_id ? 'Player 1' :
                  row.player2 === row.player_id ? 'Player 2' :
                  row.player3 === row.player_id ? 'Player 3' : 'Player 4'
    }));
    res.render('playerDetails', { gameId: gameId, players: players });
  });
});


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
    return res.redirect(`/game/${req.body.gameId}`);
  }

  db.query(query, values, (err, result) => {
    if (err) throw err;
    res.redirect(`/modifyMoney/${playerId}`);
  });
});

router.get('/endGame/:gameId', (req, res) => {
  const gameId = req.params.gameId;
  const query = `
    SELECT p.player_id, p.player_name, w.total_money
    FROM Game g
    JOIN Player p ON g.player1 = p.player_id OR g.player2 = p.player_id OR g.player3 = p.player_id OR g.player4 = p.player_id
    JOIN Wallet w ON p.player_id = w.player_id
    WHERE g.game_id = ?
    ORDER BY w.total_money DESC
    LIMIT 1
  `;

  db.query(query, [gameId], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).send('No players found');
    }
    const winner = results[0];
    res.render('congratulations', {
      winnerName: winner.player_name,
      winnerId: winner.player_id,
      totalMoney: winner.total_money
    });
  });
});

module.exports = router;

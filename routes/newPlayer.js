const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post('/addPlayer', (req, res) => {
    const playerCount = parseInt(req.body.plyNo, 10);
    if (playerCount >= 2 && playerCount <= 4) {
      res.render('addPlayers', { playersCount: playerCount });
    } else {
      res.send('Please enter a valid number of players (2-4).');
    }
  });
  
  router.post('/submitPlayers', (req, res) => {
    const players = [
      req.body.p1,
      req.body.p2,
      req.body.p3,
      req.body.p4,
    ].filter(Boolean);
  
    const placeholders = players.map(() => '(?)').join(',');
    const insertPlayersQuery = `INSERT INTO Player (player_name) VALUES ${placeholders}`;
  
    db.query(insertPlayersQuery, players, (err) => {
      if (err) {
        return res.send(`Error inserting players: ${err.message}`);
      }
  
      db.query('SELECT player_id, player_name FROM Player ORDER BY player_id DESC LIMIT ?', [players.length], (err, results) => {
        if (err) {
          return res.send(`Error retrieving player IDs: ${err.message}`);
        }
        
        const playerData = results;
        const playerIds = playerData.map(row => row.player_id);
        const gameQuery = `INSERT INTO Game (player1, player2, player3, player4) VALUES (?, ?, ?, ?)`;
        const gameValues = playerIds.concat(new Array(4 - playerIds.length).fill(null));
  
        db.query(gameQuery, gameValues, (err, results) => {
          if (err) {
            return res.send(`Error inserting game: ${err.message}`);
          }
  
          const newGameId = results.insertId;
  
          const walletQuery = `INSERT INTO Wallet (player_id, total_money) VALUES ${playerIds.map(() => '(?, 0)').join(',')}`;
          const walletValues = playerIds.flatMap(id => [id]);
  
          db.query(walletQuery, walletValues, (err) => {
            if (err) {
              return res.send(`Error creating wallets: ${err.message}`);
            }
  
            res.render('startQuiz', {
              gameId: newGameId,
              players: playerData
            });
          });
        });
      });
    });
  });

  return router;
}

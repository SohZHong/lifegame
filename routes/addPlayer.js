const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post('/addPlayer', (req, res) => {
    // End Previous session upon new game
    req.session.playerData = null;
    
    const playerCount = parseInt(req.body.plyNo, 10);
    if (playerCount >= 2 && playerCount <= 4) {
      req.session.playerCount = playerCount;
      res.render('addPlayer', { playersCount: playerCount });
    } else {
      res.send('Please enter a valid number of players (2-4).');
    }
  });
  
  router.post('/submitPlayers', (req, res) => {
    const players = [
      req.body.ply1,
      req.body.ply2,
      req.body.ply3,
      req.body.ply4,
    ].filter(Boolean);
    // Check if players exist (If first player exist then others do too)
    if (!req.session.playerData){
      const placeholders = players.map(() => '(?)').join(',');
      const insertPlayersQuery = `INSERT INTO Player (player_name) VALUES ${placeholders}`;
    
      db.query(insertPlayersQuery, players, (err) => {
        if (err) {
          return res.send(`Error inserting players: ${err.message}`);
        }
    
        // Retrieve player IDs in the order they were inserted
        db.query('SELECT player_id, player_name FROM Player ORDER BY player_id DESC LIMIT ?', [players.length], (err, results) => {
          if (err) {
            return res.send(`Error retrieving player IDs: ${err.message}`);
          }
          
          const playerData = results;
          const playerIds = playerData.map(row => row.player_id);
          
          // Make sure the playerIds array is filled up to 4 elements
          const gameQuery = `INSERT INTO Game (player1, player2, player3, player4) VALUES (?, ?, ?, ?)`;
          const gameValues = playerIds.concat(new Array(4 - playerIds.length).fill(null));
    
          db.query(gameQuery, gameValues, (err, results) => {
            if (err) {
              return res.send(`Error inserting game: ${err.message}`);
            }
            const gameId = results.insertId;
            const walletQuery = `INSERT INTO Wallet (player_id, total_money) VALUES ${playerIds.map(() => '(?, 2000)').join(',')}`;
            const walletValues = playerIds.flatMap(id => [id]);
    
            db.query(walletQuery, walletValues, (err) => {
              if (err) {
                return res.send(`Error creating wallets: ${err.message}`);
              }
    
              const playerSlotData = playerIds.map((id, index) => ({
                playerId: id,
                playerName: playerData[index].player_name,
                totalMoney: 2000,
                playerSlot: `Player ${index + 1}`
              }));

              // Assinging Session to prevent duplicate operations
              req.session.playerData = playerSlotData;
              req.session.gameId = gameId;
              res.render('startQuiz');
            });
          });
        });
      });
    } else {
      res.redirect('startQuiz');
    }
  });

  return router;
}

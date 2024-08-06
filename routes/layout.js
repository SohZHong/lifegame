const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get('/layout', (req, res) => {
    if (!req.session.gameId) {
      return res.status(400).send('No game session found.');
    }
    // Query to fetch wallet data for the current game
    const query = `
      SELECT p.player_name AS playerName, w.total_money AS totalMoney, 
             CASE 
               WHEN g.player1 = p.player_id THEN 'Player 1'
               WHEN g.player2 = p.player_id THEN 'Player 2'
               WHEN g.player3 = p.player_id THEN 'Player 3'
               WHEN g.player4 = p.player_id THEN 'Player 4'
             END AS playerSlot
      FROM Wallet w
      JOIN Player p ON w.player_id = p.player_id
      JOIN Game g ON p.player_id IN (g.player1, g.player2, g.player3, g.player4)
      WHERE g.game_id = ?`;

    db.query(query, [req.session.gameId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching data.');
      }

      // Prepare data to pass to Pug template
      const playerData = results;
      const hide = playerData.length === 0; // Optionally hide elements if no players

      res.render('layout', {
        playerData,
        hide,
        gameId: req.session.gameId
      });
    });
  });

  return router;
};

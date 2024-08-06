const express = require('express');
const router = express.Router();

module.exports = (db) => {
    
  router.get('/endGame', (req, res) => {
    const gameId = req.session.gameId;
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
      // End Session
      req.session.playerData = null;
      req.session.gameId = null;
      res.render('endGame', {
        winnerName: winner.player_name,
        winnerId: winner.player_id,
        totalMoney: winner.total_money
      });
    });
  });
  
  return router;
}

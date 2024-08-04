const express = require('express');
const router = express.Router();

module.exports = (db, checkLoggedIn) => {
  router.post('/deleteQuiz', (req, res) => {
    const question_id = req.body.deleteQuiz;
    const delete_query = 'DELETE FROM Question_Bank WHERE question_id = ?';
    db.query(delete_query, [question_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting question' });
        return;
      }
      res.json({ message: 'Question deleted successfully' });
    });
  });

  router.get('/questions', (req, res) => {
    const query = 'SELECT * FROM Question_Bank';
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching questions' });
        return;
      }
      res.json(results);
    });
  });

  return router;
};

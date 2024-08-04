const express = require('express');
const router = express.Router();

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = (db) => {
  router.post('/startQuiz', (req, res) => {
    const query = 'SELECT * FROM Question_Bank ORDER BY RAND() LIMIT 1'; // Fetch only one random question
    db.query(query, (err, results) => {
      if (err) throw err;
      req.session.question = results[0]; // Store the single question
      req.session.answers = [];
      res.redirect('/quiz');
    });
  });

  router.get('/quiz', (req, res) => {
    if (!req.session.question) {
      return res.redirect('/startQuiz');
    }

    let question = req.session.question;

    const answers = shuffle([
      { text: question.correct_ans, isCorrect: true },
      { text: question.incorrect_ans1, isCorrect: false },
      { text: question.incorrect_ans2, isCorrect: false },
      { text: question.incorrect_ans3, isCorrect: false }
    ]);

    res.render('quiz', { question: question, answers: answers });
  });

  router.post('/submitAnswer', (req, res) => {
    const isCorrect = req.body.isCorrect === 'true';
    console.log(`Submitted answer isCorrect: ${isCorrect}`); 

    if (isCorrect) {
      req.session.answers.push({ isCorrect: isCorrect });
      req.session.question = null;
      return res.redirect('/result');
    } else {
      req.session.question = null;
      return res.redirect('/incorrectAttempt');
    }
  });

  router.get('/incorrectAttempt', (req, res) => {
    res.render('incorrectAttempt'); 
  });

  router.get('/result', (req, res) => {
    const isCorrectAttempt = req.session.answers.length === 1 && req.session.answers[0].isCorrect;
    console.log(`Result page: isCorrectAttempt = ${isCorrectAttempt}`);
    res.render('result', { isCorrect: isCorrectAttempt });
  });

  return router;
};

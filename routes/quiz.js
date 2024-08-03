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
    const query = 'SELECT * FROM Question_Bank ORDER BY RAND()';
    db.query(query, (err, results) => {
      if (err) throw err;
      req.session.questions = results;
      req.session.currentQuestionIndex = 0;
      req.session.answers = [];
      res.redirect('/quiz');
    });
  });
  
  
  router.get('/quiz', (req, res) => {
    if (req.session.currentQuestionIndex >= req.session.questions.length) {
      return res.redirect('/result');
    }
  
    let question = req.session.questions[req.session.currentQuestionIndex];
  
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
    const question_id = req.body.question_id;
  
    if (isCorrect) {
      req.session.answers.push({ question_id: question_id, isCorrect: isCorrect });
      req.session.currentQuestionIndex++;
    }
  
    res.redirect('/quiz');
  });
  
  router.get('/', (req, res) => {
    const allCorrect = req.session.answers.length === req.session.questions.length && 
                        req.session.answers.every(answer => answer.isCorrect);
  
    res.render('result', { rewardMoney: allCorrect ? 1000 : 0 });
  });

  return router;
}

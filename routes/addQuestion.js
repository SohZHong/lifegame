const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/addQuestion', (req, res) => {
        res.render('addQuestion');
    });
    router.post('/addQues', (req, res) => {
        const {ques, ans1, ans2, ans3, ans4} = req.body;
        const query = 'INSERT INTO question_bank (question, correct_ans, incorrect_ans1, incorrect_ans2, incorrect_ans3) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [ques, ans1, ans2, ans3, ans4], (err, results) => {
            if (err) throw err;
            res.redirect('/viewQuestion');
        });
    });
    return router;
};


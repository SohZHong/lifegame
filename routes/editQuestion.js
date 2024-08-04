const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/editQuestion', (req, res) => {
        res.render('editQuestion')
    });
    router.post('/submitQues', (req, res) => {
        const {question, cAns, wAns1, wAns2, wAns3, questionID} = req.body;
        const query = 'UPDATE Question_Bank SET question = ?, correct_ans = ?, incorrect_ans1 = ?, incorrect_ans2 = ?, incorrect_ans3 = ? WHERE question_id = ?;';
        db.query(query, [question, cAns, wAns1, wAns2, wAns3, questionID], (err, results) => {
            if (err) throw err;
            res.redirect('/viewQuestion');
        });
    });
    return router;
};


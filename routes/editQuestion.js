const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/editQuestion', (req, res) => {
        res.render('editQuestion', { 'id': req.query.questionid})
    });
    router.post('/submitQues', (req, res) => {
        const {ques, quesId, ans1, ans2, ans3, ans4} = req.body;
        const query = 'UPDATE question_bank SET question = ?, correct_ans = ?, incorrect_ans1 = ?, incorrect_ans2 = ?, incorrect_ans3 = ? WHERE question_id = ?;';
        db.query(query, [ques, ans1, ans2, ans3, ans4, quesId], (err, results) => {
            if (err) throw err;
            res.redirect('/viewQuestion');
        });
    });
    return router;
};

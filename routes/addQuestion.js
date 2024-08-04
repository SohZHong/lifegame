const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/addQuestion', (req, res) => {
        res.render('addQuestion');
    });
    router.post('/addQues', (req, res) => {
        const {question, cAns, wAns1, wAns2, wAns3, adminid } = req.body;
        const query = 'INSERT INTO Question_Bank (question, correct_ans, incorrect_ans1, incorrect_ans2, incorrect_ans3, admin_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [question, cAns, wAns1, wAns2, wAns3, adminid], (err, results) => {
            if (err) throw err;
            res.redirect('/viewQuestion');
        });
    });
    return router;
};


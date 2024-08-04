const express = require('express');
const router = express.Router();

module.exports = (db) => {

    router.get('/login', (req, res) => {
        const error = req.session.error;
        req.session.error = null; // Clear the error message
        res.render('login', {
            error
        });
    });

    router.post('/login', (req, res) => {
        const { user_name, user_password } = req.body;
        if (user_name && user_password) {
            db.query('SELECT * FROM Admin WHERE admin_name = ? AND password = ?', 
            [user_name, user_password], (error, results, fields) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    // Assign id from the DB to session
                    req.session.user_id = results[0].id;
                    // Assign user_name from the DB to session
                    req.session.user_name = results[0].admin_name;
                    res.redirect('/todolist');
                } else {
                    res.render('login', {
                        error: 'Incorrect Name and/or Password!'
                    });
                }
                res.end();
            });
        } else {
            res.render('login', {
                error: 'Please enter Username and Password!'
            });
            res.end();
        }
    });

    router.get('/logout', (req, res) => {
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/login');
                }
            });
        }
    });

    return router;
};

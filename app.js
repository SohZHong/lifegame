var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lifegame',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});


const qRoutes = require('./routes/viewQuestion')(db);
const diceRoute = require('./routes/dice');


app.use('/', qRoutes);
app.use('/', diceRoute);


// const Routes = require('./routes/');
// app.use( Routes);
// const pNameRoutes = require('./routes/playerName')(db);
// app.use(pNameRoutes);
// const quizRoutes = require('./routes/quiz');
// app.use('/quiz', quizRoutes(db)); // Pass the `db` object to the route handler
const quizRoutes = require('./routes/quiz');
app.use('/quiz', quizRoutes(db));

// const quizRoutes = require('./routes/quiz')(db);
// app.use(quizRoutes);
const moneyRoutes = require('./routes/modifyMoney')(db);
app.use( moneyRoutes);
const addQRoutes = require('./routes/addQuestion')(db);
app.use( addQRoutes);
const editQRoutes = require('./routes/editQuestion')(db);
app.use( editQRoutes);
const viewQRoutes = require('./routes/viewQuestion')(db);
app.use( viewQRoutes);
const addPlayerRoutes = require('./routes/addPlayer')(db);
app.use('/', addPlayerRoutes);

app.get('/homePage', (req, res) => {
  res.render('homePage');
});
app.get('/playerNo', (req, res) => {
  res.render('playerNo');
});
// app.get('/playerName', (req, res) => {
//   res.render('playerName');
// });
app.get('/result', (req, res) => {
  res.render('result');
});
app.get('/endGame', (req, res) => {
  res.render('endGame');
});
app.get('/startQuiz', (req, res) => {
  res.render('startQuiz');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

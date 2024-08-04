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
const session = require('express-session');



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

// const session = require('express-session');
app.use(session({
secret: 'lifegame',
resave: true,
saveUninitialized: true
}));

app.use(session({ secret: 'lifegame', resave: true, saveUninitialized: true }));

const viewQRoutes = require('./routes/viewQuestion')(db, checkLoggedIn);
app.use( viewQRoutes);
const diceRoute = require('./routes/dice');
app.use('/', diceRoute);
const loginRoutes = require('./routes/login');
app.use(loginRoutes);
// const Routes = require('./routes/');
// app.use( Routes);
const quizRoutes = require('./routes/quiz');
app.use(quizRoutes(db));
const moneyRoutes = require('./routes/modifyMoney')(db);
app.use( moneyRoutes);
const addQRoutes = require('./routes/addQuestion')(db);
app.use( addQRoutes);
const editQRoutes = require('./routes/editQuestion')(db);
app.use( editQRoutes);


const addPlayerRoutes = require('./routes/addPlayer')(db);
app.use('/', addPlayerRoutes);

app.get('/homePage', (req, res) => {
  res.render('homePage');
});
app.get('/playerNo', (req, res) => {
  res.render('playerNo');
});
app.get('/test', (req, res) => {
  res.render('test');
});
app.get('/viewQuestion', (req, res) => {
  res.render('viewQuestion');
});
// app.get('/addQuestion', (req, res) => {
//   res.render('addQuestion');
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
app.get('/dice', (req, res) => {
  res.render('dice');
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

function checkLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.session.error = 'Please Login!';
    res.redirect('/login');
  }
}

module.exports = app;

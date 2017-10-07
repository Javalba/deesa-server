const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport   = require('./config/passport');
const cors = require('cors')();

const index = require('./routes/index');
const phones = require('./routes/phones');
const auth = require('./routes/auth');

require("dotenv").config();


if ( process.env.NODE_ENV === 'development' ) {
	mongoose.connect(process.env.DATABASE);
} else {
	mongoose.connect(process.env.DATABASE);
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to ${process.env.DATABASE} database`) );

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// var corsOptions = {
//   origin: 'http://localhost:4200',
  
// }
app.use(cors);
app.options('*', cors);
// uncomment after placing your favicon in /public
// app.use(function (req, res, next) {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  // next();
// });


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/', auth);
app.use('/api', passport.authenticate('jwt', { session: false }), phones);
// app.use('/api', phones);

app.use(function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

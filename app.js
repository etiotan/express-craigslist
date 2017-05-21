var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); //makes data avail for request.body
var mongoose = require('mongoose')
var session = require('client-sessions')
var csrf = require('csurf')


var index = require('./routes/index');
var signup = require('./routes/signup');
var login = require('./routes/login');
var dashboard = require('./routes/dashboard')


mongoose.connect('mongodb://localhost/newauth')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'asdfasfasd12312',
  duration: 30*60*1000, //how long before logged out
  activeDuration: 5*60*1000
}))
app.use(csrf()) //must be after pasrser and session
app.use('/', index);
app.use('/signup', signup)
app.use('/login', login)
app.use('/dashboard', dashboard)


app.get('/logout', function(req, res){
  req.session.reset();
  res.redirect('/');
})


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
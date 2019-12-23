global.logger = require('./helpers/logger');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var base64ToImage = require('base64-to-image');
const mysql = require('mysql');
const db = require('./helpers/mysqlservices.js');
require('dotenv').config();

var index = require('./routes/index');
var authorize = require('./routes/authorize');
var mail = require('./routes/mail');
var calendar = require('./routes/calendar');
var contacts = require('./routes/contacts');
var composeMessage = require('./routes/composeMessage');
var replyMessage = require('./routes/replyMessage');
var getAttachment = require('./routes/getAttachment');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(morganLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/authorize', authorize);
app.use('/mail', mail);
app.use('/calendar', calendar);
app.use('/contacts', contacts);
app.use('/composeMessage', composeMessage);
app.use('/replyMessage', replyMessage);
app.use('/getAttachment', getAttachment);


logger.log('Asad is ======>>>','23 ','<=========years old')
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
app.listen(3000,()=>{
  console.log('Server Listening at 3000');
});

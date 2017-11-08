var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/// 追加
var mongoose = require('mongoose')
var restify = require('express-restify-mongoose')
///

var app = express();

/// 追加
var router = express.Router();
///

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/// 追加
mongoose.connect('mongodb://localhost/app1',{useMongoClient:true});
restify.serve(router, mongoose.model('Post', new mongoose.Schema({
  name: { type: String },
  kakikomi: { type: String }
})));
app.use(router);
/// 

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

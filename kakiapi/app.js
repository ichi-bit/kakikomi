var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var restify = require('express-restify-mongoose');

var app = express();
var router = express.Router();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/app1',{useMongoClient:true});
restify.serve(router, mongoose.model('Post', new mongoose.Schema({
  name: { type: String },
  kakikomi: { type: String },
  filename: {type: String}
})));
app.use(router);

/////////////////////////
///  追加
/////////////////////////
var path = require('path');  // ファイルの拡張子を取得するのに使う
var multer  = require('multer');
// 格納場所と新しくつけるファイル名の定義
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage });
// ルーティング
app.post('/api/upload', upload.single('image'), function (req, res, next) {
  delete req.file.buffer; // responseには入れない
  res.json(req.file); // 取得した情報を返す
});
/////

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
  res.send({error:'error'});
});

module.exports = app;

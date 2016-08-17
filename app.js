var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('./models/redis.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//扔一个漂流瓶
// POST owner=xxx&type=xxx&content=xxx[&time=xxx]
app.post('/',function(req,res){
  if (!(req.body.owner && req.body.type && req.body.content)) {
    return res.json({code:0,msg:"信息不完整"});
  }
  if (req.body.type && (["male","female"].indexOf(req.body.type) === -1)) {
    return res.json({code:0,msg:"类型错误"});
  }
  redis.throw(req.body,function(result){
    res.json(result);
  });
});
//捡一个漂流瓶
// GET /?user=xxx[&type=xxx]
app.get('/',function(req,res){
    if (!req.query.user) {
      return res.json({code:0,msg:"信息不完整"});
    }
    if (req.query.type && (["male","female"].indexOf(req.query.type) === -1)) {
      return res.json({code:0,msg:"类型错误"});
    }
    redis.pick(req.query,function(result){
      res.json(result);
    });
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

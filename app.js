var express = require('express');
var on_death = require('death'); //this is intentionally ugly 
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sensors = require('./controllers/sensors.js');
var index = require('./routes/index');
var settings = require('./routes/settings');
var thresholds = require('./routes/thresholds');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/settings', settings);
app.use('/thresholds', thresholds);

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

try {
    sensors.init_rpio();
    sensors.open_pins();
    console.log("initialised pins successfully! :)");
} catch(e) {
    console.log("initialising pins failed... ", e);
}


//cleanup before stopping the server 
on_death(function(signal, err) {
    console.log("closing pins...");
    sensors.cleanup();
});

module.exports = app;

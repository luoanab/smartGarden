var express = require('express');
var router = express.Router();
var sensors = require('../controllers/sensors.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Smart garden' });
});

/* GET home page. */
router.get('/sensors', function(req, res, next) {
  var values = sensors.read_sensor_values();
  res.send(values);
});

module.exports = router;

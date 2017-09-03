var express = require('express');
var router = express.Router();
var sensors = require('../controllers/sensors.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Smart garden' });
});

/* GET sensors values */
router.get('/sensors', function(req, res, next) {
  res.send(sensors.read_sensor_values());
});

module.exports = router;

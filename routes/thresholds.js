var express = require('express');
var router = express.Router();
var sensors = require('../controllers/sensors.js')

/* GET thresholds page. */
router.get('/', function(req, res, next) {
  return res.render('thresholds', { title: 'Smart garden' });
});

module.exports = router;

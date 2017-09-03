var express = require('express');
var router = express.Router();
var sensors = require('../controllers/sensors.js')

/* GET thresholds page. */
router.get('/thresholds', function(req, res, next) {
  res.render('thresholds', { title: 'Smart garden' });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var sensors = require('../controllers/sensors.js')

/* GET settings page. */
router.get('/settings', function(req, res, next) {
  res.render('settings', { title: 'Smart garden' });
});

module.exports = router;

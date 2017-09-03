var express = require('express');
var router = express.Router();
var sensors = require('../controllers/sensors.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Smart garden' });
});

module.exports = router;

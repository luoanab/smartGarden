var express = require('express');
var router = express.Router();
var sensors = require('../controllers/sensors.js')

/* GET sensors values */
router.get('/', function(req, res, next) {
  return res.json(sensors.read_sensor_values());
});

router.get('/operation', function(req, res, next){
    sensors.get_operation_mode(null, function(err, response) {
        if (err) {
            return res.json({
                success: false,
                error: err
            })
        }
        return res.json({
            success: true,
            data: response
        })
    })
})

router.put('/operation', function(req, res, next){
    sensors.set_operation_mode({
        mode: 'MANUAL'
    }, function (err, response){
        if (err) {
            return res.json({
                success: false,
                error: err
            });
        }
        return res.json({
            success: true
        });
    })
})

module.exports = router;
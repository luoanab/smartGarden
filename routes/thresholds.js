var express = require('express');
var router = express.Router();
var thresholds = require('../controllers/thresholds.js')

/* GET thresholds values */
router.get('/all', function(req, res, next) {
    thresholds.getThresholds(null, function(err, response) {
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
});

/* GET thresholds values */
router.get('/:id', function(req, res, next) {
    thresholds.getThreshold({
        id: req.params.id
    }, function(err, response) {
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
});

router.put('/:id', function(req, res, next) {
    console.log(req.body);
    thresholds.setThresholds({
        id: req.params.id,
        lightUpperValue: req.body.lightUpperValue,
        lightLowerValue: req.body.lightLowerValue,
        tempUpperValue: req.body.tempUpperValue,
        tempLowerValue: req.body.tempLowerValue,
        moistureUpperValue: req.body.moistureUpperValue,
        moistureLowerValue: req.body.moistureLowerValue
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
    });
})

router.get('/', function(req, res, next) {
  return res.render('thresholds', { title: 'Smart garden' });
});

module.exports = router;
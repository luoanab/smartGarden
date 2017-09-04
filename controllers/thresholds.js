var dbController = require('./dbController');

var thresholdsController = {
 
    setThresholds: function(data, callback) {
        dbController.setThresholds(data, function(err, response) {
            if (err) {
                return callback(err);
            }
            return callback(null, {
                success: true
            });        
        })
    },
    
    getThresholds: function(data, callback) {
        dbController.getThresholds(null, function(err, response) {
            if (err) {
                return callback(err);
            }
            return callback(null, response);        
        })
    },
    
    getThreshold: function(data, callback) {
        dbController.getThreshold(data.id, function(err, response) {
            if (err) {
                return callback(err);
            }
            return callback(null, response);        
        })
    }
}

module.exports = thresholdsController;
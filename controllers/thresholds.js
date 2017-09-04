var dbController = require('./dbController');

var tresholdsController = {
 
    setThresholds: function(data, callback) {
        dbController.setTresholds(data, function(err, response) {
            if (err) {
                return callback(err);
            }
            return callback(null, {
                success: true
            });        
        })
    },
    
    getThresholds: function(data, callback) {
        dbController.getTresholds(data.id, function(err, response) {
            if (err) {
                return callback(err);
            }
            return callback(null, response);        
        })
    }
}

module.exports = tresholdsController;
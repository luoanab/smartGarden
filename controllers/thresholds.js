var dbController = require('./dbController');

var thresholdsController = {
 
    setThresholds: function(data, callback) {
        dbController.setThresholds(data, function(err, response) {
            callback = (typeof callback === 'function') ? callback : function() {}; 
            
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
            if(typeof callback !== 'function') {
                return data;
            }

            callback = (typeof callback === 'function') ? callback : function() {}; 
            
            if (err) {
                return callback(err);
            }
            return callback(null, response);        
        })
    },
    
    getThreshold: function(data, callback) {
        dbController.getThreshold(data, function(err, response) {
            callback = (typeof callback === 'function') ? callback : function() {}; 
            
            if (err) {
                return callback(err);
            }
            return callback(null, response);        
        })
    }
}

module.exports = thresholdsController;
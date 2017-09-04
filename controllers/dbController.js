var JsonDB = require('node-json-db'),
    shortId = require('shortid'),
    moment = require('moment');

var db = new JsonDB("./database/smartGardenDB", true, true);

var dbController = {
    getOperationMode: function(data, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        var data = db.getData("/operationMode");
        return callback(null, {
            operationMode: data
        })
    },
    
    setOperationMode: function(data, callback) {
        callback = (typeof callback === 'function') ? callback : function() {}; 
        
        try {
            db.push("/operationMode", data.operatinMode);
        } catch (error) {
            return callback({
                error: error,
                message: "An error occured while saving an item into the database."
            });
        }

        return callback(null, {
            success: true
        })
    },
    
    setThresholds: function(data, callback) {
        callback = (typeof callback === 'function') ? callback : function() {}; 
        
        try {
            db.push("/thresholds/"+data.id, data);
        } catch (error) {
            return callback({
                error: error,
                message: "An error occured while saving an item into the database."
            });
        }

        return callback(null, {
            success: true
        });
    },
    
    getThreshold: function(data, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        var data = db.getData("/thresholds/"+data.id);
        return callback(null, data);
    },
    
    getThresholds: function(data, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        var data = db.getData("/thresholds");
        return callback(null, data);
    }
};

module.exports = dbController;
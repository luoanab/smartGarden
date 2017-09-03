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
    }
};

module.exports = dbController;
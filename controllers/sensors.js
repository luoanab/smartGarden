var dbController = require('./dbController');

var rpio = require('rpio');
var fs = require('fs');

//pins used for the shield
var SPI_CLK = 18;
var SPI_MISO = 23;
var SPI_MOSI = 24;
var SPI_CS = 25;

//pins used for transistors
var TRANSISTOR_HUMIDITY_SENSOR = 26;
var TRANSISTOR_RELAY = 13;

//pins used for sensors
var HUMIDITY_SENSOR = 19;
var LUMINOSITY_SENSOR = 1; // this pin is on the shield, not on pi directly

//init rpio with custom options
function init_rpio() {
    var options = {
        gpiomem: false,
        mapping: 'gpio' // use the Broadcom GPIOxx naming
    };
    rpio.init(options);
}

//set custom pin values
function set_pins(spi_clk, spi_miso, spi_mosi, spi_cs, tr_humidity, tr_relay, humidity_sensor, luminosity_sensor) {
    SPI_CLK = spi_clk || 18;
    SPI_MISO = spi_miso || 23;
    SPI_MOSI = spi_mosi || 24;
    SPI_CS = spi_cs || 25;
    TRANSISTOR_HUMIDITY_SENSOR = tr_humidity || 26;
    TRANSISTOR_RELAY = tr_relay || 13;
    HUMIDITY_SENSOR = humidity_sensor || 19;
    LUMINOSITY_SENSOR = luminosity_sensor || 1;
}

function open_pins() {
    rpio.open(SPI_MOSI, rpio.OUTPUT);
    rpio.open(SPI_MISO, rpio.INPUT);
    rpio.open(SPI_CLK, rpio.OUTPUT);
    rpio.open(SPI_CS, rpio.OUTPUT);
    rpio.open(TRANSISTOR_HUMIDITY_SENSOR, rpio.OUTPUT);
    rpio.open(HUMIDITY_SENSOR, rpio.INPUT);
    rpio.open(TRANSISTOR_RELAY, rpio.OUTPUT);
}

//Indicate that the pins will no longer be used, and clear any poll events associated with them
function cleanup() {
    rpio.close(SPI_MOSI);
    rpio.close(SPI_MISO);
    rpio.close(SPI_CLK);
    rpio.close(SPI_CS);
    rpio.close(TRANSISTOR_HUMIDITY_SENSOR);
    rpio.close(HUMIDITY_SENSOR);
    rpio.close(TRANSISTOR_RELAY);
}

//read raw temparature data
function read_raw_temp(){
    //file where the 1-Wire temperature sensor output is stored
    var temp_sensor = '/sys/bus/w1/devices/28-0316a0fc75ff/w1_slave';
    var lines = fs.readFileSync(temp_sensor).toString().split("\n");
    return lines;
}

//check if reading temperature is succesful by searching for YES word at the end of the first line
function read_temp(){
    var lines = read_raw_temp();
    var index_temp, temp;
    
    setInterval(function() {
    	lines = read_raw_temp();
    	if (lines[0].slice(-3) !== 'YES') {
    		clearInterval();
    	}
    }, 200);

    index_temp = lines[1].indexOf('t=');
 
    if (index_temp !== -1){
        temp_string = lines[1].slice(index_temp+2);
        temp = {
            temp_c: parseFloat(temp_string) / 1000.0,
            temp_f: parseFloat(temp_string) / 1000.0 * 9.0 / 5.0 + 32.0
        }
        console.log("temp is: ", temp);
        //return temp in C and F
        return temp;
    }
    consolelog.log("temp reading failed ...");
}

//read analog to digital function; used for luminosity sensor
function readadc(adcnum, clockpin, mosipin, misopin, cspin) {
    if ((adcnum > 7) || (adcnum < 0)) {
        return -1
    }

    rpio.write(cspin, rpio.HIGH);
    rpio.write(clockpin, rpio.LOW);
    rpio.write(cspin, rpio.LOW);
    
    commandout = adcnum
    commandout |= 0x18
    commandout <<= 3
    
    for (var i = 0; i < 5; i++) {
        if (commandout & 0x80) {
        	rpio.write(mosipin, rpio.HIGH);
        } else {
        	rpio.write(mosipin, rpio.LOW);
        }
        
        commandout <<=1;
        rpio.write(clockpin, rpio.HIGH);
        rpio.write(clockpin, rpio.LOW);
    }
    
    var adcout = 0;
    for (var i = 0; i < 12; i++) {
        rpio.write(clockpin, rpio.HIGH);
        rpio.write(clockpin, rpio.LOW);
        adcout <<= 1;
        if (rpio.read(misopin)) {
            adcout |= 0x1;
        }
    }
    
    rpio.write(cspin, rpio.HIGH);
    adcout >>= 1;
    
    return adcout;
}

//returns an object with values from all sensors
function read_sensor_values () {
    var sensor_values = {}
    console.log("start reading sensor values");
    try {
        var temperature_val = read_temp();
        sensor_values.luminosity = read_luminosity();
        sensor_values.temperature_c = temperature_val.temp_c || 0;
        sensor_values.temperature_f = temperature_val.temp_f || 0;
        sensor_values.humidity = read_humidity();
        console.log(temperature_val);
    } catch (e) {
        console.log("You killed me! =(... " + e);
    } finally {
        //cleanup();
    }
    
    return sensor_values;
}

function auto_mode (lum_threshold, hum_threshold_down, hum_threshold_up, temp_threshold_down, temp_threshold_up) {
    var sensor_values = read_sensor_values();
    lum_threshold_down = lum_threshold_down || 300;
    lum_threshold_up = lum_threshold_up || 500;
    temperature_threshold = temperature_threshold || 21;
    
    if (sensor_values.luminosity < luminosity_threshold) {
        power_sensor(TRANSISTOR_RELAY, true);
        setInterval(function() {
            power_sensor(TRANSISTOR_RELAY, false);
            var luminosity = read_luminosity();
            if (luminosity >= lum_threshold_up) {
                clearInterval();
                power_sensor(TRANSISTOR_RELAY, false);
            }
            power_sensor(TRANSISTOR_RELAY, true);
        }, 10000);
    } else { // i might not need this else
        power_sensor(TRANSISTOR_RELAY, false);
    }    
//    
//    if (sensor_values.humidity < hum_threshold_down) {
//        relay_on(true);
//        setInterval(function() {
//            relay_on(false);
//            var luminosity = read_luminosity();
//            if (luminosity >= lum_threshold_up) {
//                clearInterval();
//                relay_on(false);
//            }
//            relay_on(true);
//        }, 10000);
//    } else { // i might not need this else
//        relay_on(false);
//    }
    
//    if (sensor_values.temperature_c < temp_threshold_down) {
//        relay_on(true);
//        setInterval(function() {
//            var temp = read_temp()[temp_c];
//            if (temp >= temp_threshold_up) {
//                clearInterval();
//                relay_on(false);
//            }
//        }, 1000);
//    } else { // i might not need this else
//        relay_on(false);
//    }
}

//read luminosity value
function read_luminosity () {
    return read_shield_pin(LUMINOSITY_SENSOR);
}

function read_shield_pin (pin) {
    return readadc(pin, SPI_CLK, SPI_MOSI, SPI_MISO, SPI_CS);
}

//power transistor used by humidity sensor, then read humidity value
function read_humidity () {
    var humidity;
    rpio.write(TRANSISTOR_HUMIDITY_SENSOR, rpio.HIGH);
    setTimeout(function(){
        humidity = rpio.read(HUMIDITY_SENSOR);
        rpio.write(TRANSISTOR_HUMIDITY_SENSOR, rpio.LOW);
        return humidity;
    }, 1000);
}

//power off transistor used by humidity sensor
function stop_humidity_sensor() {
    //rpio.write(TRANSISTOR_HUMIDITY_SENSOR, rpio.LOW);
    power_sensor(TRANSISTOR_HUMIDITY_SENSOR, false);
}

//power on/off a sensor
function power_sensor(sensor, on) {
    if (on) {
        rpio.write(sensor , rpio.HIGH);
    } else {
        rpio.write(sensor, rpio.LOW);
    }
}

function set_heat(state){
    power_sensor(TRANSISTOR_RELAY, state);
}

function set_humidity(state){
    power_sensor(TRANSISTOR_HUMIDITY_SENSOR, state);
}

function set_light(state) {
    //power_sensor(, state);
}

//
//function relay_on (bool) {
//    if (bool) {
//        rpio.write(TRANSISTOR_RELAY , rpio.HIGH);
//    } else {
//        rpio.write(TRANSISTOR_RELAY, rpio.LOW);
//    }
//}

function set_operation_mode(data, callback) {
    dbController.setOperationMode({operatinMode: data.mode}, function(err, response) {
        if (err) {
            return callback(err);
        }
        return callback(null, {
            operation_mode: response.operationMode
        });        
    })
}

function get_operation_mode(data, callback) {
    dbController.getOperationMode(null, function(err, response) {
        if (err) {
            return callback(err);
        }
        return callback(null, {
            operation_mode: response.operationMode
        });        
    })
}

var sensors = {
    init_rpio: init_rpio,
    read_sensor_values: read_sensor_values,
    open_pins: open_pins,
    cleanup: cleanup,
    get_operation_mode: get_operation_mode,
    set_operation_mode: set_operation_mode
}
module.exports = sensors;

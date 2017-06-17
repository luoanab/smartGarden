var rpio = require('rpio');
var fs = require('fs');

var options = {
        gpiomem: false,
        mapping: 'gpio' // use the Broadcom GPIOxx naming
};

rpio.init(options);
rpio.open(13, rpio.OUTPUT);






//file where the temperature is stored
var temp_sensor = '/sys/bus/w1/devices/28-0316a0fc75ff/w1_slave';

//read raw temparature data
function temp_raw(){
    var lines = fs.readFileSync(temp_sensor).toString().split("\n");
    return lines;
}

//check if reading temperature is succesful by searching for YES word at the end of the first line
function read_temp(){
    var lines = temp_raw();

    setInterval(function() {
    	lines = temp_raw();
    	if (lines[0].slice(-3) !== 'YES') {
    		clearInterval();
    	}
    }, 200);

    var index_temp = lines[1].indexOf('t=');
   // var temp_output = lines[1].find('t=');
 
    if (index_temp !== -1){
        temp_string = lines[1].slice(index_temp+2);
        temp_c = parseFloat(temp_string) / 1000.0;
        temp_f = temp_c * 9.0 / 5.0 + 32.0;
        return [temp_c, temp_f];
    }
}

//read analog to digital function; used for luminosity sensor
function readadc(adcnum, clockpin, mosipin, misopin, cspin) {
    if ((adcnum > 7) || (adcnum < 0)) {
        return -1
    }

    rpio.write(cspin, rpio.HIGH);
    rpio.write(clockpin, rpio.LOW);
    rpio.write(cspin, rpio.LOW);
    // GPIO.output(cspin, True)
    // GPIO.output(clockpin, False)
    // GPIO.output(cspin, False)

    commandout = adcnum
    commandout |= 0x18
    commandout <<= 3
    for (var i = 0; i < 5; i++) {
        if (commandout & 0x80) {
        	rpio.write(mosipin, rpio.HIGH);
            // GPIO.output(mosipin, True)
        } else {
        	rpio.write(mosipin, rpio.LOW);
            // GPIO.output(mosipin, False)
        }
        commandout <<=1;
        rpio.write(clockpin, rpio.HIGH);
        rpio.write(clockpin, rpio.LOW);
        // GPIO.output(clockpin, True)
        // GPIO.output(clockpin, False)
    }
    var adcout = 0;
    for (var i = 0; i < 12; i++) {
        rpio.write(clockpin, rpio.HIGH);
        rpio.write(clockpin, rpio.LOW);
        // GPIO.output(clockpin, True)
        // GPIO.output(clockpin, False)
        adcout <<= 1;
        if (rpio.read(misopin)) {
            adcout |= 0x1;
        }
    }
    rpio.write(cspin, rpio.HIGH);
    // GPIO.output(cspin, True)
    adcout >>= 1;
    return adcout;
}


var SPICLK = 18;
var SPIMISO = 23;
var SPIMOSI = 24;
var SPICS = 25;
var TRANSISTORH = 26;
var TRANSISTORR = 13;
var HUMIDITY = 19;

rpio.open(SPIMOSI, rpio.OUTPUT);
rpio.open(SPIMISO, rpio.INPUT);
rpio.open(SPICLK, rpio.OUTPUT);
rpio.open(SPICS, rpio.OUTPUT);
rpio.open(TRANSISTORH, rpio.OUTPUT);
rpio.open(HUMIDITY, rpio.INPUT);
rpio.open(TRANSISTORR, rpio.OUTPUT);

// GPIO.setup(SPIMOSI, GPIO.OUT)
// GPIO.setup(SPIMISO, GPIO.IN)
// GPIO.setup(SPICLK, GPIO.OUT)
// GPIO.setup(SPICS, GPIO.OUT)

// #pins used for the transistor and humidity sensor
// GPIO.setup(TRANSISTORH, GPIO.OUT)
// GPIO.setup(HUMIDITY, GPIO.IN)

// #pin used as an input for the transistor that controlls the relay
// GPIO.setup(TRANSISTORR, GPIO.OUT)

var humiditySensorOn = true;

try {
    while(true) {
        if (humiditySensorOn) {
            humiditySensorOn = false;
        } else {
            humiditySensorOn = true;
        }

        var luminosityValue = readadc(1, SPICLK, SPIMOSI, SPIMISO, SPICS);
        console.log("Luminosity: " + luminosityValue);

        if (luminosityValue < 200) {
            rpio.write(TRANSISTORR, rpio.HIGH);
        } else {
            rpio.write(TRANSISTORR, rpio.LOW);
        }

        var temperatureValue = read_temp();
        console.log("Temperature: " + temperatureValue);

        //GPIO.output(TRANSISTORH, humiditySensorOn)
        isDry = false
        if (humiditySensorOn) {
        	rpio.write(TRANSISTORH, rpio.HIGH);
            isDry = rpio.read(HUMIDITY);
        } else {
        	rpio.write(TRANSISTORH, rpio.LOW);
        }
        	
        if (isDry) {
            console.log("\nIt is dry!!! ")
        }
        else {
            console.log("\nIt is not dry: ");
        }

        setTimeout(function (){}, 500);
    }
} catch (e) {
    console.log("You killed me! =(... " + e);
} finally {
    // GPIO.cleanup()
    rpio.close(SPIMOSI);
    rpio.close(SPIMISO);
    rpio.close(SPICLK);
    rpio.close(SPICS);
    rpio.close(TRANSISTORH);
    rpio.close(HUMIDITY);
    rpio.close(TRANSISTORR);
}

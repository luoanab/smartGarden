#!/usr/bin/env python
import time
import os
import RPi.GPIO as GPIO

#drivers for 1wire temperature sensor
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

#file where the temperature is stored
temp_sensor = '/sys/bus/w1/devices/28-0316a0fc75ff/w1_slave'

#read raw temparature data
def temp_raw():
    f = open(temp_sensor, 'r')
    lines = f.readlines()
    f.close()
    return lines

#check if reading temperature is succesful by searching for YES word at the end of the first line
def read_temp():
    lines = temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = temp_raw()
        
    temp_output = lines[1].find('t=')

    if temp_output != -1:
        temp_string = lines[1].strip()[temp_output+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_c, temp_f

#read analog to digital function; used for luminosity sensor
GPIO.setmode(GPIO.BCM)
def readadc(adcnum, clockpin, mosipin, misopin, cspin):
    if ((adcnum > 7) or (adcnum < 0)):
        return -1
    GPIO.output(cspin, True)
    GPIO.output(clockpin, False)
    GPIO.output(cspin, False)

    commandout = adcnum
    commandout |= 0x18
    commandout <<= 3
    for i in range(5):
        if (commandout & 0x80):
            GPIO.output(mosipin, True)
        else:
            GPIO.output(mosipin, False)
        commandout <<=1
        GPIO.output(clockpin, True)
        GPIO.output(clockpin, False)
    adcout = 0
    for i in range(12):
        GPIO.output(clockpin, True)
        GPIO.output(clockpin, False)
        adcout <<= 1
        if (GPIO.input(misopin)):
            adcout |= 0x1
    GPIO.output(cspin, True)
    adcout >>= 1
    return adcout


SPICLK = 18
SPIMISO = 23
SPIMOSI = 24
SPICS = 25
TRANSISTORH = 26
TRANSISTORR = 13
HUMIDITY = 19

//pins for output for infrared lightulb and for water pump
var INFRARED = 5;
var PUMP = 6;


GPIO.setup(SPIMOSI, GPIO.OUT)
GPIO.setup(SPIMISO, GPIO.IN)
GPIO.setup(SPICLK, GPIO.OUT)
GPIO.setup(SPICS, GPIO.OUT)

#pins used for the transistor and humidity sensor
GPIO.setup(TRANSISTORH, GPIO.OUT)
GPIO.setup(HUMIDITY, GPIO.IN)

#pins used for infrared and pump
GPIO.setup(INFRARED, GPIO.OUT)
GPIO.setup(PUMP, GPIO.OUT)

#pin used as an input for the transistor that controlls the relay
GPIO.setup(TRANSISTORR, GPIO.OUT)

humiditySensorOn = True

try:
    while True:
        if (humiditySensorOn):
            humiditySensorOn = False
        else:
            humiditySensorOn = True
            
        luminosityValue = readadc(1, SPICLK, SPIMOSI, SPIMISO, SPICS)
        print "\nLuminosity: ",luminosityValue

        if luminosityValue < 200: 
            GPIO.output(TRANSISTORR, True)
        else:
            GPIO.output(TRANSISTORR, False)

        temperatureValue = read_temp()
        print "\nTemperature: ",temperatureValue
        
        if (temperatureValue > 27) {
            GPIO.output(INFRARED, False);
        } else {
            GPIO.output(INFRARED, True);
        }

        GPIO.output(TRANSISTORH, humiditySensorOn)
        isDry = False
        if humiditySensorOn:
            isDry = GPIO.input(HUMIDITY)
            
        
        if isDry:
            print "\nIt is dry!!! "
        else:
            print "\nIt is not dry:) "
            
        time.sleep(0.5)
except Exception as e:
    print "done here, i'm out..."
    print e
except KeyboardInterrupt:
    print "You killed me! =("
finally:
    GPIO.cleanup()




    

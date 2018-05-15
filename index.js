const fs = require('fs')
const express = require('express')

const config = require('./config')

const thermSerial = config.thermSerial

console.log('Looking for thermometer with serial number ' + thermSerial + ' in /sys/bus/w1/devices/...')
thermFile = fs.readFileSync('/sys/bus/w1/devices/' + thermSerial + '/w1_slave', { encoding: 'UTF-8' })

app = express()

app.use('/', function (req, res) {
	res.send('hello world')
})

app.listen(80)
console.log('Raspberry Pi Temp Sensor listening on port 80')

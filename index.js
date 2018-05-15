const fs = require('fs')
const path = require('path')
const express = require('express')
const cron = require('node-cron')

const config = require('./config')

const thermSerial = config.thermSerial

console.log('Looking for thermometer with serial number ' + thermSerial + ' in /sys/bus/w1/devices/...')
thermFileName = '/sys/bus/w1/devices/' + thermSerial + '/w1_slave'
thermFile = fs.readFileSync(thermFileName, { encoding: 'UTF-8' })

var temp = 0;

cron.schedule('* * * * * *', function () {
	fs.readFile(thermFileName, { encoding: 'UTF-8' }, function (err, data) {
		if (err) {
			throw err
		}

		lines = data.split('\n')
		statusString = lines[0].substr(lines[0].length - 3, lines[0].length)
		if (statusString !== 'YES') { return }

		tempString = lines[1].substr(lines[1].indexOf('t=') + 2)

		temp = parseFloat(tempString)
		temp = temp/1000
	});
})

app = express()

app.use('/', function (req, res) {
	res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(80)
console.log('Raspberry Pi Temp Sensor listening on port 80')

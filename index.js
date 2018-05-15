const fs = require('fs')
const path = require('path')
const http = require('http')
const express = require('express')
const cron = require('node-cron')
const socketIo = require('socket.io')

const config = require('./config')

const thermSerial = config.thermSerial

console.log('Looking for thermometer with serial number ' + thermSerial + ' in /sys/bus/w1/devices/...')
thermFileName = '/sys/bus/w1/devices/' + thermSerial + '/w1_slave'
thermFile = fs.readFileSync(thermFileName, { encoding: 'UTF-8' })

var currentTemp = 0;

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
		currentTemp = temp

		io.emit('temp', currentTemp)
	});
})

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, './public/index.html'))
})

io.on('connection', function (socket) {
	console.log("user connected")
})

server.listen(80)
console.log('Raspberry Pi Temp Sensor listening on port 80')

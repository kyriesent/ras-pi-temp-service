const express = require('express')

app = express()

app.use('/', function (req, res) {
	res.send('hello world')
})

app.listen(80)
console.log('Raspberry Pi Temp Sensor listening on port 80')

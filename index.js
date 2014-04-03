var express = require('express')
	, http = require('http')
	, fs = require('fs')
	, sqlite = require('sqlite3').verbose()
	, app = express()
	, server = http.createServer(app)
	, io = require('socket.io').listen(server, {'log level': 0})
	, db;

app.use(express.static('www'));

io.sockets.on('connection', function (socket) {
	socket.on('result', function (data) {
		console.log('socket.on#result', data);
	});
	
	socket.on('ready', function (fn) {
		fs.readdir('www/js/tests', function (err, files) {
			if (!err) fn(files.map(function (filename) {
				return '/js/tests/' + filename;
			}));
		});
	});
});

// ensure we have an actual connection to our database before we're
// up and running
db = new sqlite.Database('results.db', function (err) {
	if (!err) {
		// setup the table once if we need to
		db.run('CREATE TABLE IF NOT EXISTS reports (os, platform, browser, test_name, total_time, average, max, min, date)');
	
		console.log('Listening on 18980');
		server.listen(18980);
	} else console.log(err.message);
});
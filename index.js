#!/usr/bin/env node

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
	// will make an entry for the given os
	socket.on('set:os', function (name) {
		var sql = db.prepare('INSERT OR IGNORE INTO os (name) VALUES (?)');
		sql.run(name);
	});
	
	// will make an entry for the given platform
	socket.on('set:platform', function (name) {
		var sql = db.prepare('INSERT OR IGNORE INTO platform (name) VALUES (?)');
		sql.run(name);
	});
	
	// will make an entry for the given browser
	socket.on('set:browser', function (name) {
		var sql = db.prepare('INSERT OR IGNORE INTO browser (name) VALUES (?)');
		sql.run(name);
	});
	
	// will make an entry for a found test
	socket.on('set:test', function (data) {
		var sql = db.prepare('INSERT OR IGNORE INTO test (name, description) VALUES (?, ?)');
		sql.run(data.name, data.description);
	});
	
	// will insert test result into the database
	socket.on('set:result', function (data, fn) {
		var sql = db.prepare(
			'INSERT INTO result (os, platform, browser, test, data) VALUES (' +
				'(SELECT id FROM os WHERE name=?),' +
				'(SELECT id FROM platform WHERE name=?),' +
				'(SELECT id FROM browser WHERE name=?),' +
				'(SELECT id FROM test WHERE name=?),' +
				'?' +
			')'
		);
		sql.run(data.os, data.platform, data.browser, data.name, JSON.stringify(data.result), function (err) {
			if (!err) fn();
			else console.log(err.message);
		});
	});
	
	// request results for the table that have all entries that can be sorted/filtered in the browser
	socket.on('get:results', function (fn) {
		db.all(
			'SELECT ' +
				'o.name AS "os", ' +
				'b.name AS "browser", ' +
				'p.name AS "platform", ' +
				'r.data AS "data", ' +
				't.name AS "test", ' +
				'r.date AS "date" ' +
			'FROM result r JOIN ' +
				'os o ON o.id = r.os JOIN ' +
				'platform p ON p.id = r.platform JOIN ' +
				'browser b ON b.id = r.browser JOIN ' +
				'test t ON t.id = r.test ' +
			'ORDER BY datetime(r.date) DESC'
		, function (err, rows) {
			if (!err) fn(rows);
			else console.log(err.message);
		});
	});
	
	// request results for a bar graph of averages per os per test
	socket.on('get:averages', function (fn) {
		db.all(
			'SELECT ' +
				'o.name AS "os", ' +
				'b.name AS "browser", ' +
				'p.name AS "platform", ' +
				't.name AS "test", ' +
				'r.data AS "data", ' +
				'r.date AS "date" ' +
			'FROM result r ' +
			'JOIN os o ON o.id = r.os ' +
			'JOIN platform p ON p.id = r.platform ' +
			'JOIN browser b on b.id = r.browser ' +
			'JOIN test t ON t.id = r.test ' +
			'GROUP BY "os", "platform", "browser", "test" ' +
			'ORDER BY datetime(r.date) DESC, "os", "platform", "browser"'
		, function (err, rows) {
			if (!err) {
				
				var tests = {};
				
				rows.forEach(function (row) {
					var entries = tests[row.test] || (tests[row.test] = []);
					entries.push(row);
				});
				
				fn(tests);
			} else console.log(err.message);
		});
	});
	
	// return the trend-sets for each platform by test
	socket.on('get:trends', function (fn) {
		db.all(
			'SELECT ' +
				'o.name AS "os", ' +
				'b.name AS "browser", ' +
				'p.name AS "platform", ' +
				'r.data AS "data", ' +
				't.name AS "test", ' +
				'r.date AS "date" ' +
			'FROM result r JOIN ' +
				'os o ON o.id = r.os JOIN ' +
				'platform p ON p.id = r.platform JOIN ' +
				'browser b ON b.id = r.browser JOIN ' +
				'test t ON t.id = r.test ' +
			'ORDER BY datetime(r.date) ASC'
			, function (err, results) {
				if (!err) {
					var trends = {};
					
					results.forEach(function (row) {
						var label = row.os + ' ' + row.platform + ' ' + row.browser
							, entry = trends[label] || (trends[label] = {})
							, values = entry[row.test] || (entry[row.test] = [])
							, date;
							
						row.data = JSON.parse(row.data);
						values.push(row.data.average);
						// date = new Date(row.date);
						// date = date.getMonth() + '/' + date.getDay() + '/' + date.getFullYear();
						// 
						// var idx = -1;
						// values.forEach(function (entry, i) {
						// 	if (entry[0] == date) idx = i;
						// });
						// 
						// if (idx !== -1) {
						// 	// help calculate mean
						// 	var entry = values[idx];
						// 	entry[1] = (entry[1] + row.data.average) / 2;
						// } else values.push([date, row.data.average]);
					});
					
					fn(trends);
				} else console.log(err.message);
			}
		)
	});
	
	// will return the dynamically built list of tests with their filenames pathed such that
	// the browser can request them
	socket.on('get:tests', function (fn) {
		fs.readdir('www/js/tests', function (err, files) {
			if (!err) {
				fn(files.map(function (filename) {
					return '/js/tests/' + filename;
				}));
			} else console.log(err.message);
		});
	});
});

// ensure we have an actual connection to our database before we're
// up and running
db = new sqlite.Database('results.db', function (err) {
	if (!err) {
		db.serialize(function () {
			// setup the table once if we need to
			db.run('CREATE TABLE IF NOT EXISTS test (id integer primary key autoincrement, name unique, description)');
			db.run('CREATE TABLE IF NOT EXISTS platform (id integer primary key autoincrement, name unique)');
			db.run('CREATE TABLE IF NOT EXISTS os (id integer primary key autoincrement, name unique)');
			db.run('CREATE TABLE IF NOT EXISTS browser (id integer primary key autoincrement, name unique)');
			db.run('CREATE TABLE IF NOT EXISTS result (id integer primary key autoincrement, os, platform, browser, test, data, date default CURRENT_TIMESTAMP)');
		});
		db.parallelize()
		// notify that we're running and on what port
		console.log('Listening on 18980');
		server.listen(18980);
	} else console.log(err.message);
});
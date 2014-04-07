(function (window) {
	
	var socket = window.socket = io.connect('http://' + location.hostname + ':18980');
	
	socket.on('connect', function () {
		// we need to identify the platform for the datasource
		socket.emit('set:os', platform.os);
		socket.emit('set:platform', platform.platform);
		socket.emit('set:browser', platform.browser);
	});
	
	
})(window);
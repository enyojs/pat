(function (window) {
	
	var socket = window.socket = io.connect('http://' + location.hostname + ':18980');
	
})(window);
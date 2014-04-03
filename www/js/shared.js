(function (window) {
	
	// determine platform
	var data = window.DATA = {};
	
	data.os = platform.os.family;
	data.browser = platform.name;
	data.platform = platform.layout;
	
	// expose a function that is platform agnostic...
	window.now = function () {
		return performance? performance.now(): Date.now();
	};
	
})(window);
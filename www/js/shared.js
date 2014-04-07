(function (window, platform) {
	
	// quick return method to gather the information in a normalized way
	window.platform = {
		os: platform.os.family,
		platform: platform.layout,
		browser: platform.name
	};
	
	// expose a function that is platform agnostic...
	window.now = function () {
		return performance? performance.now(): Date.now();
	};
	
})(window, platform);
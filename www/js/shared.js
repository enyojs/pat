(function (window, platform) {
	
	// quick return method to gather the information in a normalized way
	var platform = window.platform = {
		os: platform.os.family,
		platform: platform.layout,
		browser: platform.name
	};
	
	// expose a function that is platform agnostic...
	window.now = function () {
		return performance? performance.now(): Date.now();
	};
	
	// we want to update the dom to reflect our newfound information...
	$(document).ready(function () {
		$('#header .platform-info').html(
			platform.os + ' > ' + platform.platform + ' > ' + platform.browser
		);
	});
	
})(window, platform);
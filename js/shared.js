(function (window) {
	
	var delegates = []
		, delegate;
	
	window.getCircleCount = function () {
		return Number(document.getElementById('circle-count').value);
	};
	
	window.getAnimate = function () {
		return Boolean(document.getElementById('animate').checked);
	};
	
	window.getChangeColor = function () {
		return Boolean(document.getElementById('change-color').checked);
	};
	
	window.getOneAtATime = function () {
		return Boolean(document.getElementById('one-at-a-time').checked);
	};
	
	window.getRAF = function () {
		return Boolean(document.getElementById('raf').checked);
	};
	
	window.getContent = function () {
		return Boolean(document.getElementById('no-innerhtml').checked);
	};
	
	window.getDelegate = function () {
		var el = document.getElementById('delegates-list')
			, idx = el.selectedIndex
			, op = el.options[idx];
		return op.value;
	};
	
	window.getRootNode = function () {
		return document.getElementById('container');
	};
	
	window.clearRootNode = function () {
		var el = getRootNode();
		el.innerHTML = '';
	};
	
	window.getOptions = function () {
		return {
			animate: getAnimate(),
			changeColor: getChangeColor(),
			oneAtATime: getOneAtATime(),
			rAF: getRAF(),
			count: getCircleCount(),
			content: getContent()
		};
	};
	
	window.mixin = function (base, exts) {
		for (var key in exts) base[key] = exts[key];
	};
	
	window.addDelegate = function (delegate) {
		delegates.push(delegate);
	};
	
	window.delegateChanged = function () {
		var name = getDelegate()
			, idx = -1;
		delegates.forEach(function (ln, i) {
			if (ln.name == name) idx = i;
		});
		if (idx > -1) {
			reset();
			delegate = delegates[idx];
			delegate.reset();
		}
	};
	
	window.start = function () {
		stop();
		if (delegate) delegate.start();
	};
	
	window.stop = function () {
		if (delegate) delegate.stop();
	};
	
	window.reset = function () {
		stop();
		if (delegate) delegate.reset();
		else clearRootNode();
	};
	
})(window);
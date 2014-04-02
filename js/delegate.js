(function (window) {
	
	function Delegate (config) {
		mixin(this, getOptions());
		mixin(this, config);
		this.counter = 0;
		addDelegate(this);
	}
	
	Delegate.prototype = Object.create({
		tick: function () {},
		
		init: function () {
			mixin(this, getOptions());
			this.generateNodes();
		},
		
		reset: function () {
			clearRootNode();
			this.init();
		},
		
		start: function () {
			mixin(this, getOptions());
			this.reset();
			this.counter = 0;
			if (this.rAF) this.job = requestAnimationFrame(this.tick.bind(this));
			else this.job = setInterval(this.tick.bind(this), 16);
		},
		
		stop: function () {
			if (this.rAF) cancelAnimationFrame(this.job);
			else clearInterval(this.job);
		},
		
		generateNodes: function () {
			var count = this.count
				, root = getRootNode()
				, nodes = []
				, el;
			for (var i=0; i<count; ++i) {
				el = document.createElement('div');
				el.className = 'circle';
				el.innerHTML = 1;
				root.appendChild(el);
				nodes.push(el);
			}
			
			return nodes;
		}
	});
	
	window.Delegate = Delegate;
	
})(window);
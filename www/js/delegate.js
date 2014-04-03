(function (window) {
	
	function Delegate (config) {
		mixin(this, getOptions());
		mixin(this, config);
		this.counter = 0;
		addDelegate(this);
	}
	
	Delegate.prototype = Object.create({
		tick: function () {
			if (this.record) this.frameComplete();
		},
		
		next: function () {
			if (!this.stopped) {
				if (this.rAF) this.job = requestAnimationFrame(this.tick.bind(this));
				else this.job = setTimeout(this.tick.bind(this), 0);
			}
		},
		
		init: function () {
			mixin(this, getOptions());
			this.resetStats();
			this.generateNodes();
		},
		
		reset: function () {
			clearRootNode();
			this.init();
		},
		
		resetStats: function () {
			this.stats = {
				frames: 0,
				average: 0,
				max: -Infinity,
				min: Infinity,
				times: 0,
				tick: null
			};
		},
		
		start: function () {
			mixin(this, getOptions());
			this.reset();
			this.counter = 0;
			this.stopped = false;
			if (this.rAF) this.job = requestAnimationFrame(this.tick.bind(this));
			else this.job = setTimeout(this.tick.bind(this), 0);
		},
		
		stop: function () {
			this.stopped = true;
			if (this.rAF) cancelAnimationFrame(this.job);
			else clearTimeout(this.job);
			
			if (this.record && this.stats.frames > 0) this.analyze().publishStats();
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
		},
		
		frameComplete: function () {
			var stats = this.stats
				, tot;
			
			if (stats.tick) {
				stats.times += (tot = perfNow()-stats.tick);
				if (tot > stats.max) stats.max = tot;
				if (tot < stats.min) stats.min = tot;
				stats.frames++;
			}
			
			if (stats.frames == 400) this.stop();
			else stats.tick = perfNow();
		},
		
		analyze: function () {
			var stats = this.stats;
			
			stats.average = stats.times / stats.frames;
			
			return this;
		},
		
		publishStats: function () {
			var root = getResultsNode()
				, stats = this.stats
				, el;
			
			root.innerHTML = '';
			el = generateResultElement('frames', stats.frames);
			root.appendChild(el);
			el = generateResultElement('total time', stats.times + 'ms');
			root.appendChild(el);
			el = generateResultElement('average', stats.average + 'ms');
			root.appendChild(el);
			el = generateResultElement('max', stats.max + 'ms');
			root.appendChild(el);
			el = generateResultElement('min', stats.min + 'ms');
			root.appendChild(el);
			this.resetStats();
		}
	});
	
	window.Delegate = Delegate;
	
})(window);
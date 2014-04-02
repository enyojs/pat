var NUMBER_OF_NODES = 501
	, TESTS = {}
	, RUNNING;

function start (name) {
	stop();
	
	var test = TESTS[name];
	if (test) {
		RUNNING = test;
		test.init().start();
	}
}

function stop () {
	if (RUNNING) RUNNING.stop();
}


function Test (props) {
	for (var key in props) {
		this[key] = props[key];
	}
	
	TESTS[this.name] = this;
}

Test.prototype = Object.create({
	
	init: function () {},
	
	tick: function () {},
	
	start: function () {},
	
	stop: function () {}
	
});


new Test({
	name: "raw",
	init: function () {
		var root = this.root = document.getElementById('test-container');
		
		this.count = 1;
	
		// we aren't running this on IE...
		root.innerHTML = '';
	
		for (var i=0; i<NUMBER_OF_NODES; ++i) {
			var el = document.createElement('div');
			el.className = 'circle';
			el.innerHTML = 1;
			root.appendChild(el);
		}
		
		return this;
	},
	start: function () {
		this.id = setInterval(this.tick.bind(this), 16);
	},
	stop: function () {
		clearInterval(this.id);
	},
	tick: function () {
		var root = this.root
			, count = (++this.count)
			, el;
		
		for (var i=0, len=root.children.length; i<len; ++i) {
			el = root.children[i];
			el.innerHTML = count % 100;
			el.style.top = (Math.sin(count / 10) * 10) + 'px';
			el.style.left = (Math.cos(count / 10) * 10) + 'px';
			el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
		};
	}
});

new Test({
	name: "rAF",
	init: function () {
		var root = this.root = document.getElementById('test-container');
		
		this.count = 1;
	
		// we aren't running this on IE...
		root.innerHTML = '';
	
		for (var i=0; i<NUMBER_OF_NODES; ++i) {
			var el = document.createElement('div');
			el.className = 'circle';
			el.innerHTML = 1;
			root.appendChild(el);
		}
		
		return this;
	},
	start: function () {
		this.id = requestAnimationFrame(this.tick.bind(this));
	},
	stop: function () {
		cancelAnimationFrame(this.id);
	},
	tick: function () {
		var root = this.root
			, count = (++this.count)
			, el;
		
		// root.style.backgroundColor = 'rgb(0,0, ' + (count % 255) + ')';
		
		for (var i=0, len=root.children.length; i<len; ++i) {
			el = root.children[i];
			// if (i == count % NUMBER_OF_NODES) {
				// el = root.children[count % NUMBER_OF_NODES];
				el.innerHTML = count % 100;
				el.style.top = (Math.sin(count / 10) * 10) + 'px';
				el.style.left = (Math.cos(count / 10) * 10) + 'px';
				el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
				// el.setAttribute("src", i);
			// }
		};
		
		this.id = requestAnimationFrame(this.tick.bind(this));
	}
});

new Test({
	name: "rawDoc",
	init: function () {
		var root = this.root = document.getElementById('test-container')
			, frag = this.frag = document.createDocumentFragment();
		
		this.count = 1;
	
		this.createNodes().injectNodes();
		
		return this;
	},
	createNodes: function () {
		var frag = this.frag
			, count = (++this.count)
			, el;
			
		for (var i=0; i<NUMBER_OF_NODES; ++i) {
			el = document.createElement('div');
			el.className = 'circle';
			el.innerHTML = count % 100;
			el.style.top = (Math.sin(count / 10) * 10) + 'px';
			el.style.left = (Math.cos(count / 10) * 10) + 'px';
			el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
			frag.appendChild(el);
		}
		
		return this;
	},
	injectNodes: function () {
		this.root.innerHTML = '';
		this.root.appendChild(this.frag);
		
		return this;
	},
	start: function () {
		this.id = setInterval(this.tick.bind(this), 16);
	},
	stop: function () {
		clearInterval(this.id);
	},
	tick: function () {
		var root = this.root
			, pn = root.parentNode
			, count = (++this.count)
			, el;
		
		pn.removeChild(root);
		
		for (var i=0, len=root.children.length; i<len; ++i) {
			el = root.children[i];
			el.innerHTML = count % 100;
			el.style.top = (Math.sin(count / 10) * 10) + 'px';
			el.style.left = (Math.cos(count / 10) * 10) + 'px';
			el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
		};
		
		pn.appendChild(root);
	}
});

new Test({
	name: "rAFDoc",
	init: function () {
		var root = this.root = document.getElementById('test-container')
			, frag = this.frag = document.createDocumentFragment();
		
		this.count = 1;
	
		this.createNodes().injectNodes();
		
		return this;
	},
	createNodes: function () {
		var frag = this.frag
			, count = this.count
			, el;
			
		for (var i=0; i<NUMBER_OF_NODES; ++i) {
			el = document.createElement('div');
			el.className = 'circle';
			el.innerHTML = count % 100;
			// if (i === 0) el.style.webkitTransform = "translate3d(0,0,100px)";
			el.style.top = (Math.sin(count / 10) * 10) + 'px';
			el.style.left = (Math.cos(count / 10) * 10) + 'px';
			el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
			frag.appendChild(el);
		}
		
		return this;
	},
	injectNodes: function () {
		this.root.innerHTML = '';
		this.root.appendChild(this.frag);
		
		return this;
	},
	start: function () {
		this.id = requestAnimationFrame(this.tick.bind(this));
	},
	stop: function () {
		cancelAnimationFrame(this.id);
	},
	tick: function () {
		var root = this.root
			, pn = root.parentNode
			, count = (++this.count)
			, el;
		
		pn.removeChild(root);
		
		for (var i=0, len=root.children.length; i<len; ++i) {
			el = root.children[i];
			if (i == (count % NUMBER_OF_NODES)) {
			
			
				el.innerHTML = count % 100;
				// el.style.top = (Math.sin(count / 10) * 10) + 'px';
				// el.style.left = (Math.cos(count / 10) * 10) + 'px';
				// el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
			}
			// el.setAttribute("src", i);
		};
		
		pn.appendChild(root);
		
		this.id = requestAnimationFrame(this.tick.bind(this));
	}
});
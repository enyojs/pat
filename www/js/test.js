(function (window) {
	
	var tests = []
		, running = false;
	
	window.runAllTests = function () {
		if (!running) {
			var test = tests.shift();
			if (test) test.run();
		
			// yeah its ugly to do this but...
			else socket.emit('finished');
		}
	};
	
	function Test (props) {
		// ensure we store it with the others
		tests.push(this);
		
		// apply all of the passed in properties
		$.extend(this, props);
		
		// move some routines so they can be repeated for the instance...
		this.init();
	}
	
	Test.prototype = Object.create({
		
		init: function () {
			this.results = {
				test_name: this.name,
				date: new Date().toISOString(),
				total_time: 0,
				average: 0,
				max: -Infinity,
				min: Infinity
			};
		},
		
		run: function () {
			running = true;
			this.setup();
		},
		
		tick: function () {
			
		},
		
		done: function () {
			this.publish();
			running = false;
			runAllTests();
		},
		
		publish: function () {
			
			// we send the test result to the source so that it can store it in the
			// database for analysis later
			socket.send('result', $.extend({}, DATA, this.results));
		},
		
		setup: function () {
			var count = 100
				, root = document.getElementById('test-container')
				, nodes = []
				, el;
			
			root.innerHTML = '';
			
			for (var i=0; i<count; ++i) {
				el = document.createElement('div');
				el.className = 'circle';
				el.innerHTML = '0';
				root.appendChild(el);
				nodes.push(el);
			}
			
			return nodes;
		}
		
	});
	
	// expose the class
	window.Test = Test;
	
})(window);
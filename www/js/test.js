(function (window) {
	
	var tests = {}
		, selectedTests = null
		, running = false;
	
	window.getSelectedTests = function () {
		var el;
		
		selectedTests = [];
		
		$('#header .tests .test-option').each(function (i, div) {
			if ((el = $('input', div)).prop('checked')) {
				selectedTests.push(tests[$(el).prop('value')]);
			}
		});
		
		return selectedTests;
	};
	
	window.selectAllTests = function () {
		$('#header .tests input').each(function (i, el) {
			$(el).prop('checked', true);
		});
		getSelectedTests();
	};
	
	window.deselectAllTests = function () {
		$('#header .tests input').each(function (i, el) {
			$(el).prop('checked', false);
		});
		getSelectedTests();
	};
	
	window.runTests = function () {
		if (!running) {
			getSelectedTests();
			nextTest();
		}
	};
	
	window.nextTest = function () {
		if (!running && selectedTests) {
			var test = selectedTests.shift();
			if (test) {
				$('#header .running-test .name').html(test.name);
				$('#header .running-test .description').html(test.description);
				test.run();
			}
		}
	};
	
	function addTest (test) {
		tests[test.name] = test;
		
		// ensure that the datasource knows about this particular test
		socket.emit('set:test', {name: test.name, description: test.description});
		
		// add a selectable option for this particular test
		$('#header .tests').append($(
			'<div class="test-option">' +
				'<input type="checkbox" value="' + test.name + '" checked />' +
				'<span>' + test.name + '</span>' +
			'</div>'
		));
	};
	
	// An abstract kind that gives shape to the types of tests that can be run and
	// helps them communicate with the datasource correctly...
	function Test (props) {
		if (props) {
			// apply all of the passed in properties
			$.extend(this, props);
		
			// ensure we store it with the others
			addTest(this);
		
			// move some routines so they can be repeated for the instance...
			this.init();
		}
	}
	
	Test.prototype = Object.create({
		name: '',
		description: '',
		
		init: function () {
			this.results = {};
		},
		
		run: function () {
			running = true;
			this.setup();
		},
		
		tick: function () {},
		
		done: function () {
			this.save();
			running = false;
			nextTest();
		},
		
		save: function () {
			// we send the test result to the source so that it can store it in the
			// database for analysis later
			socket.emit('set:result', $.extend({}, platform, {name: this.name, result: this.results}), function () {
				// @TODO!
			});
		},
		
		setup: function () {}
		
	});
	
	// expose the class
	window.Test = Test;
	
	// Another abstract class to help with FPS oriented tests
	function FPSTest (props) {
		Test.call(this, props);
	}
	
	FPSTest.prototype = Object.create(Test.prototype);
	
	$.extend(FPSTest.prototype, {
		init: function () {
			this.results = {
				average: 0,
				total: 0,
				max: -Infinity,
				min: Infinity
			};
		},
		done: function () {
			var res = this.results;
			delete res.tick;
			
			// now calculate the average
			res.average = res.total / 400;
			
			Test.prototype.done.call(this);
		},
		tick: function () {
			var res = this.results
				, tot;
				
			if (res.tick) {
				res.total += (tot = now()-res.tick);
				if (tot > res.max) res.max = tot;
				if (tot < res.min) res.min = tot;
			}
			
			res.tick = now();
		}
	});
	
	window.FPSTest = FPSTest;
	
	// One more abstraction for tests using the circles...
	function CircleTest (props) {
		FPSTest.call(this, props);
	}
	
	CircleTest.prototype = Object.create(FPSTest.prototype);
	
	$.extend(CircleTest.prototype, {
		setup: function () {
			var count = 25
				, root = this.root || (this.root = document.getElementById('test-container'))
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
		}
	});
	
	window.CircleTest = CircleTest;
	
})(window);
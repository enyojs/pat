(function () {
	
	new Test({
		name: 'FPS using direct DOM update',
		run: function () {
			Test.prototype.run.call(this);
			
			this.counter = 0;
			this.job = requestAnimationFrame(this.tick.bind(this));
		},
		tick: function () {
			var count = (++this.counter)
				, content = count % 100
				, root = this.root || (this.root = document.getElementById('test-container'))
				, el;
			
			for (var i=0, len=root.children.length; i<len; ++i) {
				el = root.children[i];
				el.innerHTML = content;
				el.style.top = (Math.sin(count / 10) * 10) + 'px';
				el.style.left = (Math.cos(count / 10) * 10) + 'px';
				el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
			}
			
			if (count < 400) this.job = requestAnimationFrame(this.tick.bind(this));
			else this.done();
		}
	});
	
})();
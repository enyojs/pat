(function () {
	
	new Delegate({
		name: 'direct',
		tick: function () {
			var root = getRootNode()
				, count = (++this.counter)
				, oaat = this.oneAtATime
				, content = this.content
				, el;
			
			if (!oaat) {
				for (var i=0, len=root.children.length; i<len; ++i) {
					el = root.children[i];
					if (content) {
						el.innerHTML = count % 100;
					}
					if (this.animate) {
						el.style.top = (Math.sin(count / 10) * 10) + 'px';
						el.style.left = (Math.cos(count / 10) * 10) + 'px';
					}
					if (this.changeColor) el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
				}
			} else {
				el = root.children[count % root.children.length];
				if (content) {
					el.innerHTML = count % 100;
				}
				if (this.animate) {
					el.style.top = (Math.sin(count / 10) * 10) + 'px';
					el.style.left = (Math.cos(count / 10) * 10) + 'px';
				}
				if (this.changeColor) el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
			}
			
			if (this.rAF) this.job = requestAnimationFrame(this.tick.bind(this));
		}
	});
	
})();
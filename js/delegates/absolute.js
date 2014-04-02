(function () {
	
	new Delegate({
		name: 'absolute',
		generateNodes: function () {
			var nodes = Delegate.prototype.generateNodes.call(this)
				, root = getRootNode()
				, width = root.offsetWidth
				, col = 0
				, row = 0
				, cols, el;
				
			cols = Math.floor(width / (25 + 20));
			
			for (var i=0, len=nodes.length; i<len; ++i) {
				col = i % cols;
				
				el = nodes[i];
				el.style.position = 'absolute';
				el.style.float = 'none';
				el.style.top = (row * (25 + 20)) + 'px';
				el.style.left = (col * (25 + 20)) + 'px';
				
				if ((i + 1) % cols === 0) ++row;
			}
		},
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
						el.style.webkitTransform = 'translate(' + (Math.cos(count / 10) * 10) + 'px,' + (Math.sin(count / 10) * 10) + 'px)';
					}
					if (this.changeColor) el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
				}
			} else {
				el = root.children[count % root.children.length];
				if (content) {
					el.innerHTML = count % 100;
				}
				if (this.animate) {
					el.style.webkitTransform = 'translate(' + (Math.cos(count / 10) * 10) + 'px,' + (Math.sin(count / 10) * 10) + 'px)';
				}
				if (this.changeColor) el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
			}
			
			if (this.rAF) this.job = requestAnimationFrame(this.tick.bind(this));
		}
	});
	
})();
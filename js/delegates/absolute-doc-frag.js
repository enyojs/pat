(function () {
	
	new Delegate({
		name: 'absolute-doc-frag',
		init: function () {
			this.frag = document.createDocumentFragment();
			Delegate.prototype.init.call(this);
		},
		generateNodes: function () {
			var frame = this.generateFrame(true)
				, root = this.root || (this.root = getRootNode());
				
			root.innerHTML = '';
			root.appendChild(frame);
		},
		
		generateFrame: function (init) {
			var frag = this.frag
				, count = init? 0: (++this.counter)
				, root = this.root || (this.root = getRootNode())
				, content = init? true: this.content
				, animate = init? false: this.animate
				, oaat = init? false: this.oneAtATime
				, changeColor = init? false: this.changeColor
				, width = root.offsetWidth
				, chosen = null
				, col = 0
				, row = 0
				, el, cols;
			
			cols = Math.floor(width / (25 + 20));
			
			if (oaat) chosen = count % root.children.length;
			
			for (var i=0, len=this.count; i<len; ++i) {
				col = i % cols;
				
				el = document.createElement('div');
				el.className = 'circle';
				el.style.position = 'absolute';
				el.style.float = 'none';
				
				if (content) el.innerHTML = init? 1: (count % 100);
				el.style.top = (row * (25 + 20)) + 'px';
				el.style.left = (col * (25 + 20)) + 'px';
				if (animate && (!oaat || i == chosen)) {
					el.style.webkitTransform = 'translate(' + (Math.cos(count / 10) * 10) + 'px,' + (Math.sin(count / 10) * 10) + 'px)';
				}
				if (changeColor && (!oaat || i == chosen)) el.style.backgroundColor = 'rgb(0,0,' + (count % 255) + ')';
				frag.appendChild(el);
				if ((i + 1) % cols === 0) ++row;
			}
			
			return frag;
		},
		
		tick: function () {
			var frame = this.generateFrame()
				, root = this.root || (this.root = getRootNode());
			
			root.innerHTML = '';
			root.appendChild(frame);
			
			if (this.rAF) this.job = requestAnimationFrame(this.tick.bind(this));
		}
	});
	
})();
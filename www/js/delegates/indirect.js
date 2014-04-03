(function () {
	
	new Delegate({
		name: 'indirect',
		tick: function () {
			Delegate.prototype.tick.call(this);
			
			var root = getRootNode()
				, pn = root.parentNode
				, count = (++this.counter)
				, content = this.content
				, oaat = this.oneAtATime
				, el;
			
			pn.removeChild(root);
			
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
			
			pn.appendChild(root);
			
			this.next();
		}
	});
	
})();
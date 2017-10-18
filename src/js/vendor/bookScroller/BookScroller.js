function getTranslate(y) {
	return 'translateY(' + y + 'px) translateZ(0)';
}

function parseTranslate(property) {
	var openPar = property.indexOf('(');
	if (openPar < 0) {
		return 0;
	}
	return parseFloat(property.substr(openPar+1));
}

function distance(arr) {
	var x = Math.pow(arr[0] - arr[2], 2);
	var y = Math.pow(arr[1] - arr[3], 2);
	return Math.sqrt(x + y);
}

function midpoint(arr) {
	var coords = {};
	coords.x = (arr[0] + arr[2]) / 2;
	coords.y = (arr[1] + arr[3]) / 2;
	return coords;
}

class BookScroller {
	constructor(node, options) {

		this._inInitContent = false;
		this._node = node;
		this._getBefore = options.before;
		this._getAfter = options.after;
		this._setTop = options.setTop;
		this._scale = 1;
		this._minScale = 0.7;
		this._maxScale = 1.4;

		this._pressed = false;
		this._rect = this._node.getBoundingClientRect();

		this._initTransform();

		//console.log('document:');
		//console.log(document.fonts.ready());
		//console.log('fonts');
		this.initContent(options.node, 0);

		//this._addEvents(node);

	}

	_addEvents(node) {
		if (typeof window.ontouchstart !== 'undefined') {
			node.addEventListener('touchstart', this.tap.bind(this));
			node.addEventListener('touchmove', this.drag.bind(this));
			node.addEventListener('touchend', this.release.bind(this));
		}
		node.addEventListener('mousedown', this.tap.bind(this));
		node.addEventListener('mousemove', this.drag.bind(this));
		node.addEventListener('mouseup', this.release.bind(this));
	}

	_removeEvents(node) {
		if (typeof window.ontouchstart !== 'undefined') {
			node.removeEventListener('touchstart', this.tap.bind(this));
			node.removeEventListener('touchmove', this.drag.bind(this));
			node.removeEventListener('touchend', this.release.bind(this));
		}
		node.removeEventListener('mousedown', this.tap.bind(this));
		node.removeEventListener('mousemove', this.drag.bind(this));
		node.removeEventListener('mouseup', this.release.bind(this));
	}

	_initTransform() {
		var _elementStyle = document.createElement('div').style;
		var _vendor = (function () {
			var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
				transform,
				i = 0,
				l = vendors.length;

			for ( ; i < l; i++ ) {
				transform = vendors[i] + 'ransform';
				if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
			}

			return false;
		})();

		this._transform = (function(style) {
			if ( _vendor === false ) return false;
			if ( _vendor === '' ) return style;
			return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
		})('transform');
	}

	initContent(initialNode, timeout) {

		if (this._inInitContent) {
			return;
		}
		this._inInitContent = true;

		var container = this._node;
		var yNext, childNext, yPrev, childPrev;
		var height = container.getBoundingClientRect().height
		var min = -100;
		var max = 100 + height;
		var transform = this._transform;
		var getBefore = this._getBefore;
		var getAfter = this._getAfter;
		
		var c;
		this._autoScrollEnabled = false;
		this._removeEvents(container);
		while (c = container.firstChild) {
			container.removeChild(c);
		}

		yNext = 0;
		yPrev = 0;
		childNext = initialNode;
		this._elementAtTop = childNext;
		this._setTop(childNext);
		var addEvents = this._addEvents.bind(this);

		if (childNext) {
			//letAddContent = true;
			while ((yNext < max) && childNext) {
				container.insertBefore(childNext, null);
				childNext.style[transform] = getTranslate(yNext);
				yNext += childNext.getBoundingClientRect().height;
				childNext = getAfter(childNext);
			}
			childPrev = getBefore(initialNode);
			while ((yPrev > min) && childPrev) {
				container.insertBefore(childPrev, container.firstChild);
				yPrev -= childPrev.getBoundingClientRect().height;
				childPrev.style[transform] = getTranslate(yPrev);
				childPrev = getBefore(childPrev);
			}
		}
		addEvents(container);
		this._inInitContent = false;
	}

	_ypos(e) {
		// touch event
		if (e.targetTouches && (e.targetTouches.length >= 1)) {
			return e.targetTouches[0].clientY;
		}

		// mouse event
		return e.clientY;
	}

	_getY(node) {
		var transform = node.style[this._transform];
		return parseTranslate(transform);
	}

	_scroll(delta) {
		var childMin=this._node.firstChild, childMax=this._node.lastChild;

		if (delta < 0) {
			var yMin = childMin.getBoundingClientRect().top - this._rect.top;
			//console.log('scroll1:', yMin, delta);
			if (yMin - delta > 0) {
				delta = yMin;
			}
		}

		if (delta > 0) {
			var yMax = childMax.getBoundingClientRect().bottom - this._rect.bottom;
			//console.log('scroll2:', yMax, delta);
			if (yMax - delta < 0) {
				delta = yMax;
			}
		}

		var child = childMin, y;
		while (child) {
			y = this._getY(child);
			y = y - delta;
			child.style[this._transform] = getTranslate(y);
			child = child.nextSibling;
		}
		this._addRemove(delta, childMin, childMax);

		var elementAtTop = document.elementFromPoint((this._rect.right-this._rect.left)/2, this._rect.top + 0.05*window.innerWidth);
		if (elementAtTop != this._elementAtTop) {
			this._elementAtTop = elementAtTop;
			this._setTop(elementAtTop);
			//console.log(elementAtTop);
		}
	}

	_addRemove(delta, childMin, childMax) {
		var min = -100;
		var max = 100 + this._rect.height;
		if (delta > 0.5) {
			var yMin = childMin.getBoundingClientRect().bottom - this._rect.top;
			var yMax = childMax.getBoundingClientRect().bottom - this._rect.top;

			//console.log("yMin:", yMin, "childMin", childMin, "yMax", yMax);
			if (yMax < max) {
				var childNext = this._getAfter(childMax);
				if (childNext) {
					childNext.style[this._transform] = getTranslate(yMax);
					this._node.insertBefore(childNext, null);
				}
			}
			if (yMin < min) {
				this._node.removeChild(childMin);
			}
			return;
		}
		if (delta < -0.5) {
			var yMin = childMin.getBoundingClientRect().top - this._rect.top;
			var yMax = childMax.getBoundingClientRect().top - this._rect.top;

			//console.log("yMin:", yMin, "childMin", childMin, "yMax", yMax);
			if (yMin > min) {
				var childPrev = this._getBefore(childMin);
				if (childPrev) {
					this._node.insertBefore(childPrev, childMin);
					var y = yMin - childPrev.getBoundingClientRect().height;
					childPrev.style[this._transform] = getTranslate(y);
				}
			}
			if (yMax > max) {
				this._node.removeChild(childMax);
			}
			return;
		}
	}

	tap(e) {
		//console.log('tap', this, this._transform, this._pressed, e);
		if (e.touches && e.touches.length == 2) {
			this._pinching = true;
			//console.log('TOUCH event:')
			//console.log(JSON.stringify(e.touches));
			var coords = [];
			for(var i = 0, finger; finger = e.touches[i]; i++) {
				coords.push(finger.pageX, finger.pageY);
			}
			this._pinching_distance = distance(coords);
			this._pinching_midpoint = midpoint(coords);
			//console.log("Pinch begin - distance:", this._pinching_midpoint, " midpoint:", this._pinching_midpoint);
		} 

		if (!e.touches || e.touches.length == 1) {
			this._pressed = true;
			this._reference = this._ypos(e);

			this._velocity = 0;
			this._amplitude = 0;
			this._frame = 0;
			this._offset = 0;
			this._timestamp = Date.now();
			clearInterval(this._ticker);
			this._ticker = setInterval(this.track.bind(this), 10);
		}

		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	track() {
		var now, elapsed, delta, v;

		//console.log('track');
		now = Date.now();
		elapsed = now - this._timestamp;
		this._timestamp = now;
		delta = this._offset - this._frame;
		this._frame = this._offset;

		v = 1000 * delta / (1 + elapsed);
		this._velocity = 0.8 * v + 0.2 * this._velocity;
		//console.log('velocity:', this._velocity);
	}

	doScale(e, e2) {
		//console.log("doScale:", e, e2);
	}

	drag(e) {
		//console.log('drag', this._pressed, e);

		if (e.touches && e.touches.length == 2 && this._pinching) {
			var coords = [];
			for(var i = 0, finger; finger = e.touches[i]; i++) {
				coords.push(finger.pageX, finger.pageY);
			}

			var changed = e.changedTouches;
			var dist = distance(coords);
			var mid = midpoint(coords);

			//console.log(dist, this._pinching_distance, this._scale);
			var scale = dist / this._pinching_distance * this._scale;
			if (scale > this._maxScale) {
				scale = this._maxScale;
			}
			if (scale < this._minScale) {
				scale = this._minScale;
			}
			var e2 = Object.assign({}, e);
			e2.scale = scale;
			e2.x = mid.x;
			e2.y = mid.y;

			this.doScale(e, e2);
			this._lastScale = e2.scale;
		} else {
			var y, delta;
			if (this._pressed) {
				y = this._ypos(e);
				delta = this._reference - y;
				if (delta > 2 || delta < -2) {
					this._reference = y;
					this._offset += delta;
					this._scroll(delta);
				}
			}
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	release(e) {
		if (e.touches && e.touches.length == 2 && this._pinching) {
			this._scale = this._lastScale;
			this._pinching = false;
		} else {
			//console.log('release', this._pressed, e);
			this._pressed = false;
			this._offset = 0;

			clearInterval(this._ticker);
			//console.log(this._velocity);
			if (this._velocity > 10 || this._velocity < -10) {
				this._amplitude = 0.8 * this._velocity;
				//console.log('target:', this._amplitude);
				this._toTarget = -this._amplitude;
				this._timestamp2 = Date.now();
				this._autoScrollEnabled = true;
				requestAnimationFrame(this._autoScroll.bind(this));
			}
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	_autoScroll() {
		var elapsed, delta, toTarget;
		if (this._autoScrollEnabled && this._amplitude) {
			elapsed = Date.now() - this._timestamp2;
			toTarget = -this._amplitude * Math.exp(-elapsed / 325)
			delta = toTarget - this._toTarget;
			this._toTarget = toTarget;
			//console.log('delta:', delta, toTarget);
			if (toTarget > 0.5 || toTarget < -0.5) {
				this._scroll(delta);
				requestAnimationFrame(this._autoScroll.bind(this));
			} else {
				this._scroll(-toTarget);
			}
		}
	}
}
module.exports = BookScroller;
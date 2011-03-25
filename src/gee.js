// ==ClosureCompiler==
// @output_file_name gee.min.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==
window['GEE'] = function(params) {
	
	if ( !params ) {
		params = {};
	}
	
	// Do we support canvas?
	if (!document.createElement('canvas').getContext) {
		if ( params.fallback ) { 
			params.fallback();
		}
		return;
	}	
	
	var _this = this,
		u = undefined, // shorthand,
		k = 1E3,
		f = false,
		_privateParts = 
		{
			'ctx':u,
			'width':u,
			'height':u,
			'frameTime':k/60,
			'frameCount':0,
			'key':u,
			'keyCode':u,
			'mouseX':0,
			'mouseY':0,
			'pmouseX':u,
			'pmouseY':u,
			'mousePressed':f,
			'keyPressed':f
		},
		_actualFrameTime = _privateParts['frameTime'],
		d; // shorthand for the dom element
		
	var getOffset = function() {
		var obj = d;
		var x = 0, y = 0;
		while (obj) {
			y += obj.offsetTop;
			x += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		console.log(x, y);
		offset = {x:x, y:y};
	};
	
	// Default parameters

	if ( !params['context'] ) {
		params['context'] = '2d';
	}
	
	if ( !params['width'] ) {
		params['width'] = 500;
	}
	
	if ( !params['height'] ) {
		params['height'] = 500;
	}
	
	// Create domElement, grab context
	
	d = _this['domElement'] = document.createElement('canvas');
	_privateParts['ctx'] = d.getContext(params['context']);
	
	// Are we capable of this context?
	
	if ( _privateParts['ctx'] == null) {
		if ( params.fallback ) { 
			params.fallback();
		}
		return;
	}
	
	// Set up width and height setters / listeners
	
	if (params['fullscreen']) {

		var onResize = function() {
			getOffset();
			_privateParts['width'] = _this['domElement'].width = window.innerWidth;
			_privateParts['height'] = _this['domElement'].height = window.innerHeight;
		};
		window.addEventListener('resize', onResize, f);
		onResize();
		
		if (!params['container']) {
			params['container'] = document['body'];
		}
		document.body.style.margin = 0;
		document.body.style.padding = 0;
		
	} else { 
		
		getOffset();
		_this.__defineSetter__('width', function(v) {
			_privateParts['width'] = this['domElement']['width'] = v;
		});
		
		_this.__defineSetter__('height', function(v) {
			_privateParts['height'] = this['domElement']['height'] = v;
		});
		
		_this['width'] = params['width'];
		_this['height'] = params['height'];
		
	}
	
	// Put it where we talked about (if we talked about it).
	
	if (params['container']) {
		params['container'].appendChild(d);
		getOffset();
	}	
	
	
	// DO YOU SEE A PATTERN???
	
	var getter = function(n) {
		_this.__defineGetter__(n, function() {
			return _privateParts[n];
		});
	};
	
	// Would love to reduce this to params.
	getter('ctx');
	getter('width');
	getter('height');
	getter('frameTime');
	getter('frameRate');
	getter('frameCount');
	getter('key');
	getter('keyCode');
	getter('mouseX');
	getter('mouseY');
	getter('pmouseX');
	getter('pmouseY');
	getter('mousePressed');
	getter('keyPressed');
	
	_this.__defineGetter__('frameRate', function(v) {
		return k/_actualFrameTime;
	});
	
	// Might as well just work like a getter and setter.
	
	var n = function() {};
	
	_this['loop'] = true;
	_this['keyup'] = n; // TODO
	_this['keydown'] = n; // TODO
	_this['draw'] = n;
	_this['mousedown'] = n;
	_this['mouseup'] = n;
	_this['mousemove'] = n;
	_this['mousedrag'] = n;
	
	// Setters
	
	_this.__defineSetter__('frameTime', function(v) {
		_privateParts['frameTime'] = v;
		_actualFrameTime = v;
	});
	
	_this.__defineSetter__('frameRate', function(v) {
		_privateParts['frameTime'] = k/v;
		_actualFrameTime = k/v;
	});
	
	// Listeners
	
	d.addEventListener('mouseenter', function(e) {
		getOffset();
	}, f);
	
	var mm = function(e) {
		_this['mousemove']();
	};
	
	var mmm = function(e) {
		var x = e.pageX - offset.x;
		var y = e.pageY - offset.y;
		if (_privateParts['pmouseX'] == u) {
			_privateParts['pmouseX'] = x;
			_privateParts['pmouseY'] = y;
		} else { 
			_privateParts['pmouseX'] = _privateParts['mouseX'];
			_privateParts['pmouseY'] = _privateParts['mouseY'];
		}
		_privateParts['mouseX'] = x;
		_privateParts['mouseY'] = y;
	}
	
	d.addEventListener('mousemove', mmm, f);
	d.addEventListener('mousemove', mm, f);
	
	d.addEventListener('mousedown', function() {
		_privateParts['mousePressed'] = true;
		_this['mousedown']();
		d.addEventListener('mousemove', _this['mousedrag'], f);
		d.removeEventListener('mousemove', mm, f);
	}, f);

	d.addEventListener('mouseup', function() {
		_privateParts['mousePressed'] = f;
		_this['mouseup']();
		d['removeEventListener']('mousemove', _this['mousedrag'], f);
		d.addEventListener('mousemove', mm, f);
	}, f);
	
	document.addEventListener('keypressed', function(e) {
		_privateParts['key'] = String.fromCharCode(e.keyCode); // Kinda busted.
		_privateParts['keyCode'] = e.keyCode;
		_privateParts['keyPressed'] = true;
		_this['keydown']();
	}, f);
	
	document.addEventListener('keyup', function(e) {
		_privateParts['key'] = String.fromCharCode(e.keyCode); // Kinda busted.
		_privateParts['keyCode'] = e.keyCode;
		_privateParts['keyPressed'] = f;
		_this['keyup']();
	}, f);
	
	var requestAnimationFrame = (function() {
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function (callback) {
                window.setTimeout(callback, _actualFrameTime);
              };
    })();
		
	_idraw = function() {
	
		if (_this['loop']) {
			requestAnimationFrame( _idraw );
		}
	
		_privateParts['frameCount']++;
		var prev = new Date().getTime();
		
		_this['draw']();
		
		var delta = new Date().getTime() - prev;
		
		if (delta > _privateParts['frameTime']) { 
			_actualFrameTime = delta;
		} else {
			_actualFrameTime = _privateParts['frameTime'];
		}
		
	};
	
	_idraw();
	
}
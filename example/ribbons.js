var ribbons = [];
var physics = new ParticleSystem(-0.03, 0.01);

var updateRibbons = function() {
	physics.tick(1);
	g.ctx.strokeStyle = hsl2rgb(0, 100, 100);
	for (var i = 0; i < ribbons.length; i++) {
		ribbons[i].draw();
	}
}
	var dist = function(a,b,c,d) {
		return Math.sqrt((a-c)*(a-c)+(b-d)*(b-d));
	}

var Ribbon = function(firstX, firstY) {
	
	
	var points = [];
	var springs = [];
	
	this.addPoint = function(x, y) {

		var p = physics.makeParticle(Ribbon.Mass, x, y, 0);
		points.push(p);
		
		if (points.length > 1) {
			var s = physics.makeSpring(p, points[points.length-2], Ribbon.Springiness, 
			Ribbon.Friction, Ribbon.Tightness);
			springs.push(s);
		}
		
	}
	
	this.draw = function() {

		for (var i = 0; i < points.length-1; i++) {
			var x = points[i].position().x();
			var y = points[i].position().y();
				var nx = points[i+1].position().x();
				var ny = points[i+1].position().y();
				g.ctx.beginPath();
				g.ctx.moveTo(x, y);
				g.ctx.lineTo(nx, ny);
				g.ctx.stroke();
		}
		
	}
	
	this.__defineGetter__('latestX', function() {
	if (points.length == 0) return 0;
		return points[points.length-1].position().x();
	});
	this.__defineGetter__('latestY', function() {
		if (points.length == 0) return 0;
		return points[points.length-1].position().y();
	});
		
	ribbons.push(this);
	
}

Ribbon.Mass = 5;
Ribbon.Springiness = 0.2;
Ribbon.Tightness = 1;
Ribbon.Friction = 0.3;

function hsl2rgb(h, s, l) {
	var m1, m2, hue;
	var r, g, b
	s /=100;
	l /= 100;
	if (s == 0)
		r = g = b = (l * 255);
	else {
		if (l <= 0.5)
			m2 = l * (s + 1);
		else
			m2 = l + s - l * s;
		m1 = l * 2 - m2;
		hue = h / 360;
		r = HueToRgb(m1, m2, hue + 1/3);
		g = HueToRgb(m1, m2, hue);
		b = HueToRgb(m1, m2, hue - 1/3);
	}
	return 'rgb('+r+','+g+','+b+')';
}

function HueToRgb(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return 255 * v;
}
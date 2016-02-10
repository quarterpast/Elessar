var $ = require('jquery');
var tape = require('tape');
var raf = require('../lib/raf.js');

$.fn.isAfter = function(el) {
	return $(el).nextAll(this).length > 0;
};

$.fn.isBefore = function(el) {
	return $(el).prevAll(this).length > 0;
};

$.fn.contains = function(el) {
	return this.has(el).length > 0;
};

$.fn.btnClick = function(which) {
	var e = $.Event('mousedown');
	e.which = which || 1;
	this.trigger(e);
}

function waitForAnimation(fn) {
	raf(function() {
		process.nextTick(fn);
	});
}

function move(pos, el) {
	var e = $.Event('mousemove');
	e.clientX = e.pageX = pos.x;
	e.clientY = e.pageY = pos.y;
	$(el || document).trigger(e);
}

function step(steps, cb) {
	if(steps.length) {
		waitForAnimation(function() {
			steps[0]();
			step(steps.slice(1), cb);
		});
	} else {
		cb();
	}
}

var end = tape.Test.prototype.end;
tape.Test.prototype.end = function() {
	$('body').empty().removeClass();
	end.apply(this, arguments);
}

function valuesEqual(a, b) {
	return a.length === b.length && a.every(function(av, i) {
		var bv = b[i];
		return floatEqual(av[0], bv[0]) && floatEqual(av[1], bv[1]);
	});
}

function floatEqual(a, b) {
	return Math.abs(a - b) < 1
}

tape.Test.prototype.rangebarValuesEqual = function(a, b, msg, extra) {
	this._assert(valuesEqual(a, b), {
			message : msg || 'rangebar values should be equal',
			operator : 'equal',
			actual : a,
			expected : b,
			extra : extra
	});
}

tape.Test.prototype.floatEqual = function(a, b, msg, extra) {
	this._assert(floatEqual(a, b), {
			message : msg || 'floats should be equal',
			operator : 'equal',
			actual : a,
			expected : b,
			extra : extra
	});
}

function drag(el, pos, cb) {
	el.mousedown();
	var moves = [];

	if(pos.step) {
		var large = Math.abs(pos.x) > Math.abs(pos.y) ? pos.x : pos.y;
		var xstep = pos.x / large;
		var ystep = pos.y / large;
		var xstart = el.offset().left + (pos.rightEdge ? el.width() : 0);
		var ystart = el.offset().top + (pos.bottomEdge ? el.height() : 0);

		if(large > 0) {
			for(var x = xstart, y = ystart; x < xstart + pos.x || y < ystart + pos.y; x += xstep, y += ystep) {
				moves.push({x: x, y: y});
			}
		} else {
			for(var x = xstart, y = ystart; x > xstart + pos.x || y > ystart + pos.y; x -= xstep, y -= ystep) {
				moves.push({x: x, y: y});
			}
		}
	}

	moves.push({
		x: pos.x + el.offset().left + (pos.rightEdge ? el.width() : 0),
		y: pos.y + el.offset().top + (pos.bottomEdge ? el.height() : 0)
	});

	step(moves.map(function(pos) {
		return function() {
			move(pos);
		};
	}), function() {
		if(!pos.keepMouseDown) {
			var e = $.Event('mouseup');
			e.clientX = moves[moves.length - 1].x;
			e.clientY = moves[moves.length - 1].y;
			el.trigger(e);
		}
		if(cb) cb();
	});
}

module.exports = {
	waitForAnimation: waitForAnimation,
	drag: drag,
	move: move
};

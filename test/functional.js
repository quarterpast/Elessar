var tape = require('tape');
var $ = require('jquery');
var RangeBar = require('../lib/rangebar.js');
var Indicator = require('../lib/indicator.js');
var raf = require('../lib/raf.js');

require('../elessar.css');

$.fn.isAfter = function(el) {
	return $(el).nextAll(this).length > 0;
};

$.fn.isBefore = function(el) {
	return $(el).prevAll(this).length > 0;
};

$.fn.contains = function(el) {
	return this.has(el).length > 0;
};

function waitForAnimation(fn) {
	raf(function() {
		process.nextTick(fn);
	});
}

function move(pos) {
	var e = $.Event('mousemove');
	e.clientX = pos.x;
	e.clientY = pos.y;
	$(document).trigger(e);
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
	$('body').empty();
	end.apply(this, arguments);
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

tape.test('Range bar functional tests', function(t) {
	t.test('dragging', function(t) {
		t.test('to the right', function(t) {
			var r = new RangeBar({values: [[0, 10]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 10, y: 0}, function() {
					t.deepEqual(r.val(), [[10, 20]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to the left', function(t) {
			var r = new RangeBar({values: [[10, 20]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: -10, y: 0}, function() {
					t.deepEqual(r.val(), [[0, 10]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with end', function(t) {
			var r = new RangeBar({values: [[85, 95]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 10, y: 0, step: true}, function() {
					t.deepEqual(r.val(), [[90, 100]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with start', function(t) {
			var r = new RangeBar({values: [[5, 15]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: -10, y: 0, step: true}, function() {
					t.deepEqual(r.val(), [[0, 10]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with another range to the left', function(t) {
			var r = new RangeBar({values: [[5, 15], [20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[1].$el, {x: -10, y: 0, step: true}, function() {
					t.deepEqual(r.val(), [[5, 15],[15,25]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with another range to the right', function(t) {
			var r = new RangeBar({values: [[5, 15], [20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 10, y: 0, step: true}, function() {
					t.deepEqual(r.val(), [[10, 20],[20,30]], 'dragging updates the value');
					t.end();
				});
			});
		});

		t.end();
	});

	t.test('right resizing', function(t) {
		t.test('to the right', function(t) {
			var r = new RangeBar({values: [[0, 10]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: 10, y: 0, rightEdge: true}, function() {
					t.deepEqual(r.val(), [[0, 20]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});
		
		t.test('to the left', function(t) {
			var r = new RangeBar({values: [[0, 20]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: -10, y: 0, rightEdge: true}, function() {
					t.deepEqual(r.val(), [[0, 10]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end', function(t) {
			var r = new RangeBar({values: [[85, 95]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: 10, y: 0, rightEdge: true}, function() {
					t.deepEqual(r.val(), [[85, 100]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.test('to overlap another range', function(t) {
			var r = new RangeBar({values: [[0, 10], [15, 25]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: 10, y: 0, rightEdge: true}, function() {
					t.deepEqual(r.val(), [[0, 15], [15, 25]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the start of the range resizes left', function(t) {
			var r = new RangeBar({values: [[20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: -20, y: 0, rightEdge: true, step: true, keepMouseDown: true}, function() {
					t.deepEqual(r.val(), [[10, 20]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.end();
	});

	t.test('left resizing', function(t) {
		t.test('to the right', function(t) {
			var r = new RangeBar({values: [[0, 20]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: 10, y: 0}, function() {
					t.deepEqual(r.val(), [[10, 20]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});
		
		t.test('to the left', function(t) {
			var r = new RangeBar({values: [[20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: -10, y: 0}, function() {
					t.deepEqual(r.val(), [[10, 30]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end', function(t) {
			var r = new RangeBar({values: [[5, 15]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: -10, y: 0}, function() {
					t.deepEqual(r.val(), [[0, 15]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.test('to overlap another range', function(t) {
			var r = new RangeBar({values: [[0, 10], [15, 25]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[1].$el.find('.elessar-handle:first-child'), {x: -10, y: 0}, function() {
					t.deepEqual(r.val(), [[0, 10], [10, 25]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end of the range resizes right', function(t) {
			var r = new RangeBar({values: [[20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: 20, y: 0, step: true}, function() {
					t.deepEqual(r.val(), [[30, 40]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.end();
	});

	t.end();
});

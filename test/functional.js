var tape = require('tape');
var $ = require('jquery');
var RangeBar = require('../lib/rangebar.js');
var Indicator = require('../lib/indicator.js');
var raf = require('../lib/raf.js');
var utils = require('./utils.js');
var waitForAnimation = utils.waitForAnimation;
var drag = utils.drag;
var move = utils.move;

require('../elessar.css');

tape.test('Range bar functional tests', function(t) {
	t.test('dragging', function(t) {
		t.test('to the right', function(t) {
			var r = new RangeBar({values: [[0, 10]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 10, y: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 20]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to the left', function(t) {
			var r = new RangeBar({values: [[10, 20]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: -10, y: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with end', function(t) {
			var r = new RangeBar({values: [[85, 95]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 10, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[90, 100]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with start', function(t) {
			var r = new RangeBar({values: [[5, 15]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: -10, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with another range to the left', function(t) {
			var r = new RangeBar({values: [[5, 15], [20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[1].$el, {x: -10, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[5, 15],[15,25]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with another range to the right', function(t) {
			var r = new RangeBar({values: [[5, 15], [20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 10, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 20],[20,30]], 'dragging updates the value');
					t.end();
				});
			});
		});

		t.test('past another range to the right', function(t) {
			t.test('swaps the ranges', function(t) {
				var r = new RangeBar({values: [[5, 15], [20, 30]]});
				r.$el.css({width: '100px'}).appendTo('body');
				waitForAnimation(function() {
					drag(r.ranges[0].$el, {x: 50, y: 0, step: true}, function() {
						t.rangebarValuesEqual(r.val(), [[20, 30],[55,65]], 'swaps the ranges');
						t.end();
					});
				});
			});

			t.test('doesn\'t swap if allowSwap is false', function(t) {
				var r = new RangeBar({values: [[5, 15], [20, 30]], allowSwap: false});
				r.$el.css({width: '100px'}).appendTo('body');
				waitForAnimation(function() {
					drag(r.ranges[0].$el, {x: 50, y: 0, step: true}, function() {
						t.rangebarValuesEqual(r.val(), [[10, 20],[20, 30]], 'swaps the ranges');
						t.end();
					});
				});
			});

			t.test('fires the change event once', function(t) {
				t.plan(1);

				var r = new RangeBar({values: [[5, 15], [20, 30]]}), once = true;
				r.$el.css({width: '100px'}).appendTo('body');

				var timeout = setTimeout(function() {
					t.fail('timed out');
				}, 10000);

				r.on('change', function() {
					clearTimeout(timeout);
					t.ok(once, 'fired ' + (once ? '' : 'more than ') + 'once');
					once = false;
				});

				waitForAnimation(function() {
					drag(r.ranges[0].$el, {x: 50, y: 0, step: true});
				});
			});

			t.end();
		});

		t.test('past another range to the left', function(t) {
			t.test('swaps the ranges', function(t) {
				var r = new RangeBar({values: [[20, 30],[55,65]]});
				r.$el.css({width: '100px'}).appendTo('body');
				waitForAnimation(function() {
					drag(r.ranges[1].$el, {x: -50, y: 0, step: true}, function() {
						t.rangebarValuesEqual(r.val(), [[5, 15], [20, 30]], 'swaps the ranges');
						t.end();
					});
				});
			});
			
			t.test('doesn\'t swap if allowSwap is false', function(t) {
				var r = new RangeBar({values: [[20, 30],[55,65]], allowSwap: false});
				r.$el.css({width: '100px'}).appendTo('body');
				waitForAnimation(function() {
					drag(r.ranges[1].$el, {x: -50, y: 0, step: true}, function() {
						t.rangebarValuesEqual(r.val(), [[20, 30],[30, 40]], 'swaps the ranges');
						t.end();
					});
				});
			});

			t.end();
		});

		t.test('past another range to the right and back', function(t) {
			var r = new RangeBar({values: [[5, 15], [20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 50, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[20, 30],[55,65]], 'swaps the ranges');

					waitForAnimation(function() {
						drag(r.ranges[1].$el, {x: -50, y: 0, step: true}, function() {
							t.rangebarValuesEqual(r.val(), [[5, 15], [20, 30]], 'and back');
							t.end();
						});
					});
				});
			});
		});
		
		t.test('past another range to the left and back', function(t) {
			var r = new RangeBar({values: [[20, 30],[55,65]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[1].$el, {x: -50, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[5, 15], [20, 30]], 'swaps the ranges');

					waitForAnimation(function() {
						drag(r.ranges[0].$el, {x: 50, y: 0, step: true}, function() {
							t.rangebarValuesEqual(r.val(), [[20, 30],[55,65]], 'and back');
							t.end();
						});
					});
				});
			});
		});

		t.test('with an upper bound', function(t) {
			var r = new RangeBar({
				values: [[20, 30]],
				bound: function(range) {
					return {upper: 40};
				}
			});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: 20, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[30,40]], 'dragging updates the value');
					t.end();
				});
			});
		})

		t.test('with a lower bound', function(t) {
			var r = new RangeBar({
				values: [[20, 30]],
				bound: function(range) {
					return {lower: 10};
				}
			});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {x: -20, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 20]], 'dragging updates the value');
					t.end();
				});
			});
		});

		t.test('fires change', function(t) {
			t.test('for a range somewhere in the middle', function(t) {
				t.plan(1);
				var r = new RangeBar({values: [[10, 20]]});
				r.$el.css({width: '100px'}).appendTo('body');

				var timeout = setTimeout(function() {
					t.fail('timed out');
				}, 2000);

				r.on('change', function() {
					clearTimeout(timeout);
					t.pass('fires an event');
				});

				waitForAnimation(function() {
					drag(r.ranges[0].$el, {x: 10, y: 0});
				});
			});

			t.test('for a range at the start', function(t) {
				t.plan(1);
				var r = new RangeBar({values: [[0, 10]]});
				r.$el.css({width: '100px'}).appendTo('body');

				var timeout = setTimeout(function() {
					t.fail('timed out');
				}, 2000);

				r.on('change', function() {
					clearTimeout(timeout);
					t.pass('fires an event');
				});

				waitForAnimation(function() {
					drag(r.ranges[0].$el, {x: 10, y: 0});
				});
			});

			t.test('for a range at the end', function(t) {
				t.plan(1);
				var r = new RangeBar({values: [[90, 100]]});
				r.$el.css({width: '100px'}).appendTo('body');

				var timeout = setTimeout(function() {
					t.fail('timed out');
				}, 2000);

				r.on('change', function() {
					clearTimeout(timeout);
					t.pass('fires an event');
				});

				waitForAnimation(function() {
					drag(r.ranges[0].$el, {x: -10, y: 0});
				});
			});

			t.end();
		});

		t.end();
	});

	t.test('right resizing', function(t) {
		t.test('to the right', function(t) {
			var r = new RangeBar({values: [[0, 10]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: 10, y: 0, rightEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 20]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});
		
		t.test('to the left', function(t) {
			var r = new RangeBar({values: [[0, 20]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: -10, y: 0, rightEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end', function(t) {
			var r = new RangeBar({values: [[85, 95]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: 10, y: 0, rightEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[85, 100]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.test('to overlap another range', function(t) {
			var r = new RangeBar({values: [[0, 10], [15, 25]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: 10, y: 0, rightEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 15], [15, 25]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the start of the range', function(t) {
			t.test('resizes left', function(t) {
				var r = new RangeBar({values: [[20, 30]]});
				r.$el.css({width: '100px'}).appendTo('body');
				waitForAnimation(function() {
					drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: -20, y: 0, rightEdge: true, step: true}, function() {
						t.rangebarValuesEqual(r.val(), [[10, 20]], 'dragging right handle updates the value');
						t.end();
					});
				});
			});

			t.test('fires change event once', function(t) {
				t.plan(1);

				var r = new RangeBar({values: [[20, 30]]}), once = true;
				r.$el.css({width: '100px'}).appendTo('body');

				var timeout = setTimeout(function() {
					t.fail('event timed out');
				}, 5000);

				r.on('change', function() {
					t.ok(once, 'fired ' + (once ? '' : 'more than ') + 'once');
					clearTimeout(timeout);
					once = false;
				});

				waitForAnimation(function() {
					drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: -20, y: 0, rightEdge: true, step: true});
				});
			});

			t.end();
		});

		t.test('doesn\'t resize below minimum size', function(t) {
			var r = new RangeBar({values: [[20, 40]], minSize: 10});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: -15, y: 0, rightEdge: true, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[20, 30]], 'dragging right handle updates the value');
					t.end();
				});
			});
		});

		t.test('with an upper bound', function(t) {
			var r = new RangeBar({
				values: [[20, 30]],
				bound: function(range) {
					return {upper: 40};
				}
			});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {x: 20, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[20,40]], 'dragging right handle updates the value');
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
					t.rangebarValuesEqual(r.val(), [[10, 20]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});
		
		t.test('to the left', function(t) {
			var r = new RangeBar({values: [[20, 30]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: -10, y: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 30]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end', function(t) {
			var r = new RangeBar({values: [[5, 15]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: -10, y: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 15]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.test('to overlap another range', function(t) {
			var r = new RangeBar({values: [[0, 10], [15, 25]]});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[1].$el.find('.elessar-handle:first-child'), {x: -10, y: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10], [10, 25]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end of the range', function(t) {
			t.test('resizes right', function(t) {
				var r = new RangeBar({values: [[20, 30]]});
				r.$el.css({width: '100px'}).appendTo('body');
				waitForAnimation(function() {
					drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: 20, y: 0, step: true}, function() {
						t.rangebarValuesEqual(r.val(), [[30, 40]], 'dragging left handle updates the value');
						t.end();
					});
				});
			});

			t.test('fires change event once', function(t) {
				t.plan(1);

				var r = new RangeBar({values: [[20, 30]]}), once = true;
				r.$el.css({width: '100px'}).appendTo('body');

				var timeout = setTimeout(function() {
					t.fail('event timed out');
				}, 5000);

				r.on('change', function() {
					t.ok(once, 'fired ' + (once ? '' : 'more than ') + 'once');
					clearTimeout(timeout);
					once = false;
				});

				waitForAnimation(function() {
					drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: 20, y: 0, rightEdge: true, step: true});
				});
			});

			t.end();
		});

		t.test('doesn\'t resize below minimum size', function(t) {
			var r = new RangeBar({values: [[20, 40]], minSize: 10});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: 15, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[30, 40]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.test('with a lower bound', function(t) {
			var r = new RangeBar({
				values: [[20, 30]],
				bound: function(range) {
					return {lower: 10};
				}
			});
			r.$el.css({width: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {x: -20, y: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[10,30]], 'dragging left handle updates the value');
					t.end();
				});
			});
		});

		t.end();
	});

	t.test('phantoms', function(t) {
		t.test('hovering on a blank area', function(t) {
			var r = new RangeBar();
			r.$el.css({width: '100px'}).appendTo('body');

			waitForAnimation(function() {
				move({
					x: 50,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				waitForAnimation(function() {
					t.ok(
						r.$el.contains('.elessar-phantom'),
						'creates a phantom range'
					);

					t.end();
				});
			});
		});

		t.test('hovering on a range', function(t) {
			var r = new RangeBar({values: [[50, 55]]});
			r.$el.css({width: '100px'}).appendTo('body');

			waitForAnimation(function() {
				move({
					x: 50,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el.find('.elessar-range'));

				waitForAnimation(function() {
					t.ok(
						!r.$el.contains('.elessar-phantom'),
						'doesn\'t create a phantom range'
					);

					t.end();
				});
			});
		});

		t.test('clicking the phantom', function(t) {
			t.test('with no minSize', function(t) {
				var r = new RangeBar();
				r.$el.css({width: '100px'}).appendTo('body');
				move({
					x: r.$el.offset().left + 52.5,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				r.$el.find('.elessar-phantom').btnClick();

				waitForAnimation(function() {
					t.rangebarValuesEqual(
						r.val(),
						[[50,55]],
						'creates a new range'
					);

					r.$el.find('.elessar-phantom').mouseup();
					t.end();
				});
			});

			t.test('after moving a little', function(t) {
				var r = new RangeBar();
				r.$el.css({width: '100px'}).appendTo('body');

				move({
					x: r.$el.offset().left + 52.5,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				waitForAnimation(function() {

					move({
						x: r.$el.offset().left + 54.5,
						y: r.$el.offset().top + r.$el.height() / 2
					}, r.$el.find('.elessar-phantom'));

					waitForAnimation(function() {
						r.$el.find('.elessar-phantom').btnClick();

						waitForAnimation(function() {
							t.rangebarValuesEqual(
								r.val(),
								[[52,57]],
								'moved the phantom with the mouse'
							);

							r.$el.find('.elessar-phantom').mouseup();
							t.end();
						});
					});
				});
			});

			t.test('fires change', function(t) {
				t.plan(1);
				var r = new RangeBar();
				r.$el.css({width: '100px'}).appendTo('body');
				move({
					x: r.$el.offset().left + 52.5,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				var timeout = setTimeout(function() {
					t.fail('timed out');
				}, 2000);

				r.on('change', function() {
					clearTimeout(timeout);
					t.pass('fires an event');
				});

				r.$el.find('.elessar-phantom').btnClick();

				waitForAnimation(function() {
					r.ranges[0].$el.mouseup();
				});
			});
			
			t.test('with a minSize', function(t) {
				var r = new RangeBar({minSize: 10});
				r.$el.css({width: '100px'}).appendTo('body');
				move({
					x: r.$el.offset().left + 55,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				r.$el.find('.elessar-phantom').btnClick();

				waitForAnimation(function() {
					t.rangebarValuesEqual(
						r.val(),
						[[50,60]],
						'creates a new range of the minsize'
					);

					r.$el.find('.elessar-phantom').mouseup();
					t.end();
				});
			});
			
			t.test('next to the end', function(t) {
				var r = new RangeBar();
				r.$el.css({width: '100px'}).appendTo('body');
				move({
					x: r.$el.offset().left + 98,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				r.$el.find('.elessar-phantom').btnClick();

				waitForAnimation(function() {
					t.rangebarValuesEqual(
						r.val(),
						[[95,100]],
						'creates a new range at the end'
					);

					r.$el.find('.elessar-phantom').mouseup();
					t.end();
				});
			});
			
			t.test('next to the start', function(t) {
				var r = new RangeBar();
				r.$el.css({width: '100px'}).appendTo('body');
				move({
					x: r.$el.offset().left + 2,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				r.$el.find('.elessar-phantom').btnClick();

				waitForAnimation(function() {
					t.rangebarValuesEqual(
						r.val(),
						[[0,5]],
						'creates a new range at the start'
					);

					r.$el.find('.elessar-phantom').mouseup();
					t.end();
				});
			});

			t.test('when available space is less than the minsize', function(t) {
				var r = new RangeBar({values: [[0, 10],[12, 22]], minSize: 10});
				r.$el.css({width: '100px'}).appendTo('body');
				move({
					x: r.$el.offset().left + 11,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);

				t.ok(
					!r.$el.contains('.elessar-phantom'),
					'doesn\'t add a phantom'
				);

				t.end();
			});

			t.test('when available space is smaller than default', function(t) {
				var r = new RangeBar({values: [[0, 10],[12, 22]]});
				r.$el.css({width: '100px'}).appendTo('body');
				move({
					x: r.$el.offset().left + 11,
					y: r.$el.offset().top + r.$el.height() / 2
				}, r.$el);


				r.$el.find('.elessar-phantom').btnClick();

				waitForAnimation(function() {
					t.rangebarValuesEqual(
						r.val(),
						[[0, 10],[10,12],[12, 22]],
						'fills the available space'
					);

					r.$el.find('.elessar-phantom').mouseup();
					t.end();
				});
			});


			t.end();
		});

		t.end();
	});

	t.test('vertical dragging', function(t) {
		t.test('downwards', function(t) {
			var r = new RangeBar({vertical: true, values: [[0, 10]]});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {y: 10, x: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 20]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('upwards', function(t) {
			var r = new RangeBar({vertical: true, values: [[10, 20]]});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {y: -10, x: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with end', function(t) {
			var r = new RangeBar({vertical: true, values: [[85, 95]]});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {y: 10, x: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[90, 100]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with start', function(t) {
			var r = new RangeBar({vertical: true, values: [[5, 15]]});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {y: -10, x: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with another range upwards', function(t) {
			var r = new RangeBar({vertical: true, values: [[5, 15], [20, 30]]});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[1].$el, {y: -10, x: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[5, 15],[15,25]], 'dragging updates the value');
					t.end();
				});
			});
		});
		
		t.test('to collide with another range downwards', function(t) {
			var r = new RangeBar({vertical: true, values: [[5, 15], [20, 30]]});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el, {y: 10, x: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 20],[20,30]], 'dragging updates the value');
					t.end();
				});
			});
		});

		t.end();
	});
	
	t.test('bottom resizing', function(t) {
		t.test('downwards', function(t) {
			var r = new RangeBar({values: [[0, 10]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {y: 10, x: 0, bottomEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 20]], 'dragging bottom handle updates the value');
					t.end();
				});
			});
		});
		
		t.test('upwards', function(t) {
			var r = new RangeBar({values: [[0, 20]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {y: -10, x: 0, bottomEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10]], 'dragging bottom handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end', function(t) {
			var r = new RangeBar({values: [[85, 95]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {y: 10, x: 0, bottomEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[85, 100]], 'dragging bottom handle updates the value');
					t.end();
				});
			});
		});

		t.test('to overlap another range', function(t) {
			var r = new RangeBar({values: [[0, 10], [15, 25]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {y: 10, x: 0, bottomEdge: true}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 15], [15, 25]], 'dragging bottom handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the start of the range resizes upwards', function(t) {
			var r = new RangeBar({values: [[20, 30]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {y: -20, x: 0, bottomEdge: true, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 20]], 'dragging bottom handle updates the value');
					t.end();
				});
			});
		});

		t.test('doesn\'t resize below minimum size', function(t) {
			var r = new RangeBar({values: [[20, 40]], minSize: 10, vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:last-child'), {y: -15, x: 0, bottomEdge: true, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[20, 30]], 'dragging bottom handle updates the value');
					t.end();
				});
			});
		});

		t.end();
	});

	t.test('top resizing', function(t) {
		t.test('downwards', function(t) {
			var r = new RangeBar({values: [[0, 20]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {y: 10, x: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 20]], 'dragging top handle updates the value');
					t.end();
				});
			});
		});
		
		t.test('to the top', function(t) {
			var r = new RangeBar({values: [[20, 30]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {y: -10, x: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[10, 30]], 'dragging top handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end', function(t) {
			var r = new RangeBar({values: [[5, 15]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {y: -10, x: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 15]], 'dragging top handle updates the value');
					t.end();
				});
			});
		});

		t.test('to overlap another range', function(t) {
			var r = new RangeBar({values: [[0, 10], [15, 25]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[1].$el.find('.elessar-handle:first-child'), {y: -10, x: 0}, function() {
					t.rangebarValuesEqual(r.val(), [[0, 10], [10, 25]], 'dragging top handle updates the value');
					t.end();
				});
			});
		});

		t.test('beyond the end of the range resizes right', function(t) {
			var r = new RangeBar({values: [[20, 30]], vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {y: 20, x: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[30, 40]], 'dragging top handle updates the value');
					t.end();
				});
			});
		});

		t.test('doesn\'t resize below minimum size', function(t) {
			var r = new RangeBar({values: [[20, 40]], minSize: 10, vertical: true});
			r.$el.css({height: '100px'}).appendTo('body');
			waitForAnimation(function() {
				drag(r.ranges[0].$el.find('.elessar-handle:first-child'), {y: 15, x: 0, step: true}, function() {
					t.rangebarValuesEqual(r.val(), [[30, 40]], 'dragging top handle updates the value');
					t.end();
				});
			});
		});

		t.end();
	});

	t.test('marks', function(t) {
		t.test('behave like labels with count', function(t) {
			var r = new RangeBar({
				bgMark: {
					count: 5
				}
			});
			r.$el.css({width: '100px'}).appendTo('body');

			t.equals(r.$el.find('.elessar-label').length, 5, 'adds `count` marks');

			waitForAnimation(function() {
				r.$el.find('.elessar-label').each(function(i) {
					t.floatEqual($(this).offset().left - r.$el.offset().left, i * 20);
					t.floatEqual(parseFloat($(this).text()), i * 20);
				});

				t.end();
			});
		});

		t.test('labels falls back to marks', function(t) {
			var r = new RangeBar({
				bgLabels: 5
			});
			r.$el.css({width: '100px'}).appendTo('body');

			t.equals(r.$el.find('.elessar-label').length, 5, 'adds `count` marks');

			waitForAnimation(function() {
				r.$el.find('.elessar-label').each(function(i) {
					t.floatEqual($(this).offset().left - r.$el.offset().left, i * 20);
					t.floatEqual(parseFloat($(this).text()), i * 20);
				});

				t.end();
			});
		});

		t.test('interval', function(t) {
			var r = new RangeBar({
				bgMark: { interval: 30 }
			});
			r.$el.css({width: '100px'}).appendTo('body');

			t.equals(r.$el.find('.elessar-label').length, 4, 'adds `(max - min)/interval` marks');

			waitForAnimation(function() {
				r.$el.find('.elessar-label').each(function(i) {
					t.floatEqual($(this).offset().left - r.$el.offset().left, i * 30);
					t.floatEqual(parseFloat($(this).text()), i * 30);
				});

				t.end();
			});
		});

		t.test('string label', function(t) {
			var r = new RangeBar({
				bgMark: {
					count: 5,
					label: 'foo'
				}
			});

			r.$el.find('.elessar-label').each(function(i) {
				t.equal($(this).text(), 'foo');
			});

			t.end();
		});

		t.test('function label', function(t) {
			var r = new RangeBar({
				bgMark: {
					count: 5,
					label: function(val) {
						return 'foo ' + val
					}
				}
			});

			r.$el.find('.elessar-label').each(function(i) {
				t.equal($(this).text(), 'foo ' + (i * 20));
			});

			t.end();
		});



		t.end();
	});

	t.end();
});


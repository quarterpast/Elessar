var tape = require('tape');
var $ = require('jquery');
var RangeBar = require('./lib/rangebar.js');
var Indicator = require('./lib/indicator.js');

tape.test('RangeBar', function(t) {
	var r = new RangeBar();
	t.ok(r.$el, 'has an element');
	t.ok(r.$el.hasClass('elessar-rangebar'), 'has the rangebar class');

	t.test('options', function(t) {
		t.test('sets default options', function(t) {
			var r = new RangeBar();
			t.equal(r.options.min, 0, 'max');
			t.equal(r.options.max, 100, 'min');
			t.equal(r.options.maxRanges, Infinity, 'maxRanges');
			t.equal(r.options.readonly, false, 'readonly');
			t.equal(r.options.bgLabels, 0, 'bgLabels');
			t.equal(r.options.deleteTimeout, 5000, 'deleteTimeout');
			t.equal(r.options.allowDelete, false, 'allowDelete');
			t.end();
		});

		t.test('parses max and min', function(t) {
			var r = new RangeBar({
				min: 'value: 10',
				max: 'value: 20',
				valueFormat: function(v) {
					return 'value: ' + v;
				},
				valueParse: function(v) {
					return +(v.substr(7));
				}
			});

			t.equal(r.options.min, 10);
			t.equal(r.options.max, 20);

			t.end();
		});

		t.test('barClass', function(t) {
			var r = new RangeBar({barClass: 'test-class'});
			t.ok(r.$el.hasClass('test-class'), 'adds options.barClass to the element');
			t.end();
		});

		t.test('values', function(t) {
			var r = new RangeBar({values: [[10, 20], [30, 40]]});
			t.deepEqual(
				r.val(),
				[[10, 20], [30, 40]],
				'sets the initial value'
			);
			t.end();
		});

		t.test('indicator', function(t) {
			var r = new RangeBar({
				indicator: function(rangeBar, indicator, refresh) {
					t.ok(rangeBar instanceof RangeBar, 'gets passed the rangebar');
					t.ok(indicator instanceof Indicator, 'gets passed the indicator');
					t.ok(refresh instanceof Function, 'gets passed a function');

					process.nextTick(function() {
						t.equal(
							indicator.val(),
							rangeBar.abnormalise(10),
							'return value sets the initial value'
						);

						t.end();
					});

					return 10;
				}
			});

			t.ok(r.indicator instanceof Indicator, 'adds an indicator');
		});

		t.end();
	});

	t.test('normalise and abnormalise', function(t) {
		var r = new RangeBar({
			min: 'value: 10',
			max: 'value: 20',
			valueFormat: function(v) {
				return 'value: ' + v;
			},
			valueParse: function(v) {
				return +(v.substr(7));
			}
		});

		t.equal(
			r.normaliseRaw(0.1),
			11,
			'normaliseRaw maps values [0,1] to [min,max]'
		);

		t.equal(
			r.abnormaliseRaw(11),
			0.1,
			'abnormaliseRaw maps values [min,max] to [0,1]'
		);

		t.equal(
			r.normalise(0.1),
			'value: 11',
			'normalise maps and formats values'
		);

		t.equal(
			r.abnormalise('value: 11'),
			0.1,
			'abnormalise parses and maps values'
		);

		t.end();
	});

	t.test('findGap', function(t) {
		var r = new RangeBar();
		r.ranges = [
			{val: function() { return [0.1, 0.2] }},
			{val: function() { return [0.4, 0.5] }},
			{val: function() { return [0.7, 0.8] }}
		];

		t.equal(r.findGap([0, 0.05]), 0);
		t.equal(r.findGap([0.25, 0.3]), 1);
		t.equal(r.findGap([0.55, 0.6]), 2);
		t.equal(r.findGap([0.9, 1]), 3);
		t.end();
	});

	t.end();
});

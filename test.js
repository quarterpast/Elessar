var tape = require('tape');
var $ = require('jquery');
var RangeBar = require('./lib/rangebar.js');

tape.test('RangeBar', function(t) {
	var r = new RangeBar();
	t.ok(r.$el, 'has an element');
	t.ok(r.$el.hasClass('elessar-rangebar'), 'has the rangebar class');
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
	t.end();
});

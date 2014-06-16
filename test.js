var tape = require('tape');
var $ = require('jquery');
var RangeBar = require('./lib/rangebar.js');

tape.test('RangeBar', function(t) {
	t.plan(2);
	var r = new RangeBar();
	t.ok(r.$el, 'has an element');
	t.ok(r.$el.hasClass('elessar-rangebar'), 'has the rangebar class');
});

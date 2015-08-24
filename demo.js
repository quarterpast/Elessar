var RangeBar = require('../');
var $ = require('jquery');
var moment = require('moment');

var r = new RangeBar({
  min: moment().startOf('day').format('LLLL'),
  max: moment().endOf('day').format('LLLL'),
  valueFormat: function(ts) {
    return moment(ts).format('LLLL');
  },
  valueParse: function(date) {
    return moment(date).valueOf();
  },
  values: [
    [
      moment().startOf('day').format('LLLL'),
      moment().startOf('day').add(1, 'hours').format('LLLL')
    ],
    [
      moment().startOf('day').add(1.5, 'hours').format('LLLL'),
      moment().startOf('day').add(3.5, 'hours').format('LLLL')
    ],
  ],
  label: function(a){
    return moment(a[1]).from(a[0], true);
  },
  snap: 1000 * 60 * 15,
  minSize: 1000 * 60 * 60,
  barClass: 'progress',
  rangeClass: 'bar'
});

$('[role=main]').prepend(r.$el).on('changing', function(ev, ranges) {
  $('pre.changing').html('changing '+JSON.stringify(ranges,null,2));
}).on('change', function(ev, ranges) {
  $('pre.changing').after($('<pre>').html('changed '+JSON.stringify(ranges,null,2)));
});

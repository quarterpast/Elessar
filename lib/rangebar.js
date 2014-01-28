var Element = require('./element');
var Range = require('./range');
var Phantom = require('./phantom');
var Indicator = require('./indicator');
var $ = require('jquery');

var RangeBar = Element.extend({
  initialize: function(options) {
    this.super$.initialize.call(this, '<div class="elessar-rangebar">');
    this.options = $.extend({}, RangeBar.defaults, options);
    this.options.min = options.valueParse(options.min);
    this.options.max = options.valueParse(options.max);
    if(this.options.barClass) this.$el.addClass(this.options.barClass);

    this.ranges = [];
    this.on('mousemove', $.proxy(this.mousemove, this));
    this.on('mouseleave', $.proxy(this.removePhantom, this));

    if(options.values) setVal(options.values);

    for(var i = 0; i < options.bgLabels; ++i) {
      this.addLabel(i / options.bgLabels);
    }

    if(options.indicator) {
      var indicator = this.indicator = new Indicator({
        parent: this,
        indicatorClass: options.indicatorClass
      });
      indicator.val(this.abnormalise(options.indicator(this, indicator, function() {
        indicator.val(this.abnormalise(options.indicator(this, indicator)));
      })));
      this.$el.append(indicator);
    }
  },

  normaliseRaw: function (value) {
    return this.options.min + value * (this.options.max - this.options.min);
  },

  normalise: function (value) {
    return this.options.valueFormat(this.normaliseRaw(value));
  },

  abnormaliseRaw: function (value) {
    return (value - this.options.min)/(this.options.max - this.options.min);
  },

  abnormalise: function (value) {
    return this.abnormaliseRaw(this.options.valueParse(value));
  },

  findGap: function(range) {
    var newIndex;
    this.ranges.forEach(function($r, i) {
      if($r.val()[0] < range[0] && $r.val()[1] < range[1]) newIndex = i + 1;
    });

    return newIndex;
  },

  insertRangeIndex: function(range, index, avoidList) {
    if(!avoidList) this.ranges.splice(index, 0, range);

    if(this.ranges[index - 1]) {
      this.ranges[index - 1].after(range);
    } else {
      this.prepend(range);
    }
  },

  addRange: function(range, data) {
    var $range = Range({
      parent: this,
      snap: options.snap ? abnormaliseRaw(options.snap + options.min) : null,
      label: options.label,
      rangeClass: options.rangeClass,
      minSize: options.minSize ? abnormaliseRaw(options.minSize + options.min) : null,
      readonly: options.readonly
    });

    if (options.data) {
      $range.data(options.data.call($range, this));
    }

    if (data) {
      $range.data(data);
    }

    this.insertRangeIndex($range, this.findGap(range));
    $range.val(range);

    $range.on('changing', function(ev, nrange, changed) {
      ev.stopPropagation();
      this.trigger('changing', [this.val(), changed]);
    }).on('change', function(ev, nrange, changed) {
      ev.stopPropagation();
      this.trigger('change', [this.val(), changed]);
    });
    return $range;
  },

  prevRange: function(range) {
    var idx = range.index();
    if(idx >= 0) return this.ranges[idx - 1];
  },

  nextRange: function(range) {
    var idx = range.index();
    if(idx >= 0) return this.ranges[range instanceof Phantom ? idx : idx + 1];
  },

  setVal: function(ranges) {
    if(this.ranges.length > ranges.length) {
      for(var i = ranges.length, l = this.ranges.length; i < l; ++i) {
        this.ranges[i].remove();
      }
      this.ranges.length = ranges.length;
    }

    ranges.forEach(function(range, i) {
      if(this.ranges[i]) {
        this.ranges[i].val(range.map(this.abnormalise));
      } else {
        this.addRange(range.map(this.abnormalise));
      }
    });

    return this;
  },

  val: function(ranges) {
    if(typeof ranges === 'undefined') {
      return this.ranges.map(function(range) {
        return range.val().map(this.normalise);
      });
    }

    if(!options.readonly) setVal(ranges);
    return this;
  },

  removePhantom: function() {
    if(this.phantom) {
      this.phantom.remove();
      this.phantom = null;
    }
  },

  calcGap: function(index) {
    var start = this.ranges[index - 1] ? this.ranges[index - 1].val()[1] : 0;
    var end = this.ranges[index] ? this.ranges[index].val()[0] : 1;
    return normaliseRaw(end) - normaliseRaw(start);
  },

  addLabel: function(pos) {
    var cent = pos * 100, val = this.normalise(pos);
    var $el = $('<span class="elessar-label">').css('left', cent+'%').text(val);
    if(1 - pos < 0.05) {
      $el.css({
        left: '',
        right: 0
      });
    }
    return $el.appendTo(this.$el);
  },

  mousemove: function(ev) {
    var w = options.minSize ? abnormaliseRaw(options.minSize + options.min) : 0.05;
    var val = (ev.pageX - this.offset().left)/this.width() - w/2;
    if(ev.target === ev.currentTarget && this.ranges.length < options.maxRanges && !$('body').is('.elessar-dragging, .elessar-resizing') && !options.readonly) {
      if(!this.phantom) this.phantom = Range({
        parent: this,
        snap: options.snap ? abnormaliseRaw(options.snap + options.min) : null,
        label: "+",
        minSize: options.minSize ? abnormaliseRaw(options.minSize + options.min) : null,
        rangeClass: options.rangeClass,
        phantom: true
      });
      var idx = this.findGap([val,val + w]);

      if(!options.minSize || this.calcGap(idx) >= options.minSize) {
        this.insertRangeIndex(this.phantom, idx, true);
        this.phantom.val([val,val + w], {trigger: false});
      }
    }
  }
}, {
  defaults: {
    min: 0,
    max: 100,
    valueFormat: function(a) {return a;},
    valueParse: function(a) {return a;},
    maxRanges: Infinity,
    readonly: false,
    bgLabels: 0
  },
});

module.exports = RangeBar;
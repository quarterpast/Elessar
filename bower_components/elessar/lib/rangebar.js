var Element = require('./element');
var Range = require('./range');
var Phantom = require('./phantom');
var Indicator = require('./indicator');
var getEvtX = require('./evtx');
var $ = require('jquery');

class RangeBar extends Element {
  constructor(options) {
    super('<div class="elessar-rangebar">');
    this.options = $.extend({}, RangeBar.defaults, options);
    this.options.min = options.valueParse(options.min);
    this.options.max = options.valueParse(options.max);
    if(this.options.barClass) this.$el.addClass(this.options.barClass);

    this.ranges = [];
    this.on('mousemove touchmove', $.proxy(this.mousemove, this));
    this.on('mouseleave touchleave', $.proxy(this.removePhantom, this));

    if(options.values) this.setVal(options.values);

    for(var i = 0; i < options.bgLabels; ++i) {
      this.addLabel(i / options.bgLabels);
    }
    var self = this;

    if(options.indicator) {
      var indicator = this.indicator = new Indicator({
        parent: this,
        indicatorClass: options.indicatorClass
      });
      indicator.val(this.abnormalise(options.indicator(this, indicator, function() {
        indicator.val(self.abnormalise(options.indicator(self, indicator)));
      })));
      this.$el.append(indicator.$el);
    }
  }

  normaliseRaw (value) {
    return this.options.min + value * (this.options.max - this.options.min);
  }

  normalise (value) {
    return this.options.valueFormat(this.normaliseRaw(value));
  }

  abnormaliseRaw (value) {
    return (value - this.options.min)/(this.options.max - this.options.min);
  }

  abnormalise (value) {
    return this.abnormaliseRaw(this.options.valueParse(value));
  }

  findGap(range) {
    var newIndex;
    this.ranges.forEach(function($r, i) {
      if($r.val()[0] < range[0] && $r.val()[1] < range[1]) newIndex = i + 1;
    });

    return newIndex;
  }

  insertRangeIndex(range, index, avoidList) {
    if(!avoidList) this.ranges.splice(index, 0, range);

    if(this.ranges[index - 1]) {
      this.ranges[index - 1].$el.after(range.$el);
    } else {
      this.$el.prepend(range.$el);
    }
  }

  addRange(range, data) {
    var $range = new Range({
      parent: this,
      snap: this.options.snap ? this.abnormaliseRaw(this.options.snap + this.options.min) : null,
      label: this.options.label,
      rangeClass: this.options.rangeClass,
      minSize: this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : null,
      readonly: this.options.readonly
    });

    if (this.options.data) {
      $range.data(this.options.data.call($range, this));
    }

    if (data) {
      $range.data(data);
    }

    this.insertRangeIndex($range, this.findGap(range));
    $range.val(range);

    var self = this;

    $range.on('changing', function(ev, nrange, changed) {
      ev.stopPropagation();
      self.trigger('changing', [self.val(), changed]);
    }).on('change', function(ev, nrange, changed) {
      ev.stopPropagation();
      self.trigger('change', [self.val(), changed]);
    });
    return $range;
  }

  prevRange(range) {
    var idx = range.index();
    if(idx >= 0) return this.ranges[idx - 1];
  }

  nextRange(range) {
    var idx = range.index();
    if(idx >= 0) return this.ranges[range instanceof Phantom ? idx : idx + 1];
  }

  setVal(ranges) {
    if (this.ranges.length > ranges.length) {
      for (var i = ranges.length-1, l = this.ranges.length-1; i < l; --l) {
        this.removeRange(l);
      }
      this.ranges.length = ranges.length;
    }

    var self = this;

    ranges.forEach(function(range, i) {
      if(self.ranges[i]) {
        self.ranges[i].val(range.map($.proxy(self.abnormalise, self)));
      } else {
        self.addRange(range.map($.proxy(self.abnormalise, self)));
      }
    });

    return this;
  }

  val(ranges) {
    var self = this;
    if(typeof ranges === 'undefined') {
      return this.ranges.map(function(range) {
        return range.val().map($.proxy(self.normalise, self));
      });
    }

    if(!this.options.readonly) this.setVal(ranges);
    return this;
  }

  removePhantom() {
    if(this.phantom) {
      this.phantom.remove();
      this.phantom = null;
    }
  }

  removeRange(i) {
    if(i instanceof Range) {
      i = this.ranges.indexOf(i);
    }
    this.ranges.splice(i,1)[0].remove();
    this.trigger('change', [this.val()]);
  }

  calcGap(index) {
    var start = this.ranges[index - 1] ? this.ranges[index - 1].val()[1] : 0;
    var end = this.ranges[index] ? this.ranges[index].val()[0] : 1;
    return this.normaliseRaw(end) - this.normaliseRaw(start);
  }

  addLabel(pos) {
    var cent = pos * 100, val = this.normalise(pos);
    var $el = $('<span class="elessar-label">').css('left', cent+'%').text(val);
    if(1 - pos < 0.05) {
      $el.css({
        left: '',
        right: 0
      });
    }
    return $el.appendTo(this.$el);
  }

  mousemove(ev) {
    var w = this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : 0.05;
    var val = (getEvtX('pageX', ev) - this.$el.offset().left)/this.$el.width() - w/2;
    if(ev.target === ev.currentTarget && this.ranges.length < this.options.maxRanges && !$('body').is('.elessar-dragging, .elessar-resizing') && !this.options.readonly) {
      if(!this.phantom) this.phantom = new Phantom({
        parent: this,
        snap: this.options.snap ? this.abnormaliseRaw(this.options.snap + this.options.min) : null,
        label: "+",
        minSize: this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : null,
        rangeClass: this.options.rangeClass
      });
      var idx = this.findGap([val,val + w]);

      if(!this.options.minSize || this.calcGap(idx) >= this.options.minSize) {
        this.insertRangeIndex(this.phantom, idx, true);
        this.phantom.val([val,val + w], {trigger: false});
      }
    }
  }
}

RangeBar.defaults = {
  min: 0,
  max: 100,
  valueFormat(a) {return a;},
  valueParse(a) {return a;},
  maxRanges: Infinity,
  readonly: false,
  bgLabels: 0,
  deleteTimeout: 5000,
  allowDelete: false
};

module.exports = RangeBar;


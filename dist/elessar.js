(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RangeBar = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Base = require('estira');
var $ = (window.$);
var requestAnimationFrame = require('./raf');

var has = Object.prototype.hasOwnProperty;

var Element = Base.extend({
  initialize: function(html) {
    this.$el = $(html);
    this.$data = {};
    this.$el.data('element', this);
  },
  draw: function(css) {
    var self = this;
    if(this.drawing) return this.$el;
    requestAnimationFrame(function() {
      self.drawing = false;
      self.$el.css(css);
    });
    this.drawing = true;
    return this.$el;
  },
  on: function() {
    this.$el.on.apply(this.$el, arguments);
    return this;
  },
  one: function() {
    this.$el.one.apply(this.$el, arguments);
    return this;
  },
  off: function() {
    this.$el.off.apply(this.$el, arguments);
    return this;
  },
  trigger: function() {
    this.$el.trigger.apply(this.$el, arguments);
    return this;
  },
  remove: function() {
    this.$el.remove();
  },
  detach: function() {
    this.$el.detach();
  },
  data: function(key, value) {
    var obj = key;
    if(typeof key === 'string') {
      if(typeof value === 'undefined') {
        return this.$data[key];
      }
      obj = {};
      obj[key] = value;
    }
    $.extend(this.$data, obj);
    return this;
  }
});

module.exports = Element;

},{"./raf":6,"estira":10}],2:[function(require,module,exports){
var has = Object.prototype.hasOwnProperty;

module.exports = function getEventProperty(prop, event) {
  return has.call(event, prop) ? event[prop]
       : event.originalEvent && event.originalEvent.touches ? event.originalEvent.touches[0][prop]
       : undefined;
};

},{}],3:[function(require,module,exports){
var Element = require('./element');
var vertical = require('./vertical');

var Indicator = Element.extend(vertical).extend({
  initialize: function initialize(options) {
    initialize.super$.call(this,'<div class="elessar-indicator">');
    if(options.indicatorClass) this.$el.addClass(options.indicatorClass);
    if(options.value) this.val(options.value);
    this.options = options;
  },

  val: function(pos) {
    if(pos) {
      if(this.isVertical()) {
        this.draw({top: 100*pos + '%'});
      } else {
        this.draw({left: 100*pos + '%'});
      }
      this.value = pos;
    }
    return this.value;
  }
});

module.exports = Indicator;

},{"./element":1,"./vertical":9}],4:[function(require,module,exports){
var Element = require('./element.js');

var Mark = Element.extend({
	initialize: function initialize(options) {
		initialize.super$.call(this, '<div class="elessar-label">');
		this.$el.css(options.perant.edge('start'), (options.value * 100) + '%');
	
		if(typeof options.label === 'function') {
			this.$el.text(options.label.call(this, options.perant.normalise(options.value)));
		} else if(typeof options.label === 'string') {
			this.$el.text(options.label);
		} else {
			this.$el.text(options.perant.normalise(options.value));
		}
	}
});

module.exports = Mark;

},{"./element.js":1}],5:[function(require,module,exports){
var $ = (window.$);
var Range = require('./range');
var requestAnimationFrame = require('./raf');

var Phantom = Range.extend({
  initialize: function initialize(options) {
    initialize.super$.call(this, $.extend({
      readonly: true,
      label: '+'
    }, options));
    this.$el.addClass('elessar-phantom');
    this.on('mousedown.elessar touchstart.elessar', $.proxy(this.mousedown, this));
  },

  mousedown: function(ev) {
    if(ev.which === 1) { // left mouse button
      var startX = ev.pageX;
      var newRange = this.options.perant.addRange(this.val());
      this.remove();
      this.options.perant.trigger('addrange', [newRange.val(), newRange]);
      requestAnimationFrame(function() {
        newRange.$el.find('.elessar-handle:first-child').trigger(ev.type);
      });
    }
  },

  removePhantom: function() {
    // NOOP
  }
});

module.exports = Phantom;

},{"./raf":6,"./range":7}],6:[function(require,module,exports){
// thanks to http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
var lastTime = 0;
var vendors = ['webkit', 'moz'], requestAnimationFrame = window.requestAnimationFrame;
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
}

if (!requestAnimationFrame) {
  requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
    timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}

module.exports = requestAnimationFrame;

},{}],7:[function(require,module,exports){
var $ = (window.$);
var Element = require('./element');
var getEventProperty = require('./eventprop');
var vertical = require('./vertical');

var Range = Element.extend(vertical).extend({
  initialize: function initialize(options) {
    var self = this;
    initialize.super$.call(this,
      '<div class="elessar-range"><span class="elessar-barlabel">'
    );
    this.options = options;
    this.perant = options.perant;

    if(this.options.rangeClass) this.$el.addClass(this.options.rangeClass);

    if(!this.readonly()) {
      this.$el.prepend('<div class="elessar-handle">').append('<div class="elessar-handle">');
      this.on('mouseenter.elessar touchstart.elessar', $.proxy(this.removePhantom, this));
      this.on('mousedown.elessar touchstart.elessar', $.proxy(this.mousedown, this));
      this.on('click', $.proxy(this.click, this));
    } else {
      this.$el.addClass('elessar-readonly');
    }
    if(typeof this.options.label === 'function') {
      this.on('changing', function(ev, range) {
        self.writeLabel(
          self.options.label.call(self, range.map($.proxy(self.perant.normalise, self.perant)))
        );
      });
    } else {
      this.writeLabel(this.options.label);
    }

    this.range = [];
    this.hasChanged = false;

    if(this.options.value) this.val(this.options.value);

  },

  writeLabel: function(text) {
    this.$el.find('.elessar-barlabel')[this.options.htmlLabel ? 'html' : 'text'](text);
  },
  
  isVertical: function() {
    return this.perant.options.vertical;
  },

  removePhantom: function() {
    this.perant.removePhantom();
  },

  readonly: function() {
    if(typeof this.options.readonly === 'function') {
      return this.options.readonly.call(this.perant, this);
    }
    return this.options.readonly;
  },

  val: function(range, valOpts) {

    if(typeof range === 'undefined') {
      return this.range;
    }

    valOpts  = $.extend({},{
      dontApplyDelta: false,
      trigger: true
    }, valOpts || {});

    var next = this.perant.nextRange(this.$el),
    prev = this.perant.prevRange(this.$el),
    delta = range[1] - range[0],
    self = this;

    if(this.options.snap) {
      range = range.map(snap);
      delta = snap(delta);
    }
    if (next && next.val()[0] <= range[1] && prev && prev.val()[1] >= range[0]) {
      range[1] = next.val()[0];
      range[0] = prev.val()[1];
    }
    if (next && next.val()[0] < range[1]) {
      if(!this.perant.options.allowSwap || next.val()[1] >= range[0]) {
        range[1] = next.val()[0];
        if(!valOpts.dontApplyDelta) range[0] = range[1] - delta;
      } else {
        this.perant.repositionRange(this, range);
      }
    }
    if (prev && prev.val()[1] > range[0]) {
      if(!this.perant.options.allowSwap || prev.val()[0] <= range[1]) {
        range[0] = prev.val()[1];
        if(!valOpts.dontApplyDelta) range[1] = range[0] + delta;
      } else {
        this.perant.repositionRange(this, range);
      }
    }
    if (range[1] >= 1) {
      range[1] = 1;
      if(!valOpts.dontApplyDelta) range[0] = 1 - delta;
    }
    if (range[0] <= 0) {
      range[0] = 0;
      if(!valOpts.dontApplyDelta) range[1] = delta;
    }
    if(this.perant.options.bound) {
      var bound = this.perant.options.bound(this);
      if(bound) {
        if(bound.upper && range[1] > this.perant.abnormalise(bound.upper)) {
          range[1] = this.perant.abnormalise(bound.upper);
          if(!valOpts.dontApplyDelta) range[0] = range[1] - delta;
        }
        if(bound.lower && range[0] < this.perant.abnormalise(bound.lower)) {
          range[0] = this.perant.abnormalise(bound.lower);
          if(!valOpts.dontApplyDelta) range[1] = range[0] + delta;
        }
      }
    }

    if(this.range[0] === range[0] && this.range[1] === range[1]) return this.$el;

    this.range = range;

    if(valOpts.trigger) {
      this.$el.triggerHandler('changing', [range, this.$el]);
      this.hasChanged = true;
    }

    var start = 100*range[0] + '%',
        size = 100*(range[1] - range[0]) + '%';

    this.draw(
      this.perant.options.vertical ?
      {top: start, minHeight: size} :
      {left: start, minWidth: size}
    );

    return this;

    function snap(val) { return Math.round(val / self.options.snap) * self.options.snap; }
    function sign(x)   { return x ? x < 0 ? -1 : 1 : 0; }
  },

  click: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    var self = this;

    if(ev.which !== 2 || !this.perant.options.allowDelete) return;

    if(this.deleteConfirm) {
      this.perant.removeRange(this);
      clearTimeout(this.deleteTimeout);
    } else {
      this.$el.addClass('elessar-delete-confirm');
      this.deleteConfirm = true;

      this.deleteTimeout = setTimeout(function() {
        self.$el.removeClass('elessar-delete-confirm');
        self.deleteConfirm = false;
      }, this.perant.options.deleteTimeout);
    }
  },

  mousedown: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.hasChanged = false;
    if(ev.which > 1) return;

    if ($(ev.target).is('.elessar-handle:first-child')) {
      $('body').addClass('elessar-resizing').toggleClass('elessar-resizing-vertical', this.isVertical());
      $(document).on('mousemove.elessar touchmove.elessar', this.resizeStart(ev));
    } else if ($(ev.target).is('.elessar-handle:last-child')) {
      $('body').addClass('elessar-resizing').toggleClass('elessar-resizing-vertical', this.isVertical());
      $(document).on('mousemove.elessar touchmove.elessar', this.resizeEnd(ev));
    } else {
      $('body').addClass('elessar-dragging').toggleClass('elessar-dragging-vertical', this.isVertical());
      $(document).on('mousemove.elessar touchmove.elessar', this.drag(ev));
    }

    var self = this;

    $(document).one('mouseup.elessar touchend.elessar', function(ev) {
      ev.stopPropagation();
      ev.preventDefault();

      if(self.hasChanged && !self.swapping) self.trigger('change', [self.range, self.$el]);
      self.swapping = false;
      $(document).off('mouseup.elessar mousemove.elessar touchend.elessar touchmove.elessar');
      $('body').removeClass('elessar-resizing elessar-dragging elessar-resizing-vertical elessar-dragging-vertical');
    });
  },

  drag: function(origEv) {
    var self = this,
    beginStart = this.startProp('offset'),
    beginPosStart = this.startProp('position'),
    mousePos = getEventProperty(this.ifVertical('clientY','clientX'), origEv),
    mouseOffset = mousePos ? mousePos - beginStart : 0,
    beginSize = this.totalSize(),
    perant = this.options.perant,
    perantStart = perant.startProp('offset'),
    perantSize = perant.totalSize();

    return function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var mousePos = getEventProperty(self.ifVertical('clientY','clientX'), ev);
      if(typeof mousePos !== 'undefined') {
        var start = mousePos - perantStart - mouseOffset;

        if (start >= 0 && start <= perantSize - beginSize) {
          var rangeOffset = start / perantSize - self.range[0];
          self.val([start / perantSize, self.range[1] + rangeOffset]);
        } else {
          mouseOffset = mousePos - self.startProp('offset');
        }
      }
    };
  },
  resizeEnd: function(origEv) {
    var self = this,
    beginStart = this.startProp('offset'),
    beginPosStart = this.startProp('position'),
    mousePos = getEventProperty(this.ifVertical('clientY','clientX'), origEv),
    mouseOffset = mousePos ? mousePos - beginStart : 0,
    beginSize = this.totalSize(),
    perant = this.options.perant,
    perantStart = perant.startProp('offset'),
    perantSize = perant.totalSize(),
    minSize = this.options.minSize * perantSize;

    return function(ev) {
      var opposite = ev.type === 'touchmove' ? 'touchend' : 'mouseup',
      subsequent = ev.type === 'touchmove' ? 'touchstart' : 'mousedown';
      ev.stopPropagation();
      ev.preventDefault();
      var mousePos = getEventProperty(self.ifVertical('clientY','clientX'), ev);
      var size = mousePos - beginStart;

      if(typeof mousePos !== 'undefined') {
        if (size > perantSize - beginPosStart) size = perantSize - beginPosStart;
        if (size >= minSize) {
          self.val([self.range[0], self.range[0] + size / perantSize], {dontApplyDelta: true});
        } else if(size <= 10) {
          self.swapping = true;
          $(document).trigger(opposite + '.elessar');
          self.$el.find('.elessar-handle:first-child').trigger(subsequent + '.elessar');
        }
      }
    };
  },

  resizeStart: function(origEv) {
    var self = this,
    beginStart = this.startProp('offset'),
    beginPosStart = this.startProp('position'),
    mousePos = getEventProperty(this.ifVertical('clientY','clientX'), origEv),
    mouseOffset = mousePos ? mousePos - beginStart : 0,
    beginSize = this.totalSize(),
    perant = this.options.perant,
    perantStart = perant.startProp('offset'),
    perantSize = perant.totalSize(),
    minSize = this.options.minSize * perantSize;

    return function(ev) {
      var opposite = ev.type === 'touchmove' ? 'touchend' : 'mouseup',
      subsequent = ev.type === 'touchmove' ? 'touchstart' : 'mousedown';

      ev.stopPropagation();
      ev.preventDefault();
      var mousePos = getEventProperty(self.ifVertical('clientY','clientX'), ev);
      var start = mousePos - perantStart - mouseOffset;
      var size = beginPosStart + beginSize - start;

      if(typeof mousePos !== 'undefined') {
        if (start < 0) {
          start = 0;
          size = beginPosStart + beginSize;
        }
        if (size >= minSize) {
          self.val([start / perantSize, self.range[1]], {dontApplyDelta: true});
        } else if(size <= 10) {
          self.swapping = true;
          $(document).trigger(opposite + '.elessar');
          self.$el.find('.elessar-handle:last-child').trigger(subsequent + '.elessar');
        }
      }
    };
  }
});

module.exports = Range;


},{"./element":1,"./eventprop":2,"./vertical":9}],8:[function(require,module,exports){
var Element = require('./element');
var Range = require('./range');
var Phantom = require('./phantom');
var Indicator = require('./indicator');
var getEventProperty = require('./eventprop');
var vertical = require('./vertical');
var $ = (window.$);
var Mark = require('./mark.js');

var RangeBar = Element.extend(vertical).extend({
  initialize: function initialize(options) {
    options = options || {};
    initialize.super$.call(this, '<div class="elessar-rangebar">');
    this.options = $.extend({}, RangeBar.defaults, options);
    this.options.min = this.options.valueParse(this.options.min);
    this.options.max = this.options.valueParse(this.options.max);
    if(this.options.barClass) this.$el.addClass(this.options.barClass);
    if(this.options.vertical) this.$el.addClass('elessar-vertical');

    this.ranges = [];
    this.on('mousemove.elessar touchmove.elessar', $.proxy(this.mousemove, this));
    this.on('mouseleave.elessar touchleave.elessar', $.proxy(this.removePhantom, this));

    if(options.values) this.setVal(options.values);

    if(options.bgLabels) {
      options.bgMark = { count: options.bgLabels };
    }

    if(options.bgMark) {
      this.$markContainer = $('<div class="elessar-labels">').appendTo(this.$el);
      if(options.bgMark.count) {
        for(var i = 0; i < options.bgMark.count; ++i) {
          this.$markContainer.append((new Mark({
            label: options.bgMark.label,
            value: i / options.bgMark.count,
            perant: this
          })).$el);
        }
      } else if(options.bgMark.interval) {
        for(var i = this.abnormalise(this.options.min); i < this.abnormalise(this.options.max); i += this.abnormalise(options.bgMark.interval)) {
          this.$markContainer.append((new Mark({
            label: options.bgMark.label,
            value: i,
            perant: this
          })).$el);
        }
      }
    }

    var self = this;

    if(options.indicator) {
      var indicator = this.indicator = new Indicator({
        perant: this,
        vertical: this.options.vertical,
        indicatorClass: options.indicatorClass
      });
      indicator.val(this.abnormalise(options.indicator(this, indicator, function() {
        indicator.val(self.abnormalise(options.indicator(self, indicator)));
      })));
      this.$el.append(indicator.$el);
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
    var newIndex = 0;
    this.ranges.forEach(function($r, i) {
      if($r.val()[0] < range[0] && $r.val()[1] < range[1]) newIndex = i + 1;
    });

    return newIndex;
  },

  insertRangeIndex: function(range, index, avoidList) {
    if(!avoidList) this.ranges.splice(index, 0, range);

    if(this.ranges[index - 1]) {
      this.ranges[index - 1].$el.after(range.$el);
    } else {
      this.$el.prepend(range.$el);
    }
  },

  addRange: function(range, data) {
    var $range = Range({
      perant: this,
      snap: this.options.snap ? this.abnormaliseRaw(this.options.snap + this.options.min) : null,
      label: this.options.label,
      rangeClass: this.options.rangeClass,
      minSize: this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : null,
      readonly: this.options.readonly,
      htmlLabel: this.options.htmlLabel
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
  },

  val: function(ranges) {
    var self = this;
    if(typeof ranges === 'undefined') {
      return this.ranges.map(function(range) {
        return range.val().map($.proxy(self.normalise, self));
      });
    }

    if(!this.readonly()) this.setVal(ranges);
    return this;
  },

  removePhantom: function() {
    if(this.phantom) {
      this.phantom.remove();
      this.phantom = null;
    }
  },

  removeRange: function(i, noTrigger, preserveEvents) {
    if(i instanceof Range) {
      i = this.ranges.indexOf(i);
    }
    this.ranges.splice(i,1)[0][preserveEvents ? 'detach' : 'remove']();
    if(!noTrigger) {
      this.trigger('change', [this.val()]);
    }
  },

  repositionRange: function(range, val) {
    this.removeRange(range, true, true);
    this.insertRangeIndex(range, this.findGap(val));
  },

  calcGap: function(index) {
    var start = this.ranges[index - 1] ? this.ranges[index - 1].val()[1] : 0;
    var end = this.ranges[index] ? this.ranges[index].val()[0] : 1;
    return this.normaliseRaw(end) - this.normaliseRaw(start);
  },

  readonly: function() {
    if(typeof this.options.readonly === 'function') {
      return this.options.readonly.call(this);
    }
    return this.options.readonly;
  },

  mousemove: function(ev) {
    var w = this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : 0.05;
    var pageStart = getEventProperty(this.ifVertical('pageY','pageX'), ev);
    var val = (pageStart - this.startProp('offset'))/this.totalSize() - w/2;

    var direct = ev.target === ev.currentTarget;
    var phantom = $(ev.target).is('.elessar-phantom');

    if((direct || phantom) && this.ranges.length < this.options.maxRanges && !$('body').is('.elessar-dragging, .elessar-resizing') && !this.readonly()) {
      if(!this.phantom) this.phantom = Phantom({
        perant: this,
        snap: this.options.snap ? this.abnormaliseRaw(this.options.snap + this.options.min) : null,
        label: "+",
        minSize: this.options.minSize ? this.abnormaliseRaw(this.options.minSize + this.options.min) : null,
        rangeClass: this.options.rangeClass
      });
      var idx = this.findGap([val,val + w]);
      var self = this;
      this.one('addrange', function(ev, val, range) {
        range.one('mouseup', function() {
          self.trigger('change', [self.val(), range]);
        });
      });

      if(!this.options.minSize || this.calcGap(idx) >= this.options.minSize) {
        this.insertRangeIndex(this.phantom, idx, true);
        this.phantom.val([val,val + w], {trigger: false});
      }
    }
  }
});

RangeBar.defaults = {
  min: 0,
  max: 100,
  valueFormat: function (a) {return a;},
  valueParse: function (a) {return a;},
  maxRanges: Infinity,
  readonly: false,
  bgLabels: 0,
  deleteTimeout: 5000,
  allowDelete: false,
  vertical: false,
  htmlLabel: false,
  allowSwap: true
};

module.exports = RangeBar;

},{"./element":1,"./eventprop":2,"./indicator":3,"./mark.js":4,"./phantom":5,"./range":7,"./vertical":9}],9:[function(require,module,exports){
module.exports = {
	isVertical: function() {
		return this.options.vertical;
	},
	
	ifVertical: function(v, h) {
    return this.isVertical() ? v : h;
  },
	edge: function(which) {
		if(which === 'start') {
			return this.ifVertical('top', 'left');
		} else if(which === 'end') {
			return this.ifVertical('bottom', 'right');
		}
		throw new TypeError('What kind of an edge is ' + which);
  },
  totalSize: function() {
    return this.$el[this.ifVertical('height','width')]();
  },
	edgeProp: function(edge, prop) {
		var o = this.$el[prop]();
		return o[this.edge(edge)];
	},
	startProp: function(prop) {
		return this.edgeProp('start', prop);
	},
	endProp: function(prop) {
		return this.edgeProp('end', prop);
	}
};

},{}],10:[function(require,module,exports){
(function(){
  (function(definition){
    switch (false) {
    case !(typeof define === 'function' && define.amd != null):
      return define([], definition);
    case typeof exports !== 'object':
      return module.exports = definition();
    default:
      return this.Base = definition();
    }
  })(function(){
    var Base;
    return Base = (function(){
      Base.displayName = 'Base';
      var attach, prototype = Base.prototype, constructor = Base;
      attach = function(obj, name, prop, super$, superclass$){
        return obj[name] = typeof prop === 'function' ? import$(function(){
          var this$ = this;
          prop.superclass$ = superclass$;
          prop.super$ = function(){
            return super$.apply(this$, arguments);
          };
          return prop.apply(this, arguments);
        }, prop) : prop;
      };
      Base.extend = function(displayName, proto){
        proto == null && (proto = displayName);
        return (function(superclass){
          var name, ref$, prop, prototype = extend$(import$(constructor, superclass), superclass).prototype;
          import$(constructor, Base);
          if (typeof displayName === 'string') {
            constructor.displayName = displayName;
          }
          function constructor(){
            var this$ = this instanceof ctor$ ? this : new ctor$;
            this$.initialize.apply(this$, arguments);
            return this$;
          } function ctor$(){} ctor$.prototype = prototype;
          prototype.initialize = function(){
            if (superclass.prototype.initialize != null) {
              return superclass.prototype.initialize.apply(this, arguments);
            } else {
              return superclass.apply(this, arguments);
            }
          };
          for (name in ref$ = proto) {
            prop = ref$[name];
            attach(prototype, name, prop, prototype[name], superclass);
          }
          return constructor;
        }(this));
      };
      Base.meta = function(meta){
        var name, prop;
        for (name in meta) {
          prop = meta[name];
          attach(this, name, prop, this[name], this);
        }
        return this;
      };
      prototype.initialize = function(){};
      function Base(){}
      return Base;
    }());
  });
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
}).call(this);

},{}]},{},[8])(8)
});
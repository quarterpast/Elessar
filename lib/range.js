var $ = require('jquery');
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
    mousePos = getEventProperty(this.ifVertical('clientY','clientX'), origEv);
    mouseOffset = mousePos ? mousePos - beginStart : 0,
    beginSize = this.totalSize(),
    perant = this.options.perant,
    perantStart = perant.startProp('offset'),
    perantSize = perant.totalSize();

    return function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var mousePos = getEventProperty(self.ifVertical('clientY','clientX'), ev);
      if(mousePos) {
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

      if(mousePos) {
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

      if(mousePos) {
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


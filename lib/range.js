var $ = require('jquery');
var Element = require('./element');
require('es5-shim');

var Range = Element.extend(
  function initialize(options) {
    var self = this;
    initialize.super$.call(this,
      '<div class="elessar-range"><span class="elessar-barlabel">'
    );
    this.options = options;
    this.parent = options.parent;

    if(this.options.rangeClass) this.$el.addClass(this.options.rangeClass);

    if(!this.options.readonly) {
      this.$el.prepend('<div class="elessar-handle">').append('<div class="elessar-handle">');
    } else {
      this.$el.addClass('elessar-readonly');
    }
    if(typeof this.options.label === 'function') {
      this.on('changing', function(ev, range) {
        self.$el.find('.elessar-barlabel').text(
          self.options.label.call(self, range.map($.proxy(self.parent.normalise, self.parent)))
        );
      });
    } else {
      this.$el.find('.elessar-barlabel').text(this.options.label);
    }

    this.range = [];
    this.hasChanged = false;

    if(this.options.value) this.val(this.options.value);

  },

  function val(range, valOpts) {
    if(typeof range === 'undefined') {
      return this.range;
    }

    valOpts  = $.extend({},{
      dontApplyDelta: false,
      trigger: true
    }, valOpts || {});

    var next = this.parent.nextRange(this.$el),
    prev = this.parent.prevRange(this.$el),
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
      range[1] = next.val()[0];
      if(!valOpts.dontApplyDelta) range[0] = range[1] - delta;
    }
    if (prev && prev.val()[1] > range[0]) {
      range[0] = prev.val()[1];
      if(!valOpts.dontApplyDelta) range[1] = range[0] + delta;
    }
    if (range[1] >= 1) {
      range[1] = 1;
      if(!valOpts.dontApplyDelta) range[0] = 1 - delta;
    }
    if (range[0] <= 0) {
      range[0] = 0;
      if(!valOpts.dontApplyDelta) range[1] = delta;
    }

    if(this.options.minSize && range[1] - range[0] < this.options.minSize) {
      range[1] = range[0] + this.options.minSize;
    }

    if(this.range[0] === range[0] && this.range[1] === range[1]) return this.$el;

    this.range = range;
    if(valOpts.trigger) {
      this.$el.triggerHandler('changing', [range, this.$el]);
      hasChanged = true;
    }

    this.draw({
      left: 100*range[0] + '%',
      minWidth: 100*(range[1] - range[0]) + '%'
    });

    return this;

    function snap(val) { return Math.round(val / self.options.snap) * self.options.snap; }
    function sign(x)   { return x ? x < 0 ? -1 : 1 : 0; }
  },

  function mousedown(ev) {
    this.hasChanged = false;
    if('which' in ev && ev.which !== 1) return;

    if ($(ev.target).is('.elessar-handle:first-child')) {
      $('body').addClass('elessar-resizing');
      $(document).on('mousemove', this.resizeLeft.bind(this));
    } else if ($(ev.target).is('.elessar-handle:last-child')) {
      $('body').addClass('elessar-resizing');
      $(document).on('mousemove', this.resizeRight.bind(this));
    } else {
      $('body').addClass('elessar-dragging');
      $(document).on('mousemove', this.drag.bind(this));
    }

    var startLeft = this.$el.offset().left,
    startPosLeft = this.$el.position().left,
    mouseOffset = ev.clientX ? ev.clientX - this.$el.offset().left : 0,
    startWidth = this.$el.width(),
    parent = this.options.parent,
    parentOffset = parent.offset(),
    parentWidth = parent.width();

    $(document).on('mouseup', function() {
      if(hasChanged) this.$el.trigger('change', [this.range, this.$el]);
      $(this).off('mouseup mousemove');
      $('body').removeClass('elessar-resizing elessar-dragging');
    });
  },

  function drag(ev) {
    var left = ev.clientX - parentOffset.left - mouseOffset;

    if (left >= 0 && left <= parentWidth - this.$el.width()) {
      var rangeOffset = left / parentWidth - this.range[0];
      this.$el.val([left / parentWidth, this.range[1] + rangeOffset]);
    } else {
      mouseOffset = ev.clientX - this.$el.offset().left;
    }
  },

  function resizeRight(ev) {
    var width = ev.clientX - startLeft;

    if (width > parentWidth - startPosLeft) width = parentWidth - startPosLeft;
    if (width >= 10) {
      this.$el.val([this.range[0], this.range[0] + width / parentWidth], {dontApplyDelta: true});
    } else {
      $(document).trigger('mouseup');
      this.$el.find('.elessar-handle:first-child').trigger('mousedown');
    }
  },

  function resizeLeft(ev) {
    var left = ev.clientX - parentOffset.left - mouseOffset;
    var width = startPosLeft + startWidth - left;

    if (left < 0) {
      left = 0;
      width = startPosLeft + startWidth;
    }
    if (width >= 10) {
      this.$el.val([left / parentWidth, this.range[1]], {dontApplyDelta: true});
    } else {
      $(document).trigger('mouseup');
      this.$el.find('.elessar-handle:last-child').trigger('mousedown');
    }
  }
);

module.exports = Range;

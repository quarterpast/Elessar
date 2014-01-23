var $ = require('jquery');
var Element = require('./element');
require('es5-shim');

var Range = Element.extend({
  initialize: function(options) {
    var self = this;
    this.super$.initialize.call(this,
      '<div class="elessar-range"><span class="elessar-barlabel">'
    );

    if(options.rangeClass) this.$el.addClass(options.rangeClass);

    if(!options.readonly) {
      this.$el.prepend('<div class="elessar-handle">').append('<div class="elessar-handle">');
    } else {
      this.$el.addClass('elessar-readonly');
    }
    if(typeof options.label === 'function') {
      this.on('changing', function(ev, range) {
        self.$el.find('.elessar-barlabel').text(
          options.label.call(self, range.map(options.parent.normalise))
        );
      });
    } else {
      this.$el.find('.elessar-barlabel').text(options.label);
    }

    this.range = [];
    this.hasChanged = false;

    if(options.value) this.val(options.value);

  },

  val: function(range, valOpts) {
    if(typeof range === 'undefined') {
      return this.range;
    }

    valOpts  = $.extend({},{
      dontApplyDelta: false,
      trigger: true
    }, valOpts || {});

    var next = this.parent.nextRange($el),
    prev = this.parent.prevRange($el),
    delta = range[1] - range[0];

    if(options.snap) {
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

    if(options.minSize && range[1] - range[0] < options.minSize) {
      range[1] = range[0] + options.minSize;
    }

    if($el.range[0] === range[0] && $el.range[1] === range[1]) return $el;

    $el.range = range;
    if(valOpts.trigger) {
      $el.triggerHandler('changing', [range, $el]);
      hasChanged = true;
    }

    this.draw({
      left: 100*range[0] + '%',
      minWidth: 100*(range[1] - range[0]) + '%'
    });

    return this;

    function snap(val) { return Math.round(val / options.snap) * options.snap; }
    function sign(x)   { return x ? x < 0 ? -1 : 1 : 0; }
  },

  mousedown: function(ev) {
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

    var startLeft = $el.offset().left,
    startPosLeft = $el.position().left,
    mouseOffset = ev.clientX ? ev.clientX - $el.offset().left : 0,
    startWidth = $el.width(),
    parent = options.parent,
    parentOffset = parent.offset(),
    parentWidth = parent.width();

    $(document).on('mouseup', function() {
      if(hasChanged) $el.trigger('change', [$el.range, $el]);
      $(this).off('mouseup mousemove');
      $('body').removeClass('elessar-resizing elessar-dragging');
    });
  },

  drag: function(ev) {
    var left = ev.clientX - parentOffset.left - mouseOffset;

    if (left >= 0 && left <= parentWidth - this.$el.width()) {
      var rangeOffset = left / parentWidth - this.$el.range[0];
      this.$el.val([left / parentWidth, this.$el.range[1] + rangeOffset]);
    } else {
      mouseOffset = ev.clientX - this.$el.offset().left;
    }
  },

  resizeRight: function(ev) {
    var width = ev.clientX - startLeft;

    if (width > parentWidth - startPosLeft) width = parentWidth - startPosLeft;
    if (width >= 10) {
      $el.val([$el.range[0], $el.range[0] + width / parentWidth], {dontApplyDelta: true});
    } else {
      $(document).trigger('mouseup');
      $el.find('.elessar-handle:first-child').trigger('mousedown');
    }
  },

  resizeLeft: function(ev) {
    var left = ev.clientX - parentOffset.left - mouseOffset;
    var width = startPosLeft + startWidth - left;

    if (left < 0) {
      left = 0;
      width = startPosLeft + startWidth;
    }
    if (width >= 10) {
      $el.val([left / parentWidth, $el.range[1]], {dontApplyDelta: true});
    } else {
      $(document).trigger('mouseup');
      $el.find('.elessar-handle:last-child').trigger('mousedown');
    }
  }
});

function Range(options) {

  if(!options.readonly) {
    if(!options.phantom) {

      $el.on('mouseenter', function(ev) {
        options.parent.removePhantom();
      }).on('mousedown', );
    } else {
      $el.on('mousedown', );
    }
  }
  return $el;
}

module.exports = Range;

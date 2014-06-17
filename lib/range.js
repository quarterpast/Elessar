var $ = require('jquery');
var Element = require('./element');
var getEvtX = require('./evtx');
require('es5-shim');

class Range extends Element {
  constructor(options) {
    super('<div class="elessar-range"><span class="elessar-barlabel">');
    this.options = options;
    this.parent = options.parent;

    if(this.options.rangeClass) this.$el.addClass(this.options.rangeClass);

    if(!this.options.readonly) {
      this.$el.prepend('<div class="elessar-handle">').append('<div class="elessar-handle">');
      this.on('mouseenter touchstart', $.proxy(this.removePhantom, this));
      this.on('mousedown touchstart', $.proxy(this.mousedown, this));
      this.on('click', $.proxy(this.click, this));
    } else {
      this.$el.addClass('elessar-readonly');
    }
    if(typeof this.options.label === 'function') {
      this.on('changing', (ev, range) => {
        this.$el.find('.elessar-barlabel').text(
          this.options.label.call(this, range.map($.proxy(this.parent.normalise, this.parent)))
        );
      });
    } else {
      this.$el.find('.elessar-barlabel').text(this.options.label);
    }

    this.range = [];
    this.hasChanged = false;

    if(this.options.value) this.val(this.options.value);
  }

  removePhantom() {
    this.parent.removePhantom();
  }

  val(range, valOpts) {
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
      this.hasChanged = true;
    }

    this.draw({
      left: 100*range[0] + '%',
      minWidth: 100*(range[1] - range[0]) + '%'
    });

    return this;

    function snap(val) { return Math.round(val / self.options.snap) * self.options.snap; }
    function sign(x)   { return x ? x < 0 ? -1 : 1 : 0; }
  }

  click(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    var self = this;

    if(ev.which !== 2 || !this.parent.options.allowDelete) return;

    if(this.deleteConfirm) {
      this.parent.removeRange(this);
      clearTimeout(this.deleteTimeout);
    } else {
      this.$el.addClass('elessar-delete-confirm');
      this.deleteConfirm = true;

      this.deleteTimeout = setTimeout(function() {
        self.$el.removeClass('elessar-delete-confirm');
        self.deleteConfirm = false;
      }, this.parent.options.deleteTimeout);
    }
  }

  mousedown(ev) {
    ev.stopPropagation();
	ev.preventDefault();
	this.hasChanged = false;
	if (ev.which > 1)
		return;
	//proxying events    
	this.proxResL = $.proxy(this.resizeLeft(ev), this);
	this.proxResR = $.proxy(this.resizeRight(ev), this);
	this.proxDrag = $.proxy(this.drag(ev), this);
	this.proxMouseup = $.proxy(this.mouseup, this);

	if ($(ev.target).is('.elessar-handle:first-child')) {
		$('body').addClass('elessar-resizing');
		$(document).on('mousemove touchmove', this.proxResL);
	} else if ($(ev.target).is('.elessar-handle:last-child')) {
		$('body').addClass('elessar-resizing');
		$(document).on('mousemove touchmove', this.proxResR);
	} else {
		$('body').addClass('elessar-dragging');
		$(document).on('mousemove touchmove', this.proxDrag);
	}

	$(document).on('mouseup touchend', this.proxMouseup);
  }

  mouseup(ev) {
    ev.stopPropagation();
	ev.preventDefault();
	if (hasChanged)
		this.trigger('change', [
			this.range,
			this.$el
		]);
	$(document).off('mousemove touchmove', this.proxResL);
	$(document).off('mousemove touchmove', this.proxResR);
	$(document).off('mousemove touchmove', this.proxDrag);
	$(document).off('mouseup touchend', this.proxMouseup);

	$('body').removeClass('elessar-resizing elessar-dragging');
  }
  
  drag(origEv) {
    var self = this,
    startLeft = this.$el.offset().left,
    startPosLeft = this.$el.position().left,
    mouseOffset = getEvtX('clientX', origEv) ? getEvtX('clientX', origEv) - this.$el.offset().left : 0,
    startWidth = this.$el.width(),
    parent = this.options.parent,
    parentOffset = parent.$el.offset(),
    parentWidth = parent.$el.width();

    return function(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      var left = getEvtX('clientX', ev) - parentOffset.left - mouseOffset;

      if (left >= 0 && left <= parentWidth - startWidth) {
        var rangeOffset = left / parentWidth - self.range[0];
        self.val([left / parentWidth, self.range[1] + rangeOffset]);
      } else {
        mouseOffset = getEvtX('clientX', ev) - self.$el.offset().left;
      }
    };
  }

  resizeRight(origEv) {
    var self = this,
    startLeft = this.$el.offset().left,
    startPosLeft = this.$el.position().left,
    mouseOffset = getEvtX('clientX', origEv) ? getEvtX('clientX', origEv) - this.$el.offset().left : 0,
    startWidth = this.$el.width(),
    parent = this.options.parent,
    parentOffset = parent.$el.offset(),
    parentWidth = parent.$el.width(),
    minWidth = this.options.minSize * parentWidth;

    return function(ev) {
      var opposite = ev.type === 'touchmove' ? 'touchend' : 'mouseup',
      subsequent = ev.type === 'touchmove' ? 'touchstart' : 'mousedown';

      ev.stopPropagation();
      ev.preventDefault();
      var width = getEvtX('clientX', ev) - startLeft;

      if (width > parentWidth - startPosLeft) width = parentWidth - startPosLeft;
      if (width >= minWidth) {
        self.val([self.range[0], self.range[0] + width / parentWidth], {dontApplyDelta: true});
      } else if(width <= 10) {
        $(document).trigger(opposite);
        self.$el.find('.elessar-handle:first-child').trigger(subsequent);
      }
    };
  }
  
  resizeLeft(origEv) {
    var self = this,
    startLeft = this.$el.offset().left,
    startPosLeft = this.$el.position().left,
    mouseOffset = getEvtX('clientX', origEv) ? getEvtX('clientX', origEv) - this.$el.offset().left : 0,
    startWidth = this.$el.width(),
    parent = this.options.parent,
    parentOffset = parent.$el.offset(),
    parentWidth = parent.$el.width(),
    minWidth = this.options.minSize * parentWidth;

    return function(ev) {
      var opposite = ev.type === 'touchmove' ? 'touchend' : 'mouseup',
      subsequent = ev.type === 'touchmove' ? 'touchstart' : 'mousedown';

      ev.stopPropagation();
      ev.preventDefault();
      var left = getEvtX('clientX', ev) - parentOffset.left - mouseOffset;
      var width = startPosLeft + startWidth - left;

      if (left < 0) {
        left = 0;
        width = startPosLeft + startWidth;
      }
      if (width >= minWidth) {
        self.val([left / parentWidth, self.range[1]], {dontApplyDelta: true});
      } else if(width <= 10) {
        $(document).trigger(opposite);
        self.$el.find('.elessar-handle:last-child').trigger(subsequent);
      }
    };
  }
}

module.exports = Range;

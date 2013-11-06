Ranger.defaults = {
  min: 0,
  max: 100,
  valueFormat: function(a) {return a;},
  valueParse: function(a) {return a;},
  labels: []
};

function Ranger(options) {
  var $base = $('<div class=progress>');
  options = $.extend({}, Ranger.defaults, options);
  options.min = options.valueParse(options.min);
  options.max = options.valueParse(options.max);

  function normaliseRaw(value) {
    return options.min + value * (options.max - options.min);
  }

  $base.normalise = function (value) {
    return options.valueFormat(normaliseRaw(value));
  };

  function abnormaliseRaw(value) {
    return (value - options.min)/(options.max - options.min);
  }

  $base.abnormalise = function (value) {
    return abnormaliseRaw(options.valueParse(value));
  };

  $base.ranges = [];

  $base.addRange = function(range, index) {
    var $range = Range({
      value: range.map($base.abnormalise),
      parent: $base,
      snap: options.snap ? abnormaliseRaw(options.snap + options.min) : null,
      label: options.labels[index]
    });
    $base.ranges.push($range);
    $base.append($range);
    $range.on('changing', function(ev, nrange) {
      ev.stopPropagation();
      $base.trigger('changing', [$base.val()]);
    }).on('change', function(ev, nrange) {
      ev.stopPropagation();
      $base.trigger('change', [$base.val()]);
    });
    return $range;
  };

  $base.val = function(ranges) {
    if(typeof ranges === 'undefined') {
      return $base.ranges.map(function(range) {
        return range.val().map($base.normalise);
      });
    }

    if($base.ranges.length > ranges.length) {
      for(var i = ranges.length, l = $base.ranges.length; i < l; ++i) {
        $base.ranges[i].remove();
      }
      $base.ranges.length = ranges.length;
    }

    ranges.forEach(function(range, i) {
      if($base.ranges[i]) {
        $base.ranges[i].val(range.map($base.abnormalise));
      } else {
        $base.addRange(range, i);
      }
    });

    return this;
  };

  if(options.values) $base.val(options.values);

  return $base;
}

function Range(options) {
  var $el = $('<div class=bar>')
    .append('<div class=handle>')
    .append('<span class=barlabel>')
    .append('<div class=handle>');

  if(typeof options.label === 'function') {
    $el.on('changing', function(ev, range) {
      $el.find('.barlabel').text(options.label.call($el,range.map(options.parent.normalise)));
    });
  } else {
    $el.find('.barlabel').text(options.label);
  }

  $el.val = function(range) {
    if(typeof range === 'undefined') {
      return $el.range;
    }
    var a;

    if(options.snap) {
      range = range.map(function(val) {
        return Math.round(val / options.snap) * options.snap;
      });
    }
    $el.range = range;
    $el.trigger('changing', [range]);
    $el.css({
      left: 100*range[0] + '%',
      minWidth: 100*(range[1] - range[0]) + '%'
    });

    return $el;

    function sign(x) { return x ? x < 0 ? -1 : 1 : 0; }
  };

  if(options.value) $el.val(options.value);

  $el.on('mousedown', function(ev) {
    if ($(ev.target).is('.handle:first-child')) {
      $('body').addClass('resizing');
      $(document).on('mousemove',resizeLeft);
    } else if ($(ev.target).is('.handle:last-child')) {
      $('body').addClass('resizing');
      $(document).on('mousemove',resizeRight);
    } else {
      $('body').addClass('dragging');
      $(document).on('mousemove',drag);
    }

    var startLeft = $el.offset().left,
        startPosLeft = $el.position().left,
        mouseOffset = ev.clientX ? ev.clientX - $el.offset().left : 0,
        startWidth = $el.width(),
        parent = options.parent,
        parentOffset = parent.offset(),
        parentWidth = parent.width();

    var nextLeft, prevRight;

    $el.siblings('.bar').each(function() {
      var $this = $(this), off = $this.offset(), width = $this.width();
      if(off.left >= startLeft + startWidth) { // to the right of current bar
        if(!nextLeft || off.left <= nextLeft) { // no next or closer to current than next
          nextLeft = off.left;
        }
      }
      if(off.left + width <= startLeft) { // to the left of current bar
        if(!prevRight || off.left + width >= prevRight) { // no prev or closer to current than prev
          prevRight = off.left + width;
        }
      }
    });

    var drawing = false;

    $(document).on('mouseup', function() {
      $el.trigger('change', [$el.range]);
      $(this).off('mouseup mousemove');
      $('body').removeClass('resizing dragging');
    });

    function resizeRight(ev) {
      var width = ev.clientX - startLeft;

      if (drawing) return;
      if (width > parentWidth - startPosLeft) width = parentWidth - startPosLeft;
      if (nextLeft && startLeft + width >= nextLeft) width = nextLeft - startLeft;
      if (width >= 10) {
        requestAnimationFrame(function() {
          drawing = false;
          var right = width / parentWidth;
          $el.val([$el.range[0], $el.range[0] + right]);
        });
        drawing = true;
      } else {
        $(document).trigger('mouseup');
        $el.find('.handle:first-child').trigger('mousedown');
      }
    }

    function drag(ev) {
      var left = ev.clientX - parentOffset.left - mouseOffset;

      if (drawing) return;
      if (nextLeft && left + startWidth >= nextLeft) left = nextLeft - startWidth;
      if (prevRight && left <= prevRight) left = prevRight;
      if (left >= 0 && left <= parentWidth - $el.width()) {
        requestAnimationFrame(function() {
          drawing = false;
          var rangeOffset = left / parentWidth - $el.range[0];
          $el.val([left / parentWidth, $el.range[1] + rangeOffset]);
        });
        drawing = true;
      } else {
        mouseOffset = ev.clientX - $el.offset().left;
      }
    }

    function resizeLeft(ev) {
      var left = ev.clientX - parentOffset.left - mouseOffset;
      var width = startPosLeft + startWidth - left;

      if (drawing) return;
      if (left < 0) {
        left = 0;
        width = startPosLeft + startWidth;
      }
      if (prevRight && left <= prevRight) {
        left = prevRight;
        width = startPosLeft + startWidth - left;
      }
      if (width >= 10) {
        requestAnimationFrame(function() {
          drawing = false;
          var lRel = left / parentWidth;
          $el.val([lRel, $el.range[1]]);
        });
        drawing = true;
      } else {
        $(document).trigger('mouseup');
        $el.find('.handle:last-child').trigger('mousedown');
      }
    }
  });

  return $el;
}
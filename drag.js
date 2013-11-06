Ranger.defaults = {
  min: 0,
  max: 100,
  valueFormat: function(a) {return a;},
  valueParse: function(a) {return a;},
  maxRanges: Infinity
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
    $range = Range({
      value: range,
      parent: $base,
      snap: options.snap ? abnormaliseRaw(options.snap + options.min) : null,
      label: options.label,
      minSize: options.minSize ? abnormaliseRaw(options.minSize + options.min) : null,
    });
    $base.ranges.push($range);
    $base.append($range);
    $range.on('changing', function(ev, n$range) {
      ev.stopPropagation();
      $base.trigger('changing', [$base.val()]);
    }).on('change', function(ev, nrange) {
      ev.stopPropagation();
      $base.trigger('change', [$base.val()]);
    });
    return $range;
  };

  $base.prevRange = function(range) {
    var idx = range.index();
    if(idx >= 0) return $base.ranges[idx - 1];
  };

  $base.nextRange = function(range) {
    var idx = range.index();
    if(idx >= 0) return $base.ranges[idx + 1];
  };

  $base.val = function(ranges) {
    if(typeof ranges === 'undefined') {
      return $base.ranges.map(function(range) {
        return range.val().map($base.normalise);
      });
    }

    ranges.sort(function(range1, range2) {
      return $base.abnormalise(range1[0]) - $base.abnormalise(range2[0]);
    });

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
        $base.addRange(range.map($base.abnormalise));
      }
    });

    return this;
  };

  $base.on('click', function(ev) {
    if(ev.target === ev.currentTarget && $base.ranges.length < options.maxRanges) {
      var mid = ev.pageX - $base.offset().left;
      var left = (mid - $base.width() / 25) / $base.width();
      var right = (mid + $base.width() / 25) / $base.width();

      $base.addRange([left, right]);
    }
  });

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

  var drawing = false;
  $el.range = [];

  $el.val = function(range, dontApplyDelta) {
    if(typeof range === 'undefined') {
      return $el.range;
    }
    var next = options.parent.nextRange($el),
        prev = options.parent.prevRange($el),
        delta = range[1] - range[0];

    if(options.snap) {
      range = range.map(function(val) {
        return Math.round(val / options.snap) * options.snap;
      });
    }
    if (next && next.val()[0] < range[1]) {
      range[1] = next.val()[0];
      if(!dontApplyDelta) range[0] = range[1] - delta;
    }
    if (prev && prev.val()[1] > range[0]) {
      range[0] = prev.val()[1];
      if(!dontApplyDelta) range[1] = range[0] - delta;
    }

    if(options.minSize && range[1] - range[0] < options.minSize) return $el;
    if($el.range[0] === range[0] && $el.range[1] === range[1]) return $el;
    $el.range = range;
    $el.trigger('changing', [range]);

    if (drawing) return $el;
    requestAnimationFrame(function() {
      drawing = false;
      $el.css({
        left: 100*range[0] + '%',
        minWidth: 100*(range[1] - range[0]) + '%'
      });
    });
    drawing = true;

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

    $(document).on('mouseup', function() {
      $el.trigger('change', [$el.range]);
      $(this).off('mouseup mousemove');
      $('body').removeClass('resizing dragging');
    });

    function drag(ev) {
      var left = ev.clientX - parentOffset.left - mouseOffset;

      if (left >= 0 && left <= parentWidth - $el.width()) {
        var rangeOffset = left / parentWidth - $el.range[0];
        $el.val([left / parentWidth, $el.range[1] + rangeOffset]);
      } else {
        mouseOffset = ev.clientX - $el.offset().left;
      }
    }

    function resizeRight(ev) {
      var width = ev.clientX - startLeft;

      if (width > parentWidth - startPosLeft) width = parentWidth - startPosLeft;
      if (width >= 10) {
        $el.val([$el.range[0], $el.range[0] + width / parentWidth], true);
      } else {
        $(document).trigger('mouseup');
        $el.find('.handle:first-child').trigger('mousedown');
      }
    }

    function resizeLeft(ev) {
      var left = ev.clientX - parentOffset.left - mouseOffset;
      var width = startPosLeft + startWidth - left;

      if (left < 0) {
        left = 0;
        width = startPosLeft + startWidth;
      }
      if (width >= 10) {
        $el.val([left / parentWidth, $el.range[1]], true);
      } else {
        $(document).trigger('mouseup');
        $el.find('.handle:last-child').trigger('mousedown');
      }
    }
  });

  return $el;
}
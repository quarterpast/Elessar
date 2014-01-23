var $ = require('jquery');
var Range = require('./range');
var Indicator = require('./indicator');

RangeBar.defaults = {
  min: 0,
  max: 100,
  valueFormat: function(a) {return a;},
  valueParse: function(a) {return a;},
  maxRanges: Infinity,
  readonly: false,
  bgLabels: 0
};

function RangeBar(options) {
  var $base = $('<div class="elessar-rangebar">');
  options = $.extend({}, RangeBar.defaults, options);
  options.min = options.valueParse(options.min);
  options.max = options.valueParse(options.max);

  if(options.barClass) $base.addClass(options.barClass);

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

  $base.findGap = function(range) {
    var newIndex;
    $base.ranges.forEach(function($r, i) {
      if($r.val()[0] < range[0] && $r.val()[1] < range[1]) newIndex = i + 1;
    });

    return newIndex;
  };

  $base.insertRangeIndex = function(range, index, avoidList) {
    if(!avoidList) $base.ranges.splice(index, 0, range);

    if($base.ranges[index - 1]) {
      $base.ranges[index - 1].after(range);
    } else {
      $base.prepend(range);
    }
  };

  $base.addRange = function(range, data) {
    var $range = Range({
      parent: $base,
      snap: options.snap ? abnormaliseRaw(options.snap + options.min) : null,
      label: options.label,
      rangeClass: options.rangeClass,
      minSize: options.minSize ? abnormaliseRaw(options.minSize + options.min) : null,
      readonly: options.readonly
    });

    if (options.data) {
      $range.data(options.data.call($range, $base));
    }

    if (data) {
      $range.data(data);
    }

    $base.insertRangeIndex($range, $base.findGap(range));
    $range.val(range);

    $range.on('changing', function(ev, nrange, changed) {
      ev.stopPropagation();
      $base.trigger('changing', [$base.val(), changed]);
    }).on('change', function(ev, nrange, changed) {
      ev.stopPropagation();
      $base.trigger('change', [$base.val(), changed]);
    });
    return $range;
  };

  $base.prevRange = function(range) {
    var idx = range.index();
    if(idx >= 0) return $base.ranges[idx - 1];
  };

  $base.nextRange = function(range) {
    var idx = range.index();
    if(idx >= 0) return $base.ranges[range.is('.elessar-phantom') ? idx : idx + 1];
  };

  function setVal(ranges) {
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
  }

  $base.val = function(ranges) {
    if(typeof ranges === 'undefined') {
      return $base.ranges.map(function(range) {
        return range.val().map($base.normalise);
      });
    }

    if(!options.readonly) setVal(ranges);
    return this;
  };

  $base.removePhantom = function() {
    if($base.phantom) {
      $base.phantom.remove();
      $base.phantom = null;
    }
  };

  $base.calcGap = function(index) {
    var start = $base.ranges[index - 1] ? $base.ranges[index - 1].val()[1] : 0;
    var end = $base.ranges[index] ? $base.ranges[index].val()[0] : 1;
    return normaliseRaw(end) - normaliseRaw(start);
  };

  $base.addLabel = function(pos) {
    var cent = pos * 100, val = $base.normalise(pos);
    var $el = $('<span class="elessar-label">').css('left', cent+'%').text(val);
    if(1 - pos < 0.05) {
      $el.css({
        left: '',
        right: 0
      });
    }
    return $el.appendTo($base);
  };

  $base.on('mousemove', function(ev) {
    var w = options.minSize ? abnormaliseRaw(options.minSize + options.min) : 0.05;
    var val = (ev.pageX - $base.offset().left)/$base.width() - w/2;
    if(ev.target === ev.currentTarget && $base.ranges.length < options.maxRanges && !$('body').is('.elessar-dragging, .elessar-resizing') && !options.readonly) {
      if(!$base.phantom) $base.phantom = Range({
        parent: $base,
        snap: options.snap ? abnormaliseRaw(options.snap + options.min) : null,
        label: "+",
        minSize: options.minSize ? abnormaliseRaw(options.minSize + options.min) : null,
        rangeClass: options.rangeClass,
        phantom: true
      });
      var idx = $base.findGap([val,val + w]);

      if(!options.minSize || $base.calcGap(idx) >= options.minSize) {
        $base.insertRangeIndex($base.phantom, idx, true);
        $base.phantom.val([val,val + w], {trigger: false});
      }
    }
  }).on('mouseleave', $base.removePhantom);

  if(options.values) setVal(options.values);

  for(var i = 0; i < options.bgLabels; ++i) {
    $base.addLabel(i / options.bgLabels);
  }

  if(options.indicator) {
    var indicator = $base.indicator = new Indicator({
      parent: $base,
      indicatorClass: options.indicatorClass
    });
    indicator.val($base.abnormalise(options.indicator($base, indicator, function() {
      indicator.val($base.abnormalise(options.indicator($base, indicator)));
    })));
    $base.append(indicator);
  }

  return $base;
}

module.exports = RangeBar;

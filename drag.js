Ranger.defaults = {
  min: 0,
  max: 100
};

function Ranger(options) {
  var $base = $('<div class=progress>');
  options = $.extend({}, Ranger.defaults, options);

  function normalise(raw) {
    return raw.map(function (value) {
      return options.min + value * (options.max - options.min);
    });
  }

  function abnormalise(norm) {
    return norm.map(function (value) {
      return (value - options.min)/(options.max - options.min);
    });
  }

  $base.ranges = [];

  $base.addRange = function(range) {
    var $range = Range({value: abnormalise(range), parent: $base});
    $base.ranges.push($range);
    $base.append($range);
    return $range;
  };

  $base.val = function(ranges) {
    if(typeof ranges === 'undefined') {
      return $base.ranges.map(function(range) {
        return normalise(range.val());
      });
    }

    if($base.ranges.length > ranges.length) {
      for(var i = ranges.length, l = $base.ranges.length; i < l; ++i) {
        $base.ranges[i].remove();
      }
    }
    $base.ranges.length = ranges.length;

    ranges.forEach(function(range, i) {
      if($base.ranges[i]) {
        $base.ranges[i].val(abnormalise(range));
      } else {
        $base.addRange(range);
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
    .append('<div class=handle>');

  $el.val = function(range) {
    if(typeof range === 'undefined') {
      return $el.range;
    }

    $el.range = range;
    $el.css({
      left: 100*range[0] + '%',
      width: 100*(range[1] - range[0]) + '%'
    });

    return $el;
  };

  if(options.value) $el.val(options.value);

  $el.on('mousedown', function(ev) {
    var target;

    if ($(ev.target).is('.handle:first-child')) {
      target = $(ev.currentTarget).width('auto');
      $('body').addClass('resizing');
      $(document).on('mousemove',resizeLeft);
    } else if ($(ev.target).is('.handle:last-child')) {
      target = $(ev.currentTarget).width('auto');
      $('body').addClass('resizing');
      $(document).on('mousemove',resizeRight);
    } else {
      target = $(this);
      $('body').addClass('dragging');
      $(document).on('mousemove',drag);
    }

    var startLeft = target.offset().left,
        startPosLeft = target.position().left,
        mouseOffset = ev.clientX ? ev.clientX - target.offset().left : 0,
        startWidth = target.width(),
        parent = target.parent(),
        parentOffset = parent.offset(),
        parentWidth = parent.width();

    var nextLeft, prevRight;

    target.siblings('.bar').each(function() {
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
      requestAnimationFrame(function() {
        target = null;
      });
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
          if(target) target.css('min-width', width);
        });
        drawing = true;
      } else {
        $(document).trigger('mouseup');
        target.find('.handle:first-child').trigger('mousedown');
      }
    }

    function drag(ev) {
      var left = ev.clientX - parentOffset.left - mouseOffset;

      if (drawing) return;
      if (nextLeft && left + startWidth >= nextLeft) left = nextLeft - startWidth;
      if (prevRight && left <= prevRight) left = prevRight;
      if (left >= 0 && left <= parentWidth - target.width()) {
        requestAnimationFrame(function() {
          drawing = false;
          if(target) target.css('left', left);
        });
        drawing = true;
      } else {
        mouseOffset = ev.clientX - target.offset().left;
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
          if(target) target.css({
            minWidth: width,
            left: left
          });
        });
        drawing = true;
      } else {
        $(document).trigger('mouseup');
        target.find('.handle:last-child').trigger('mousedown');
      }
    }
  });

  return $el;
}
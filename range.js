var $ = require('jquery');
var requestAnimationFrame = require('./raf');

function Range(options) {
  var $el = $('<div class="elessar-range">')
    .append('<span class="elessar-barlabel">');

  if(options.rangeClass) $el.addClass(options.rangeClass);

  if(!options.readonly) {
    if(!options.phantom) {
      $el.prepend('<div class="elessar-handle">').append('<div class="elessar-handle">');
    } else {
      $el.addClass('elessar-phantom');
    }
  } else {
    $el.addClass('elessar-readonly');
  }

  if(typeof options.label === 'function') {
    $el.on('changing', function(ev, range) {
      $el.find('.elessar-barlabel').text(options.label.call($el,range.map(options.parent.normalise)));
    });
  } else {
    $el.find('.elessar-barlabel').text(options.label);
  }

  var drawing = false, hasChanged = false;
  $el.range = [];

  $el.val = function(range, valOpts) {
    if(typeof range === 'undefined') {
      return $el.range;
    }

    valOpts  = $.extend({},{
      dontApplyDelta: false,
      trigger: true
    },valOpts || {});

    var next = options.parent.nextRange($el),
        prev = options.parent.prevRange($el),
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

    function snap(val) { return Math.round(val / options.snap) * options.snap; }
    function sign(x)   { return x ? x < 0 ? -1 : 1 : 0; }
  };

  if(options.value) $el.val(options.value);

  if(!options.readonly) {
    if(!options.phantom) {

      $el.on('mouseenter', function(ev) {
        options.parent.removePhantom();
      }).on('mousedown', function(ev) {
        hasChanged = false;
        if('which' in ev && ev.which !== 1) return;

        if ($(ev.target).is('.elessar-handle:first-child')) {
          $('body').addClass('elessar-resizing');
          $(document).on('mousemove',resizeLeft);
        } else if ($(ev.target).is('.elessar-handle:last-child')) {
          $('body').addClass('elessar-resizing');
          $(document).on('mousemove',resizeRight);
        } else {
          $('body').addClass('elessar-dragging');
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
          if(hasChanged) $el.trigger('change', [$el.range, $el]);
          $(this).off('mouseup mousemove');
          $('body').removeClass('elessar-resizing elessar-dragging');
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
            $el.val([$el.range[0], $el.range[0] + width / parentWidth], {dontApplyDelta: true});
          } else {
            $(document).trigger('mouseup');
            $el.find('.elessar-handle:first-child').trigger('mousedown');
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
            $el.val([left / parentWidth, $el.range[1]], {dontApplyDelta: true});
          } else {
            $(document).trigger('mouseup');
            $el.find('.elessar-handle:last-child').trigger('mousedown');
          }
        }
      });
    } else {
      $el.on('mousedown', function(ev) {
        if(ev.which === 1) { // left mouse button
          var startX = ev.pageX;
          var newRange = options.parent.addRange($el.val());
          $el.remove();
          options.parent.trigger('addrange', [newRange.val(), newRange]);
          newRange.find('.elessar-handle:first-child').trigger('mousedown');
        }
      });
    }
  }

  return $el;
}

module.exports = Range;
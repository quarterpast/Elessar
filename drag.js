function Ranger() {
  var $base = $('<div class=progress>');

  $base
    .append(Range().css({width:100, left:100}))
    .append(Range().css({width:100, left:300}));

  return $base;
}

function Range() {
  var $el = $('<div class=bar>')
    .append('<div class=handle>')
    .append('<div class=handle>');

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
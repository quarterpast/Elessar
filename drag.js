$('.bar').on('mousedown', function(ev) {
  var dragging, resizingLeft, resizingRight, parent, startWidth, startLeft, mouseOffset, startPosLeft;

  if ($(ev.target).is('.handle:first-child')) {
    resizingLeft = $(ev.currentTarget).width('auto');
    parent = resizingLeft.parent();
    startWidth = resizingLeft.width();
    startLeft = resizingLeft.position().left;
    $(document).on('mousemove',resizeLeft);
  } else if ($(ev.target).is('.handle:last-child')) {
    resizingRight = $(ev.currentTarget).width('auto');
    parent = resizingRight.parent();
    startLeft = resizingRight.offset().left;
    startPosLeft = resizingRight.position().left;
    $(document).on('mousemove',resizeRight);
  } else {
    dragging = $(this);
    parent = dragging.parent();
    mouseOffset = ev.clientX - dragging.offset().left;
    $(document).on('mousemove',drag);
  }

  var parentOffset = parent.offset();
  var parentWidth = parent.width();
  
  var drawing = false;

  $(document).on('mouseup', function() {
    dragging = resizingLeft = resizingRight = null;
    $(this).off('mouseup mousemove');
  });

  function resizeRight(ev) {
    var width = ev.clientX - startLeft;

    if (resizingRight && !drawing && width <= parentWidth - startPosLeft) {
      requestAnimationFrame(function() {
        drawing = false;
        resizingRight.css('min-width', width);
      });
      drawing = true;
    }
  }

  function drag(ev) {
    var left = ev.clientX - parentOffset.left - mouseOffset;

    if (dragging && !drawing && left >= 0 && left <= parent.width() - dragging.width()) {
      requestAnimationFrame(function() {
        drawing = false;
        dragging.css('left', left);
      });
      drawing = true;
    }
  }

  function resizeLeft(ev) {
    var left = ev.clientX - parentOffset.left;
    var width = startLeft + startWidth - left;

    if (resizingLeft && !drawing && left >= 0 && width >= 0) {
      requestAnimationFrame(function() {
        drawing = false;
        resizingLeft.css({
          minWidth: width,
          left: left
        });
      });
      drawing = true;
    }
  }
});
var $ = require('jquery');
var requestAnimationFrame = require('./raf');

function Indicator(options) {
  var $el = $('<div class="elessar-indicator">');

  if(options.indicatorClass) $el.addClass(options.indicatorClass);

  var drawing = false;

  $el.val = function(pos) {
    if (drawing) return $el;
    requestAnimationFrame(function() {
      drawing = false;
      $el.css({left: 100*pos + '%'});
    });
    drawing = true;

    return $el;
  };

  if(options.value) $el.val(options.value);

  return $el;
}

module.exports = Indicator;
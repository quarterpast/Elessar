(function(root, definition) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery','elessar/raf','es5-shim'], definition);
  } else if (typeof exports === 'object') {
    module.exports = definition(require('jquery-browser/lib/jquery'), require('./raf'), require('es5-shim'));
  } else {
    root.Indicator = definition(jQuery, requestAnimationFrame);
  }
})(this, function($, requestAnimationFrame) {
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

  return Indicator;
});
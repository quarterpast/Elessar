(function(root, definition) {
  if (typeof define === 'function' && define.amd) {
  define([], definition);
  } else if (typeof exports === 'object') {
  module.exports = definition();
  } else {
  root.requestAnimationFrame = definition();
  }
})(this, function() {
  // thanks to http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  var lastTime = 0;
  var vendors = ['webkit', 'moz'], requestAnimationFrame = window.requestAnimationFrame;
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  }

  if (!requestAnimationFrame) {
    requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  return requestAnimationFrame;

});
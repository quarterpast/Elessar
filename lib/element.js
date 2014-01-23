(function(root, definition) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery','estira', 'elessar/raf','es5-shim'], definition);
  } else if (typeof exports === 'object') {
    module.exports = definition(
      require('jquery-browser/lib/jquery'),
      require('estira'),
      require('./raf'),
      require('es5-shim')
    );
  } else {
    root.Element = definition(jQuery, requestAnimationFrame);
  }
})(this, function($, Base, requestAnimationFrame) {
  var Element = Base.extend({
    initialize: function(html) {
      this.$el = $(html);
    },
    draw: function(css) {
      var self = this;
      if(this.drawing) return this.$el;
      requestAnimationFrame(function() {
        self.drawing = false;
        self.$el.css(css);
      });
      this.drawing = true;
      return this.$el;
    },
    on: function() {
      return this.$el.on.apply(this.$el, arguments);
    },
    one: function() {
      return this.$el.one.apply(this.$el, arguments);
    },
    off: function() {
      return this.$el.off.apply(this.$el, arguments);
    }
  });
  return Element;
});
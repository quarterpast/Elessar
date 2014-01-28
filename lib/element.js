var Base = require('estira');
var $ = require('jquery');
var requestAnimationFrame = require('./raf');
require('es5-shim');

var Element = Base.extend({
  initialize: function(html) {
    this.$el = $(html);
    this.$el.data(this.constructor.displayName.toLowerCase(), this);
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
  },
  trigger: function() {
    return this.$el.trigger.apply(this.$el, arguments);
  }
});

module.exports = Element;
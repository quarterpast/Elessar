var Base = require('estira');
var $ = require('jquery');
var requestAnimationFrame = require('./raf');
require('es5-shim');

var Element = Base.extend(
  function initialize(html) {
    this.$el = $(html);
    this.$el.data('element', this);
  },
  function draw(css) {
    var self = this;
    if(this.drawing) return this.$el;
    requestAnimationFrame(function() {
      self.drawing = false;
      self.$el.css(css);
    });
    this.drawing = true;
    return this.$el;
  },
  function on() {
    this.$el.on.apply(this.$el, arguments);
    return this;
  },
  function one() {
    this.$el.one.apply(this.$el, arguments);
    return this;
  },
  function off() {
    this.$el.off.apply(this.$el, arguments);
    return this;
  },
  function trigger() {
    this.$el.trigger.apply(this.$el, arguments);
    return this;
  },
  function remove() {
    this.$el.remove();
  }
);

module.exports = Element;
var Base = require('estira');
var $ = require('jquery');
var requestAnimationFrame = require('./raf');

var has = Object.prototype.hasOwnProperty;

var Element = Base.extend({
  initialize: function(html) {
    this.$el = $(html);
    this.$data = {};
    this.$el.data('element', this);
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
    this.$el.on.apply(this.$el, arguments);
    return this;
  },
  one: function() {
    this.$el.one.apply(this.$el, arguments);
    return this;
  },
  off: function() {
    this.$el.off.apply(this.$el, arguments);
    return this;
  },
  trigger: function() {
    this.$el.trigger.apply(this.$el, arguments);
    return this;
  },
  remove: function() {
    this.$el.remove();
  },
  detach: function() {
    this.$el.detach();
  },
  data: function(key, value) {
    var obj = key;
    if(typeof key === 'string') {
      if(typeof value === 'undefined') {
        return this.$data[key];
      }
      obj = {};
      obj[key] = value;
    }
    $.extend(this.$data, obj);
    return this;
  }
});

module.exports = Element;

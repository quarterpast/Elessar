var $ = require('jquery');
var requestAnimationFrame = require('./raf');

class Element {
  constructor(html) {
    this.$el = $(html);
    this.$data = {};
    this.$el.data('element', this);
  }
  draw(css) {
    if(this.drawing) return this.$el;
    requestAnimationFrame(() => {
      this.drawing = false;
      this.$el.css(css);
    });
    this.drawing = true;
    return this.$el;
  }
  on() {
    this.$el.on.apply(this.$el, arguments);
    return this;
  }
  one() {
    this.$el.one.apply(this.$el, arguments);
    return this;
  }
  off() {
    this.$el.off.apply(this.$el, arguments);
    return this;
  }
  trigger() {
    this.$el.trigger.apply(this.$el, arguments);
    return this;
  }
  remove() {
    this.$el.remove();
  }
  data(key, value) {
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
}

module.exports = Element;

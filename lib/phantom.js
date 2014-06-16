var $ = require('jquery');
var Range = require('./range');
var requestAnimationFrame = require('./raf');

var Phantom = Range.extend({
  initialize: function initialize(options) {
    initialize.super$.call(this, $.extend({
      readonly: true,
      label: '+'
    }, options));
    this.$el.addClass('elessar-phantom');
    this.on('mousedown touchstart', $.proxy(this.mousedown, this));
  },

  mousedown: function(ev) {
    if(ev.which === 1) { // left mouse button
      var startX = ev.pageX;
      var newRange = this.options.parent.addRange(this.val());
      this.remove();
      this.options.parent.trigger('addrange', [newRange.val(), newRange]);
      requestAnimationFrame(function() {
        newRange.$el.find('.elessar-handle:first-child').trigger(ev.type);
      });
    }
  },

  removePhantom: function() {
    // NOOP
  }
});

module.exports = Phantom;
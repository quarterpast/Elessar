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
    this.on('mousedown.elessar touchstart.elessar', $.proxy(this.mousedown, this));
  },

  mousedown: function(ev) {
    if(ev.which === 1) { // left mouse button
      var startX = ev.pageX;
      var newRange = this.options.perant.addRange(this.val());
      this.remove();
      this.options.perant.trigger('addrange', [newRange.val(), newRange]);
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

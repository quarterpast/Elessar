var Range = require('./range');
var requestAnimationFrame = require('./raf');

var Phantom = Range.extend(
  function initialize(options) {
    initialize.super$.call(this, $.extend({
      readonly: true,
      label: '+'
    }, options));
    this.$el.addClass('elessar-phantom');
  },

  function mousedown(ev) {
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

  function removePhantom() {
    // NOOP
  }
);

module.exports = Phantom;
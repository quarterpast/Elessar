(function(root, definition) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery','elessar/range','es5-shim'], definition);
  } else if (typeof exports === 'object') {
    module.exports = definition(require('jquery-browser/lib/jquery'), require('./range'), require('es5-shim'));
  } else {
    root.Phantom = definition(jQuery, Range);
  }
})(this, function($, Range) {
  var Phantom = Range.extend({
    initialize: function(options) {
      this.super$.initialize.call(this, {
        readonly: true,
        label: '+'
      });
      this.$el.addClass('elessar-phantom');
    },

    mousedown: function(ev) {
      if(ev.which === 1) { // left mouse button
        var startX = ev.pageX;
        var newRange = options.parent.addRange($el.val());
        $el.remove();
        options.parent.trigger('addrange', [newRange.val(), newRange]);
        newRange.find('.elessar-handle:first-child').trigger('mousedown');
      }
    }
  });
});
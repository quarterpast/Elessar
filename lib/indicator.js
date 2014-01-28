var Element = require('./element');

var Indicator = Element.extend({
  initialize: function(options) {
    this.super$.initialize.call(this,'<div class="elessar-indicator">');
    if(options.indicatorClass) this.$el.addClass(options.indicatorClass);
    if(options.value) this.val(options.value);
  },

  val: function(pos) {
    this.draw({left: 100*pos + '%'});
    return this;
  }
});

module.exports = Indicator;
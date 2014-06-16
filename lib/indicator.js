var Element = require('./element');

var Indicator = Element.extend({
  initialize: function initialize(options) {
    initialize.super$.call(this,'<div class="elessar-indicator">');
    if(options.indicatorClass) this.$el.addClass(options.indicatorClass);
    if(options.value) this.val(options.value);
  },

  val: function(pos) {
    if(pos) {
      this.value = pos;
      this.draw({left: 100*pos + '%'});
    }
    return this.value;
  }
});

module.exports = Indicator;

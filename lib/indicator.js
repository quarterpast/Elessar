var Element = require('./element');

var Indicator = Element.extend(
  function initialize(options) {
    initialize.super$.call(this,'<div class="elessar-indicator">');
    if(options.indicatorClass) this.$el.addClass(options.indicatorClass);
    if(options.value) this.val(options.value);
  },

  function val(pos) {
    this.draw({left: 100*pos + '%'});
    return this;
  }
);

module.exports = Indicator;
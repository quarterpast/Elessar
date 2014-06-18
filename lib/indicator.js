var Element = require('./element');
var vertical = require('./vertical');

var Indicator = Element.extend(vertical).extend({
  initialize: function initialize(options) {
    initialize.super$.call(this,'<div class="elessar-indicator">');
    if(options.indicatorClass) this.$el.addClass(options.indicatorClass);
    if(options.value) this.val(options.value);
    this.options = options;
  },

  val: function(pos) {
    if(pos) {
      if(this.isVertical()) {
        this.draw({top: 100*pos + '%'});
      } else {
        this.draw({left: 100*pos + '%'});
      }
      this.value = pos;
    }
    return this.value;
  }
});

module.exports = Indicator;

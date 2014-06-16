var Element = require('./element');

class Indicator extends Element {
  constructor(options) {
    super('<div class="elessar-indicator">');
    if(options.indicatorClass) this.$el.addClass(options.indicatorClass);
    if(options.value) this.val(options.value);
  }

  val(pos) {
    this.draw({left: 100*pos + '%'});
    return this;
  }
}

module.exports = Indicator;

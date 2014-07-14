var Element = require('./element.js');

var Mark = Element.extend({
	initialize: function initialize(options) {
		initialize.super$.call(this, '<div class="elessar-label">');
		this.$el.css(options.perant.edge('start'), (options.value * 100) + '%');
	
		if(typeof options.label === 'function') {
			this.$el.text(options.label.call(this, options.perant.normalise(options.value)));
		} else if(typeof options.label === 'string') {
			this.$el.text(options.label);
		} else {
			this.$el.text(options.perant.normalise(options.value));
		}
	}
});

module.exports = Mark;

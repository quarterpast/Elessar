var Element = require('./element.js');

var Mark = Element.extend({
	initialize: function initialize(options) {
		initialize.super$.call(this, '<div class="elessar-label">');

		this.$el.css(options.parent.startEdge(), (options.value * 100) + '%');
	
		if(typeof options.label === 'function') {
			this.$el.text(options.label.call(this, options.parent.normalize(options.value)));
		} else if(typeof options.label === 'string') {
			this.$el.text(options.label);
		}
	}
});

module.exports = Mark;

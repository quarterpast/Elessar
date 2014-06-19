module.exports = {
	isVertical: function() {
		return this.options.vertical;
	},
	
	ifVertical: function(v, h) {
    return this.isVertical() ? v : h;
  },
	edge: function(which) {
		if(which === 'start') {
			return this.ifVertical('top', 'left');
		} else if(which === 'end') {
			return this.ifVertical('bottom', 'right');
		}
		throw new TypeError('What kind of an edge is ' + which);
  },
  totalSize: function() {
    return this.$el[this.ifVertical('height','width')]();
  },
	edgeProp: function(edge, prop) {
		var o = this.$el[prop]();
		return o[this.edge(edge)];
	},
	startProp: function(prop) {
		return this.edgeProp('start', prop);
	},
	endProp: function(prop) {
		return this.edgeProp('end', prop);
	}
};

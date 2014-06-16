const browserify = require('browserify'),
      externalities = require('externalities'),
      derequire = require('derequire'),
      through = require('through'),
      fs = require('fs'),
      es6ify = require('es6ify');

var input  = process.argv[2],
    output = process.argv[3];

var b = browserify();
b.add(es6ify.runtime)
  .transform(externalities.pre(b))
  .transform(es6ify)
  .require(input, {entry: true});

b.bundle()
.pipe(externalities.post())
.pipe((function() {
	var body = '';
	function write(chunk) { body += chunk; }
	function end() {
		this.queue(derequire(body));
		this.queue(null);
	}
	return through(write, end);
}()))
.pipe(fs.createWriteStream(output));

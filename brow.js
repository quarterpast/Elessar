const browserify = require('browserify'),
      externalities = require('externalities'),
      derequire = require('derequire'),
      through = require('through'),
      fs = require('fs');

var input  = process.argv[2],
    output = process.argv[3];

var b = browserify(input);
b.transform(externalities.pre(b));

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
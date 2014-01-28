const browserify = require('browserify'),
      externalities = require('externalities'),
      fs = require('fs');

var input  = process.argv[2],
    output = process.argv[3];

var b = browserify(input);
b.transform(externalities.pre(b));

b.bundle()
.pipe(externalities.post())
.pipe(fs.createWriteStream(output));
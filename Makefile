LIB_FILES=$(wildcard ../lib/*.js)

all: elessar.css bundle.js

elessar.css: ../elessar.css
	cp $< $@

bundle.js: demo.js $(LIB_FILES)
	../node_modules/.bin/browserify $< > $@

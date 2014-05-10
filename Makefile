ENTRY_FILE="./lib/rangebar.js"
MODULE_NAME="RangeBar"
DEPS := $(shell node_modules/.bin/browserify --list $(ENTRY_FILE))

all: dist/elessar.js
min: dist/elessar.min.js

dist/%.min.js: dist/%.js
	node_modules/.bin/uglifyjs $< -o $@

dist/%.js: $(DEPS)
	mkdir -p $(@D)
	node brow.js $(ENTRY_FILE) $@

.PHONY: clean deps

clean:
	rm -rf dist

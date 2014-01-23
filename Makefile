ENTRY_FILE="rangebar.js"
MODULE_NAME="RangeBar"
DEPS := $(shell node_modules/.bin/browserify --deps $(ENTRY_FILE) | node_modules/.bin/jsonpath '$$..id')

all: dist/elessar.js
min: dist/elessar.min.js

dist/%.min.js: dist/%.js
	node_modules/.bin/uglifyjs2 $< -o $@

dist/%.js: $(DEPS)
	mkdir -p dist
	node_modules/.bin/browserify --standalone $(MODULE_NAME) --ignore jquery $(ENTRY_FILE) -o $@

.PHONY: clean deps

clean:
	rm -rf dist
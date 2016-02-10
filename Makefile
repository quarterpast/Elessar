export SHELL := /bin/bash
export PATH  := $(shell npm bin):$(PATH)

ENTRY_FILE="./lib/rangebar.js"
DEPS := $(shell node_modules/.bin/browserify --list $(ENTRY_FILE))
TEST_FILES = $(filter-out test/utils.js, $(wildcard test/*.js))

all: dist/elessar.js
min: dist/elessar.min.js

dist/%.min.js: dist/%.js
	uglifyjs $< -o $@

dist/%.js: $(DEPS)
	mkdir -p $(@D)
	browserify -t browserify-global-shim $(ENTRY_FILE) -o $@

.PHONY: clean test test-local

clean:
	rm -rf dist

test-local: $(DEPS) $(TEST_FILES)
	zuul --phantom -- $(TEST_FILES) | tap-spec

test: $(DEPS) $(TEST_FILES)
	zuul -- $(TEST_FILES)

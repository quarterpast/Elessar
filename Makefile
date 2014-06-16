export SHELL := /bin/bash
export PATH  := node_modules/.bin:$(PATH)

ENTRY_FILE="./lib/rangebar.js"
DEPS := $(shell browserify --list $(ENTRY_FILE))
TEST_FILES = "./test.js"
TRACEUR_RUNTIME := $(shell node -pe "require('es6ify').runtime")

all: dist/elessar.js
min: dist/elessar.min.js

dist/%.min.js: dist/%.js
	uglifyjs $< -o $@

dist/%.js: $(DEPS)
	mkdir -p $(@D)
	node brow.js $(ENTRY_FILE) $@

.PHONY: clean test

clean:
	rm -rf dist

test: $(DEPS) # :$(TEST_FILES)
	browserify -t es6ify $(TRACEUR_RUNTIME) $(TEST_FILES) | tape-run | tap-spec

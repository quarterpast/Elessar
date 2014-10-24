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
	node brow.js $(ENTRY_FILE) $@

.PHONY: clean test coverage release

clean:
	rm -rf dist

coverage: $(DEPS) $(TEST_FILES)
	browserify -t coverify $(TEST_FILES) | testling | coverify | tap-spec

test: $(DEPS) $(TEST_FILES)
	browserify $(TEST_FILES) | testling | tap-spec

tag: dist/elessar.js dist/elessar.min.js
	$(eval OLD_VERSION := $(shell git describe master --abbrev=0))
	$(eval VERSION := $(shell node_modules/.bin/semver $(OLD_VERSION) -i $(v)))
	tin -v $(VERSION)
	git commit -am $(VERSION)

release:
	git pull
	git push origin {develop,master}
	git push --tags
	git checkout `git describe master --abbrev=0`
	npm publ
	git checkout -
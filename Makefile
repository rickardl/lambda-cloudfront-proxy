.PHONY: install build

.DEFAULT_GOAL := install

install: test-builddeps
	@yarn install

test: test-builddeps
	@yarn test

build: test
	@yarn build

build-production: test-builddeps
	@NODE_ENV=production yarn build

###
# Misc stuff:
###
YARN_EXISTS := $(shell command -v yarn 2> /dev/null)

test-builddeps:
ifndef YARN_EXISTS
	$(error yarn is not installed. Follow the instructions on https://yarnpkg.com/docs/install)
endif
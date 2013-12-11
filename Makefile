test:
	node_modules/.bin/mocha --reporter list
benchmark:
	node benchmark/inline.js
.PHONY: test benchmark

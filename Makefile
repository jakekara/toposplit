bin: clean src/toposplit.js
	uglifyjs src/toposplit.js -o bin/toposplit.js
	chmod 755 bin/toposplit.js

install:
	npm install . -g

publish:
	npm publish .

clean:
	rm -f bin/toposplit.js

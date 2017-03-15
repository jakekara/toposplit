bin: clean src/toposplit.js
	uglifyjs src/toposplit.js -o bin/toposplit.js
	chmod 755 bin/toposplit.js

clean:
	rm -f bin/toposplit.js

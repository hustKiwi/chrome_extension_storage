ESLINT_PKG = eslint-config-airbnb

upgrade_eslint:
	npm info '$(ESLINT_PKG)@latest' peerDependencies --json | \
	command sed 's/[\{\},]//g ; s/: /@/g' | \
	xargs yarn add '$(ESLINT_PKG)@latest' -D --save

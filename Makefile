all:
	mkdocs build -c

deploy:
	mkdocs gh-deploy -b master --clean


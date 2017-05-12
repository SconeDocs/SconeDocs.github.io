all:
	mkdocs build -c

deploy:
	mkdocs gh-deploy --clean


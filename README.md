# SCONE documentation

This repository contains the SCONE documentation site. 


Before building the site, ensure that [mkdocs](http://www.mkdocs.org/) is installed on your system. 

```bash
sudo apt install -y mkdocs
```

To generate the documentation site, just execute 

```bash
make
```

If you want to try out the documents in a browser, execute

```bash
mkdocs serve
```

and point your browser to http://127.0.0.1:8000/ 

To push this to github execute:

```bash
docker login
./generate_docker_docu_container.sh
```


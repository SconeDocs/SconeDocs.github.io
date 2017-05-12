# SCONE: Host Installation Guide

This documentation describes how 

* to set up a host such that it can run SCONE secure containers, i.e., containers in which processes run inside of SGX enclaves,

The installation script

* installs the Intel SGX drive (if it is not yet installed), and

* installs a patched docker engine (if it is not yet installed).


**Prerequisite**:  We assume that you have Ubuntu 16.04LTS (or later) installed. 

## SCONE Documentation

To read more about our SCONE secure container framework, please ensure that docker is installed and then execute the following:

```bash
docker pull sconecuratedimages/sconedocu
docker run -d -p 8080:80  sconecuratedimages/sconedocu
open http://127.0.0.1:8080
```

## Patched Docker Engine

For an container to be able to use SGX, it has to have access to a device (/dev/isgx). This device permits the container to talk to the SGX driver, e.g., to create SGX enclaves. Some docker commands (like *docker run*) support an option --device (i.e., *--device /dev/isgx*) which allows us to give a container access to the SGX device. We need to point out that some docker commands (like *docker build*) do, however, not support the device option. Therefore, we maintain and install a slightly patched docker engine (i.e., a variant of moby): this engine ensures that each container has access to the SGX device (/dev/isgx).  With the help of this patched engine, we can use Dockerfiles to generate container images (see this [Tutorial](SCONE_Dockerfile.md)).


The installation is performed with the help of Debian packages hosted on https://sconecontainers.github.io/. Details of the installations are 

In case you have already a docker engine installed and want to install the patched engine, please remove the installed engine first manually:

```bash
sudo apt-get remove docker-engine
```

If you have a new installation, you might have *docker-ce* installed. In this case, execute the following:
```bash
sudo apt-get remove docker-ce
```

## Installation

To install all necessary software to run secure containers on a host, clone the script:

```bash
git clone https://github.com/christoffetzer/SCONE_HOSTINSTALLER.git
```

ensure that you are permitted to execute sudo and execute the following command:

```bash
cd SCONE_HOSTINSTALLER; sudo ./install.sh
```

The script should output 'OK' on success.

## Checking your Installation


To test the installation, one can run a simple hello-world container:

```bash
sudo docker run hello-world
```


## Future Work

* we plan to support hosts managed by Ubuntu MaaS to simplify the process of installing Docker and DockerSwarm. 
We plan to provide a preconfigured SCONE host images for MaaS - as soon as custom MaaS images are supported (again).

Author: Christof Fetzer, 2017

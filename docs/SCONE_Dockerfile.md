

# Dockerfile 

We show how to generate a Docker image with the help of a Dockerfile.

## Prerequisites

### Ensure that the sgx driver is installed

```bash
> ls /dev/isgx 
/dev/isgx
```

If the driver is not installed, read Section [SCONE Host Setup](SCONE_HOSTINSTALLER_README.md) to learn how to install the SGX driver.

### Ensure that the patched docker engine is installed

We need *docker build* in this example. This command does not permit to map devices in the newly created containers. Hence, we provide a patched Docker engine [SCONE Host Setup](SCONE_HOSTINSTALLER_README.md).

### Install the tutorial

Clone the tutorial: 

```bash
git clone https://github.com/christoffetzer/SCONE_TUTORIAL.git
```

### Access to SCONE Curated Images

Right now, access to the curated images is still restricted. Please, send email to scone.containers@gmail.com to request access.

## Generate HelloAgain image

We generate a *hello again* container image. 

```bash
cd SCONE_TUTORIAL/Dockerfile
```

The Dockerfile looks, feels like a standard docker image:

```Dockerfile
FROM sconecuratedimages/crosscompilers:sgxmusl-hw-async-gcc

MAINTAINER Christof Fetzer "christof.fetzer@gmail.com"

RUN mkdir /hello

COPY hello_again.c /hello/

RUN cd /hello && gcc hello_again.c -o again

CMD ["/hello/again"]
```


You can either execute all step manually (see below) or you can just execute
```bash
docker login
./generate.sh
```
and watch the outputs. The push of the image should fail since you should not have the access rights to push the image to Docker hub.


We define the image name and tag that we want to generate:
```bash
export TAG="again"
export FULLTAG="sconecuratedimages/helloworld:$TAG"
```

We build the image:
```bash
docker build --pull -t $FULLTAG .
```

We push it to docker hub (will fail unless you have the right to push *$FULLTAG*):

```bash
docker push $FULLTAG
```


Please change the image name to a repository on docker hub to which you can write:

```bash
export TAG="latest"
export IMAGE_NAME="sconecuratedimages/helloAgain"
```


Author: Christof Fetzer, 2017

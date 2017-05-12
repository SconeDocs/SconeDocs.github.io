

# Generating Container Image with SCONE

We show how to generate a Docker image that contains our *hello world* running inside of an enclave
and pushing this to docker hub. We show this 

## Prerequisites

Check that all prerequisites from [SCONE Tutorial](SCONE_TUTORIAL.md) are satisfied. 
Clone the SCONE_TUTORIAL before you start creating a *hello world* image.

## Generate HelloWorld image

We generate a *hello world* container image. 

```bash
cd SCONE_TUTORIAL/CreateImage
```

You can either execute all step manually by copy&pasting all instructions or you can just execute
```bash
docker login
sudo ./Dockerfile.sh
```
and watch the outputs.

Please change the image name to a repository on docker hub to which you can write:

```bash
export TAG="latest"
export IMAGE_NAME="sconecuratedimages/helloworld"
```

We generate container and compile hello world inside of this container with the help of our standard SCONE cross compiler:

```bash

CONTAINER_ID=`docker run -d -it --device=/dev/isgx  -v $(pwd):/mnt sconecuratedimages/crosscompilers bash -c "
set -e
sgxmusl-hw-async-gcc /mnt/hello_world.c  -o /usr/local/bin/sgx_hello_world
"`
```
Note that above will fail if you do not have access to the SGX device */dev/isgx*.

Turn the container into an image:

```bash
IMAGE_ID=$(docker commit -p -c 'CMD sgx_hello_world' $CONTAINER_ID $IMAGE_NAME:$TAG)
```

You can run this image by executing:

```bash
sudo docker run --device=/dev/isgx $IMAGE_NAME:$TAG
```

You can push this image to Docker. However, ensure that you first login to docker:

```bash
sudo docker login
```

before you push the image to docker hub:

```bash
sudo docker push $IMAGE_NAME:$TAG
```

Note: this will fail in case you do not have the permission to push to this repository. 



Author: Christof Fetzer, April 2017

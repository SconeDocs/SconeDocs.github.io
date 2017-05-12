#!/bin/bash
#
# (C) Christof Fetzer, 2017

set -x -e

export TAG="latest"
export FULLTAG="sconecuratedimages/sconedocu:$TAG"

echo "generating image $FULLTAG"
# ensure that docu is up to date
make
docker build -t $FULLTAG .

# to try this out 
## docker pull sconecuratedimages/sconedocu
## docker run -d -p 80:80 sconecuratedimages/sconedocu
## curl 127.0.0.1

# push image to docker hub

docker push $FULLTAG

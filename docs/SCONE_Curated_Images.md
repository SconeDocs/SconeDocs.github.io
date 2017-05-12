# SCONE Curated Images

We provide a set of curated SCONE container images on a (private) repositories on Docker hub:

* **sconecuratedimages/sconedocu**: contains containers related to our SCONE documentation 
* **sconecuratedimages/crosscompilers**: contains container images of the SCONE cross compilers 
* **sconecuratedimages/tutorial**: contains containers related to our SCONE tutorial 

# Scone Documentation

To run a local copy of the SCONE documentation, just perform the following steps:

```bash
docker pull sconecuratedimages/sconedocu
docker run -d -p 8080:80  sconecuratedimages/sconedocu
```

View the documentation in your browser at http://127.0.0.1:8080 .
On a MAC, just type:

```bash
open http://127.0.0.1:8080
```

to view this docu.

# Login in

Access to some SCONE images is still restricted. First, get access
to the images by sending email to scone.containers@gmail.com. 
Second, log into to docker hub via:

```bash
docker login
```

before you pull any of the curated images.



# Scone Cross-Compilers

To run a local copy of the SCONE cross compilers, just pull the appropriate image on your computer.

In case you do not have SGX CPU extension / no SGX driver installed on your computer,
you can use our simulation environment. This runs the SCONE software but provides **no protection
of the confidentiality nor integrity** of your application:

```bash
sudo docker pull sconecuratedimages/crosscompilers:gcc-sim
```

To install our standard scone C / C++ cross compiler, just perform the following
steps.

```bash
sudo docker pull sconecuratedimages/crosscompilers
```

# Scone Hello World

You can pull the following image:

```bash
sudo docker pull sconecuratedimages/helloworld
```

and run the helloworld program inside of an enclave via

```bash
> sudo docker run --device=/dev/isgx sconecuratedimages/helloworld
Hello World
```

this will fail, in case you do not provide the container with the sgx device:

```bash
> sudo docker run sconecuratedimages/helloworld
error opening sgx device: No such file or directory
```

Note, if you installed the modified Docker Engine that we provide, a container gets
by default access to device */dev/isgx*, i.e., in this case no error would occur.




Author: Christof Fetzer, 2017

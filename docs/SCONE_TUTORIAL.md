
# SCONE Tutorial

## Prerequisites

### Ensure that the sgx driver is installed

```bash
> ls /dev/isgx 
/dev/isgx
```

If the driver is not installed, read Section [SCONE Host Setup](SCONE_HOSTINSTALLER_README.md) to learn how to install the SGX driver.

### Install sgxmusl cross compiler image

Ensure that you installed the sgxmusl:draft container image:

```bash
> docker image ls sconecuratedimages/crosscompilers
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
sconecuratedimages/crosscompilers   gcc-sim             e5cabb3682d6        17 hours ago        1.18 GB
sconecuratedimages/crosscompilers   gcc-sync            a4768b000fcc        18 hours ago        1.18 GB
```

If the cross compiler image is not yet installed, read Section [SCONE Curated Container Images](SCONE_Curated_Images.md) to learn how to install the SCONE cross compiler image.

## Install the tutorial

Clone the tutorial: 

```bash
git clone https://github.com/christoffetzer/SCONE_TUTORIAL.git
```


## Native Hello World 

Ensure that *hello world* runs natively on your machine:

```bash
cd SCONE_TUTORIAL/HelloWorld/
gcc hello_world.c  -o native_hello_world
./native_hello_world
Hello World
```
## SIM Hello World 

Now, let us compile *hello world* with the help of a cross compiler image that creates binaries that include all SCONE software 
but the services run actually outside of enclave. We call this variant *sim* and made available in image *sconecuratedimages/crosscompilers:gcc-sim*
that you can pull from docker hub.

The sim variant simplifies debugging. *sim* is, however, not 100% identical with the *async* branch (i.e., the recommended branch to run applications inside of enclaves).
Hence, debugging using *sim* might not be possible for all bugs. 

```bash
sudo docker run --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp sconecuratedimages/crosscompilers:gcc-sim sgxmusl-sim-gcc /usr/src/myapp/hello_world.c  -o sim_hello_world
./sim_hello_world
Hello World
```

Note that the generated executable, i.e., *sim_hello_world*, will only run on Linux. 

## SGX ASYNC Hello World 

The default cross compiler variant that runs *hello world* inside of an enclave is *sgxmusl-hw-async-gcc* and you can find this in container *sconecuratedimages/crosscompilers*. 
This variant requires access to the SGX device. 
In Linux, the SGX device is made available as */dev/isgx* and we can give the cross compiler inside of an container access via option *--device=/dev/isgx*:

```bash
sudo docker run --rm --device=/dev/isgx -v "$PWD":/usr/src/myapp -w /usr/src/myapp sconecuratedimages/crosscompilers sgxmusl-hw-async-gcc /usr/src/myapp/hello_world.c  -o sgx_hello_world
./sgx_hello_world
Hello World
```

The compilation as well as the hello world program will fail in case you do not have the appropriate driver installed.

## Run STRACE

Lets see how we can trace the program. Say, you have compile the program as shown above. After that you enter a cross compiler container and strace hello world as follows:


```bash
sudo docker run --cap-add SYS_PTRACE -it --rm --device=/dev/isgx -v "$PWD":/usr/src/myapp -w /usr/src/myapp sconecuratedimages/crosscompilers bash
strace  -f /usr/src/myapp/sgx_sync_hello_world
```

## Run ShellScript




Author: Christof Fetzer, April 2017


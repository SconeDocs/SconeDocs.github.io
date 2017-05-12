# SCONE SGX Toolchain 

SCONE comes with cross-compilers for popular languages: C, C++, GO, Rust as well as Fortran.
The objective of these cross compilers are to compile applications - generally without source code changes - such
that they can run inside of SGX enclaves.

To simplify the use of these cross-compilers, SCONE maintains curated container image that includes these cross-compilers.


# Using the C/C++ compiler container

How to use the compiler:

* use this as a base image and build your programs inside of a container (see [Dockerfiles](SCONE_Dockerfile.md)), or 

* map volumes such that the compiler can compile files living outside the container (see [SCONE Tutorial](SCONE_TUTORIAL.md)). This is probably only practical for small projects.

## Example

One can use the compiler by giving it access to external files as follows:
```bash
docker run --rm --device=/dev/isgx -v "$PWD":/usr/src/myapp -w /usr/src/myapp sgxmusl:draft sgxmusl-hw-async-gcc /usr/src/myapp/myapp.c
```

See our *hello world* in Section [SCONE Tutorial](SCONE_TUTORIAL.md). This is kind of awkward and hence, we
provide a simpler version with the help of [Dockerfiles](SCONE_Dockerfile.md). 

# Compiler variants

The SCONE SGX toolchain supports multiple C and C++ cross compilers variants. In future, we will probably only support a single variant. Hence, we recommend the use of the cross compiler as shown in [Dockerfiles](SCONE_Dockerfile.md).

Currently, the SCONE SGX toolchain supports the following variants of C and C++ cross compilers:

* *hw-async*: generates enclaved programs that use the SCONE asynchronous system call interface, i.e., threads do not exit the enclave to execute a system call. For a technical explanation see [SCONE paper in OSDI2016]. 

* *hw-shielded*: this variant based on *hw-async* that additionally supports transparent file protection (i.e., transparent encryption von files) and transparent socket protection (i.e., encryption via TLS).  

* *hw-sync* [measurements only]: this variant uses synchronous system calls, i.e., threads leave the enclave to perform a system call. We maintain this variant for measurement purposes only and we recommend to use *hw-async* instead.

* *sim* [SCONE development only]: does not need SGX CPU extension and can, for example, be used to develop on machines without SGX support. This is not 100% compatible to *hw-async* (yet) and hence, do not use this variant - unless you are aware that the limitations are ok for you.

* *sim-shielded* [SCONE development only]: this variant based on *sim* that additionally supports transparent file protection (i.e., transparent encryption von files) and transparent socket protection (i.e., encryption via TLS).  

# Debugger support

We also support *gdb* to debug applications running inside of enclaves. 

# Future work

* describe the use of the debugger.


Author: Christof Fetzer, 2017

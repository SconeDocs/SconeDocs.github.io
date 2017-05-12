# SCONE stack


** NOTE: THIS FUNCTIONALITY WILL ONLY BECOME AVAILABLE FOR EVALUATION in May 2017. The interface is still subject to change. **


Note that we decided to extend Docker stack file instead of a Docker compose file. One reason is that Docker stack supports device mappings while new compose files (v3) do not support this anymore.

SCONE implements extensions of the standard Docker stack file [[reference]](https://docs.docker.com/docker-cloud/apps/stack-yaml-reference/). A stack file is a YAML file that is used to build *stack*, i.e., an application consisting of a collection of containers. The main objective of the SCONE extensions is to enable stacks consisting of secure and standard containers. To secure containers, we need to be able to pass confidential data - like configuration files - without this data being visible to Docker or any other system software. Actually, we recommend that this information is not even visible to the programmer writing the stack file. For example, by having no secrets in the stack file, one can reuse the stack files in different contexts. Moreover, one does not need to change the keys in the stack file if some person that had access to the stack file leaves the company.  

To avoid keys inside of extended stack files, our extensions support the use of a key storage. One can automatically generate new keys or can reuse old keys - say after an update of a compose file. Also, one can share keys between different stacks. 

The extended stack file is split by SCONE into a standard compose file and a configuration information that is stored in the key store

 ![*scone stack deploy*](IMG/scone_stack_deploy.png)

The command line is similar to that of Docker:

```bash
scone stack deploy [OPTIONS] STACK
```
where STACK is the name of the stack file.


Note that the key storage can only be accessed by command *scone stack deploy* and by the enclaved process. 
The enclaved process needs to show the proper certificate showing that it runs inside an enclave as well as
belong to the same stack. Each stack has a unique ID which is passed - in the clear - to the started secure container. 

## Confidentiality and Integrity

We set defaults such that we can use a standard Docker stack file and we will start it that all data is encrypted
by default. A developer can opt-out from these defaults, for example, by not encrypting data that is already encrypted by the application code.  

## image (required)

A stack is a collection of *services* and for each service in a *stack*, one *image* key must be defined.  To run an secure service (i.e., a service running inside an enclave), we need to specify an enclave certificate. Only a service running inside an enclave matching this certificate can access the environment, arguments and configuration data.

Scone stack will retrieve this certificate from the key store
using the certificate in directory *images* matching the image name:

```YAML
image: sconecontainers.com/mysql:latest
```

In this case, the certificate would be retrieved from the key store via name *images/sconecontainers.com/mysql:latest*. If this certificate is not found or does not match the actual enclave certificate, this service will not be able to start up. 


*We evaluate the following scone stack extensions.*

The stack file can specify the enclave certificate explicitly:

```YAML
image: sconecontainers.com/mysql:latest
  enclave-certificate: Base64encoded
```

Alternatively, the stack file can specify an alternative key to retrieve the certificate from the
key storage:

```YAML
image: sconecontainers.com/mysql:latest
  enclave-certificate: \(myimage_certificates/sconecontainers.com/mysql:latest)
```


To mix secure and standard containers, one can optionally also provide the key *insecure-image*:

```YAML
image: mysql
  insecure-image
```

**Summary:** the first version of *scone stack* will only support certificates that are implicitly loaded from the key store.
Explicit keys inside the stack file or alternative certificate locations, might be supported in future versions of *scone stack* 


## devices

We need to make sure that */dev/isgx* is mapped into secure containers. Hence, by default 
*scone stack deploy* will add the follow device mapping to all secure containers. 

```YAML
devices:
  - "/dev/isgx:/dev/isgx"
```

**Note:** In case this mapping already exists in the stack file, this device mapping is only added once. While Docker compose version 3 does not support device option anymore, stack files do support a device option.


## environment

One can define environment variables that are not visible to docker and are passed in a secure fashion to
the applications. These definitions overwrite the environment variables given in the container image.

**Example:**

```YAML
environment:
  - RACK_ENV=development
  - SHOW=true
  - SESSION_SECRET="blabla"
```

We can retrieve sensitive entries from the key store before passing this to the application:

```YAML
enclave-environment:
  - RACK_ENV=development
  - SHOW=true
  - SESSION_SECRET=\(vault.{namespace}.MYSQL_ROOT_PASSWORD)
```
The evaluation is performed at the time when the program starts up.


## pid

Some applications use the pid to compute random numbers. This is of course not a good idea. Instead of requiring
to change these applications we have an option to set a random pid.  

```YAML
pid: "random"
```

We have also support fixed pids, i.e., one can set the pid of this process. To set the process
to 42, just specify:

```YAML
pid: "42"
```

SCONE supports also the **pid** options of Docker like "host"  

## enclave-tmpfs

Mounts a temporary file system. SCONE supports an encrypted temporary file system. 
The key for the temporary file system is randomly chosen:

```YAML
enclaved-tmpfs: /run
enclaved-tmpfs:
  - /run
  - /tmp
```

**TODO**: check why this option is not supported by v3?

**TODO**: does it make sense that if *enclaved-tmpfs* is specified, *tmpfs* must not be specified?

## enclave-env_file

We do not support an enclaced version of env_file yet. Please use enclave-environment instead.

**TODO**: would it make sense to support **enclave-env_file**?




## enclave-extra_hosts:

Add extra entries to /etc/hosts in a secure fashion:

```YAML
extra_hosts:
 - "somehost:162.242.195.82"
 - "otherhost:50.31.209.229"
```

**TODO**: ensure that we can 

## file-protection

```YAML
file-protection:
  fail-on-r-unencrypted;
  fail-on-w-unauthenticated;
```

## secure-file-inject

One can inject files from the compose host into the image.
*secure-file-inject* injects files that are not encrypted on the compose host
but must be encrypted in the container. Since sensitive files on the compose host 
should be encrypted too, use this variant only for debugging.

```YAML
secure-file-inject:
  .git-credentials:.git-credentials
```

The preferred use of *secure-file-inject* is to retrieve the file content from 
a key store. The following variant retrieves the content of an injected file from the key store.
This requires to specify a *key*. This key is used to retrieve the content.
The key is prefixed by the unique key of the *deployed stack*.

```YAML
secure-file-inject:
  vault:
    key: git-credentials
    file:.git-credentials
```

## image

specify signer of an image and the version of the image.

```YAML
 image: curated_mysql
     enclave-signer: SCONE-LTD.COM
     enclave-version: 2.1-
```

## tty

```YAML
tty: true
    tty-encryption-key:  tty-passwd
```

```YAML
tty: true
    tty-encryption-key:  \(TTY-KEY)
```

Syntactic sugar for ..:
```YAML
enclave-tty: true
```

## stdin_open

```YAML
stdin_open: true
 tty-encryption-key:  in-pswd
```

## file-encryption

## socket-encryption

## lease management

We use leases to perform to address the following two problems:

- we might need to enforce some periodic rekeying of keys that are included in configuration files

- we might need to ensure that the number of replicas is bounded, for example, we might only permit one replica of a service. 

To solve these two problems we permit to define per service how many leases are permitted and 

Hence, we would need to reread all configuration files periodically. 

Author: Christof Fetzer, January 2017

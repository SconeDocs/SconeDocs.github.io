# SCONE Related Publications

**SCONE: Secure Linux Containers with Intel SGX, USENIX, OSDI 2016**

 This paper describes how we support unmodified applications inside of enclaves. The focus is on our asynchronous system
 call interface.

 - **Authors**:  Sergei Arnautov, Bohdan Trach, Franz Gregor, Thomas Knauth, André Martin, Christian Priebe, Joshua Lind, Divya Muthukumaran, Daniel O'Keeffe, Mark L Stillwell, David Goltzsche, Dave Eyers, Rüdiger Kapitza, Peter Pietzuch, Christof Fetzer

 - **Media**: [pdf](https://www.usenix.org/system/files/conference/osdi16/osdi16-arnautov.pdf), [slides](https://www.usenix.org/sites/default/files/conference/protected-files/osdi16_slides_knauth.pdf)
[audio](https://www.usenix.org/conference/osdi16/technical-sessions/presentation/arnautov)

 - **Abstract**:  In multi-tenant environments, Linux containers managed by Docker or Kubernetes have a lower resource footprint, faster startup times, and higher I/O performance compared to virtual machines (VMs) on hypervisors. Yet their weaker isolation guarantees, enforced through software kernel mechanisms, make it easier for attackers to compromise the confidentiality and integrity of application data within containers.
We describe SCONE, a secure container mechanism for Docker that uses the SGX trusted execution support of Intel CPUs to protect container processes from outside attacks. The design of SCONE leads to (i) a small trusted computing base (TCB) and (ii) a low performance overhead: SCONE offers a secure C standard library interface that transparently encrypts/decrypts I/O data; to reduce the performance impact of thread synchronization and system calls within SGX enclaves, SCONE supports user-level threading and asynchronous system calls. Our evaluation shows that it protects unmodified applications with SGX, achieving 0.6x–1.2x of native throughput.


** SGXBounds: Memory Safety for Shielded Execution, EuroSys 2017**

 To protect the code running inside of an enclave, we implemented a novel bounds checker for enclaves. While we had expected
 to just be able to use MPX, we had to realized that MPX does not perform that well inside of enclaves. For details regarding
 the overheads,  please see this paper. **This won the best paper award of EuroSys 2017.**

 - **Authors**: D. Kuvaiskii, O. Oleksenko, S. Arnautov, B. Trach, P. Bhatotia, P. Felber, C. Fetzer 

 - **Media**: [pdf](http://se.inf.tu-dresden.de/pubs/papers/sgxbounds2017.pdf) 

 - **Abstract**: Shielded execution based on Intel SGX provides strong security guarantees for legacy applications running on untrusted platforms. However, memory safety attacks such as Heartbleed can render the confidentiality and integrity properties of shielded execution completely ineffective. To prevent these attacks, the state-of-the-art memory-safety approaches can be used in the context of shielded execution. In this work, we first showcase that two prominent software- and hardware-based defenses, AddressSanitizer and Intel MPX respectively, are impractical for shielded execution due to high performance and memory overheads. This motivated our design of SGXBounds -- an efficient memory-safety approach for shielded execution exploiting the architectural features of Intel SGX. Our design is based on a simple combination of tagged pointers and compact memory layout. We implemented SGXBounds based on the LLVM compiler framework targeting unmodified multithreaded applications. Our evaluation using Phoenix, PARSEC, and RIPE benchmark suites shows that SGXBounds has performance and memory overheads of 18% and 0.1% respectively, while providing security guarantees similar to AddressSanitizer and Intel MPX. We have obtained similar results with four real-world case studies: SQLite, Memcached, Apache, and Nginx.

** FFQ: A Fast Single-Producer/Multiple-Consumer Concurrent FIFO Queue, IPDPS 2017**

This paper describes our new lock-free queue for our asynchronous system calls.

- **Authors**: Sergei Arnautov, Pascal Felber, Christof Fetzer and Bohdan Trach

- **Media**: *sorry, not yet available* 

- **Abstract**:  With the spreading of multi-core architectures, operating systems and applications are becoming increasingly more concurrent and their scalability is often limited by the primitives used to synchronize the different hardware threads. In this paper, we address the problem of how to optimize the throughput of a system with multiple producer and consumer threads. Such applications typically synchronize their threads via multi- producer/multi-consumer FIFO queues, but existing solutions have poor scalability, as we could observe when designing a secure application framework that requires high-throughput communication between many concurrent threads. In our target system, however, the items enqueued by different producers do not necessarily need to be FIFO ordered. Hence, we propose a fast FIFO queue, FFQ, that aims at maximizing throughput by specializing the algorithm for single-producer/multiple-consumer settings: each producer has its own queue from which multiple consumers can concurrently dequeue. Furthermore, while we pro- vide a wait-free interface for producers, we limit ourselves to lock-free consumers to eliminate the need for helping. We also propose a multi-producer variant to show which synchronization operations we were able to remove by focusing on a single producer variant. Our evaluation analyses the performance using micro- benchmarks and compares our results with other state-of-the-art solutions: FFQ exhibits excellent performance and scalability.


Author: Christof Fetzer, January 2017

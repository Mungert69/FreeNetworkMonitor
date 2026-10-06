## Two different properties

A post-quantum TLS key exchange protects the connection’s shared-secret establishment with the tested algorithm. A post-quantum certificate uses a post-quantum signature or key property. A server may support one without the other.

Use `quantum` for recurring key-exchange checks and `quantumcert` for recurring certificate inspection. The assistant’s Quantum expert provides on-demand equivalents and explanations. Ordinary reachability, certificate trust and elapsed time remain separate facts; check the returned status.

## Test a server

Choose an agent that can reach the server and provide its hostname and TLS port. Ask: “Using my selected agent, test the post-quantum TLS key exchange on example.com port 443, then inspect its certificate. Explain the difference between the results.”

Quantum Secure also provides dedicated single-host checks and local discovery views on supported [Windows](/docs/windows/) and [Android](/docs/android/) builds. To keep watching a service, add a host using the appropriate [endpoint](/docs/endpoints/).

## Discover services and understand algorithms

The Quantum expert can scan specified ports and retrieve algorithm information. Catalogue information explains an algorithm; it does not mean your agent or server can negotiate every listed algorithm. Runtime coverage depends on bundled libraries, providers, versions and configuration.

[ESP32](/docs/esp32/) uses a limited compiled set of key-exchange groups and bounded port scanning. Do not interpret its result as a complete desktop scan or a test of every cryptographic dependency.

## Interpret the result

A successful check establishes the tested property for that service and available algorithm set. It does not certify an entire organisation as quantum-safe. A failed negotiation can reflect configuration, network reachability or incompatible support; read the diagnostic text before deciding which.

Useful primary sources: [NIST post-quantum cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography), [Open Quantum Safe](https://openquantumsafe.org/), [OQS OpenSSL provider](https://github.com/open-quantum-safe/oqs-provider).

Next: [diagnostics](/docs/diagnostics/), [alerts](/docs/alerts/) and [reports](/docs/reports/).

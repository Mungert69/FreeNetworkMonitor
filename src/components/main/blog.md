
---

# Going Quantum-Safe with TLS: Practical Steps in 2025

The race is on to prepare our infrastructure for a post-quantum world. Attackers are already “harvesting now, decrypting later”: collecting encrypted data today in hopes of breaking it with quantum computers tomorrow. The good news is that, with recent OpenSSL releases, we can start defending against this today — without custom patches or exotic providers.

---

## Why Quantum-Safe TLS Matters

Classical TLS depends on elliptic-curve (ECDHE) or RSA key exchange. Both will be broken by sufficiently large quantum computers using Shor’s algorithm. The solution is **post-quantum cryptography (PQC)**: new key encapsulation mechanisms (KEMs) and digital signatures designed to resist quantum attacks.

For TLS, the critical step is replacing or *hybridizing* the **key exchange**. This ensures session keys negotiated today can’t be decrypted tomorrow — even if the certificate itself is still RSA or ECDSA.

---

## Enter OpenSSL 3.5: Hybrid KEMs Out of the Box

Until recently, experimenting with PQ required patched forks (like the OQS-OpenSSL provider). That’s no longer true.

**OpenSSL 3.5**, released in 2024 and now shipping in modern distros, adds **built-in support** for NIST-selected ML-KEM (formerly Kyber) hybrids:

* `X25519MLKEM768`
* `SecP256r1MLKEM768`
* `X448MLKEM768`
* `SecP384r1MLKEM1024`

These groups combine a classical key exchange (X25519, P-256, X448, P-384) with a quantum-safe ML-KEM variant. And they’re **in the default TLS 1.3 group list, preferred by default**.

So any software linked against **OpenSSL ≥3.5** can automatically negotiate hybrid PQ TLS with compatible clients.

---

## Where Can You Use It Today?

* **Debian 13 “Trixie”**: Ships OpenSSL 3.5.1 by default. Any NGINX, Apache, HAProxy, or curl package built on it can negotiate PQ KEMs.
* **Fedora (Rawhide, Fedora 43+)**: Includes OpenSSL 3.5.
* **Rocky Linux 9.7 / 10.1 (late 2025)**: Expected to ship 3.5.
* **RHEL / AlmaLinux / SUSE**: Currently on OpenSSL 3.0; 3.5 integration expected in upcoming releases.

On Windows, Microsoft is shipping PQ crypto in **Insider builds** and through the **SymCrypt-OpenSSL 1.9.0** provider, with a roadmap to make PQ default by 2033.

---

## A Minimal Quantum-Safe NGINX Setup (Debian 13)

Here’s how simple it can be:

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate     /etc/ssl/certs/site.crt;
    ssl_certificate_key /etc/ssl/private/site.key;

    ssl_protocols TLSv1.3;

    # Prefer PQ hybrids
    ssl_conf_command Groups "X25519MLKEM768:*X25519:secp256r1";

    location / {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

Notes:

* Certificates remain RSA/ECDSA for browser trust.
* The hybrid protection is in the **key exchange**, not the cert.
* If you don’t set `ssl_conf_command`, OpenSSL 3.5 still prefers hybrids by default — but being explicit avoids surprises.

---

## Testing That It Works

On a client with OpenSSL 3.5:

```bash
openssl s_client \
  -connect example.com:443 \
  -tls1_3 \
  -groups X25519MLKEM768 \
  -no-CAfile -no-CApath </dev/null \
  | grep -Ei 'Protocol|Cipher|Group'
```

Expected output:

```
Protocol  : TLSv1.3
Cipher    : TLS_AES_256_GCM_SHA384
Group     : X25519MLKEM768
```

That line confirms the hybrid KEM is active.

---

## What About Certificates?

Today’s browsers and CAs don’t yet accept PQ signature algorithms (like ML-DSA or SLH-DSA). So your cert will stay RSA or ECDSA for the foreseeable future. That’s fine — the main confidentiality risk is in the **key exchange**, which PQ hybrids already fix.

Over the next few years, expect hybrid or pure-PQC certificates to emerge as browsers and PKI catch up.

---

## Microsoft’s Roadmap

Microsoft is pushing PQ across Windows, Active Directory, and Azure. Their **Quantum Safe Program (QSP)** aims to:

* Make PQ crypto available in early builds by 2029,
* Ship PQ as the **default** by 2033.

If you use Windows Insider Canary builds today, you can already test PQ TLS with SymCrypt-OpenSSL.

---

## Takeaways

1. **Debian 13 and other OpenSSL 3.5 distros let you deploy PQ TLS today — no patches, no providers.**
2. **PQ is already enabled by default** for TLS 1.3 connections; just confirm your apps are linked against OpenSSL 3.5.
3. Certificates stay classical for now; PQ signatures will come later.
4. Microsoft and the Linux ecosystem are converging on the same ML-KEM standard, giving us a clear migration path.

**Bottom line:** If you’re deploying new infrastructure in 2025, choose a distro with OpenSSL 3.5. You’ll be “ready for quantum” now, not ten years from now.

---

# Security

Velora is a single-user, local tool. The native app runs guests as your user and needs no root, kernel extension
or kernel extension. Network listeners exist only when you turn them on: the OpenAI-compatible gateway (hashed API keys) and the fleet agent (TLS with a pinned certificate and a bearer token). No user text is passed to a shell.

Guests are real VMs with NAT networking. The default cloud-init account is `velora` / `velora` with passwordless
`sudo`: **change the password, or rely on your SSH key, before exposing a guest to anything but your own Mac.**

Report vulnerabilities privately to ssahani@zyvor.dev.

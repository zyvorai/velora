# What is verified

This page says what has been run, and what has not. It is updated with each release.

## Verified (Apple M4, macOS 27.2, Xcode 27.0)

- Native app builds and runs; ad-hoc signed developer build.
- Debian 13 and Ubuntu 26.04 LTS ARM64 guests: download → disk preparation → boot → cloud-init → guest address
  → SSH, using the app's built-in self-test.
- Display, pause/resume wiring and the address bar render in the app (screenshots in `docs/ux/`).

The local AI platform (MLX models and endpoints, training, files search, fleet, FluxVM link) and the app's own self-tests were run on the same Mac; multi-Mac fleets, Thunderbolt clusters and a second physical Mac were not tested.

## Not verified

- That the Shortcuts app lists Velora's actions, Siri phrase recognition, and running an action while the app is closed (the build
  embeds the metadata and the actions run in tests, but Shortcuts' own database cannot be read from here).
- The Services entry appearing in other apps' menus (macOS caches services).
- A phone scanning the QR code, Bonjour discovery of the gateway from another device, and a gateway bound to the network
  (the tests stay on loopback).
- A real Mac that has never been online using the offline bundles; Open at login (it changes the Mac's login items).
- Retrieval quality on real folders (tested on a handful of short documents; the embedding model is English only), the speed
  gain from the prompt cache, and tool calling with a model that supports it (the 0.5B model tries but the server cannot parse it).
- Clicking through the Playground's "Use my files", the deploy sheet, Benchmark, Test Tools, Export/Import panels and Settings.
- macOS guest install and boot (`VZMacOSInstaller` path is implemented but unrun; ≈17 GB download).
- Drag-and-drop of `.ipsw`/`.iso` onto the window.
- Linux/QEMU GPU acceleration (`virtio-vga-gl`) and KVM on real hardware.
- Notarization: the app is **not** notarized; first launch of a downloaded build needs the usual Gatekeeper override.

## Licensing note

Apple's licence governs macOS guests (Tahoe Section 2B(iii): two additional virtual instances on each Apple-branded Mac you own or
control, for development, testing, macOS Server or personal non-commercial use; no service bureau or time-sharing use). Velora
defaults to two active macOS guests in the native app and the Python service. See [MACOS-LICENSING.md](../MACOS-LICENSING.md).
This is not legal advice.

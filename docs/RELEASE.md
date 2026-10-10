# What is verified

This page says what has been run, and what has not. It is updated with each release.

## Verified (Apple M4, macOS 27.2, Xcode 27.0)

- Native app builds and runs; ad-hoc signed developer build.
- Debian 13 and Ubuntu 26.04 LTS ARM64 guests: download → disk preparation → boot → cloud-init → guest address
  → SSH, using the app's built-in self-test.
- Display, pause/resume wiring and the address bar render in the app (screenshots in `docs/ux/`).

The local AI platform (MLX models and endpoints, training, files search, fleet, FluxVM link) and the app's own self-tests were run on the same Mac; multi-Mac fleets, Thunderbolt clusters and a second physical Mac were not tested.

## Next release (0.4)

Run on the same Apple M4 (macOS 27.2) with the app's self-tests, before the build is published:

- **Machines** (real Debian 13 guest): shared folder read and write, a `127.0.0.1` port forward reaching the guest's sshd,
  commands with separate output and exit code, file copy both ways, the vsock agent (commands as `velora`, a 2 MB file, a
  timeout, still answering with the guest's network down, SSH fallback and **Install Agent**), the live console, suspend and
  resume without a reboot, snapshot and restore, one operation per machine at a time, and a clone that boots with its own
  hostname. One run's resume came back without SSH while other VMs were starting on the same network; later runs resumed cleanly.
- **Models:** benchmark of a small model (time to first token 37 ms median, 144 ms p95; 167 tokens/s), the result kept across
  restarts; a model too big for the Mac refused before download.
- **FluxVM:** create with forwards and shared folders, commands, file copy, console stream, snapshot and restore, clone.
- **Fleet** (loopback): each node reports the app version, thermal state, memory pressure, Thunderbolt links and RDMA status.
- **One model across Macs:** only the wiring, against a stand-in for EXO on one Mac.

Not yet: a macOS guest install with `--selftest macos` (the restore image is about 25 GB), two physical Macs, Thunderbolt and RDMA,
real EXO sharding, and a notarized build (the release workflow notarizes once Developer ID secrets are added).

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

# FluxVM in Velora

![FluxVM screen](ux/app-dark-fluxvm.png)

[FluxVM](https://github.com/zyvorai/zyvor-fluxvm) is a VM control plane with a REST API, a scheduler and `fluxctl`. Its Mac port adds a **`vz` backend** that runs VMs on Apple's Virtualization.framework, so the same API that drives KVM on Linux can drive VMs on a Mac.

## What it does in Velora
**Infrastructure → FluxVM** supervises a local `fluxctl serve` daemon (API on `127.0.0.1:7788`), lists its VMs with their addresses (`ssh velora@…`), and lets you create, pause, resume, stop and delete them. Every running FluxVM VM is reserved in Velora's memory ledger, so models, training and VMs share one honest picture.

## Use it
1. Build FluxVM (see its `docs/macos.md`): `cargo build -p fluxctl` also builds and ad-hoc signs the Virtualization.framework runner. Velora finds `fluxctl` via `FLUXVM_FLUXCTL`, `~/.cargo/bin`, or a sibling `fluxvm` checkout.
2. Open **FluxVM** and press **Start** (it also starts when you open the screen).
3. **New VM…**: choose a raw ARM64 Linux disk (qcow2 must be converted), CPUs and memory. The image is cloned (APFS, instant) and booted with cloud-init: user `velora`, your SSH keys and Velora's key.
4. Equivalent without the app: `fluxctl serve`, then `POST /v1/vms` with `"backend": "vz"` (on a Mac, `"auto"` resolves to `vz`).

## How it fits with the rest
- **[Kairon](kairon.md)** sends Machines to this same daemon: Kairon is the scheduler, FluxVM is the engine.
- A signed runner process per VM holds the `VZVirtualMachine` and reports the guest's address, which macOS offers no other way to learn.

## Verified and not
**Verified** on an Apple M4, macOS 27.2: FluxVM's live test (create, SSH, pause, resume, stop, restart, delete) and Velora's `--selftest fluxvm` (REST create, ledger accounting, delete). **Not verified:** macOS guests, the guest-agent vsock proxy, Intel Macs. **Not supported by `vz`:** tap networking, port forwards, NUMA, hugepages, hotplug, TPM, data disks, live migration. NAT only; the guest is reached at its address from the Mac.

Tutorial: [5. FluxVM and Kairon on a Mac](tutorials/05-fluxvm-and-kairon-on-a-mac.md).

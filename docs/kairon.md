# Kairon in Velora

![Kairon screen](ux/app-dark-kairon.png)

[Kairon](https://github.com/zyvorai/zyvor-kairon) schedules `Machine` resources through a Kubernetes API. Its Mac port makes **this Mac a Kubernetes Node**: `kairon-node` registers the Mac and starts Machines through [FluxVM](fluxvm.md)'s `vz` backend. Velora ties the pieces together: it hosts the Kubernetes API ([a k3s cluster](kubernetes.md)), runs FluxVM, and now supervises Kairon.

## What it does in Velora
**Infrastructure → Kairon** shows the requirements (a cluster, FluxVM running, the Kairon binaries), starts and stops `kairon-controller` and `kairon-node` against a cluster, shows **this Mac as a Node** (Ready, arch, `backend.vz`, allocatable CPU and memory) and the **Machines** with their phase, node and guest address, and can apply a sample Machine.

## Use it
1. **Create a cluster** under Kubernetes and **Start** FluxVM.
2. Get Kairon: a checkout of `zyvor-kairon` (set `KAIRON_DIR`, or keep it next to Velora or at `~/tt/tt/kairon`) and Go. Press **Build**; Velora builds `kairon-controller` and `kairon-node` into its own folder. (Or set `KAIRON_CONTROLLER` and `KAIRON_NODE`.)
3. Press **Start**. Velora applies Kairon's CRDs and RBAC, creates 12-hour ServiceAccount tokens, and starts both processes. Within seconds this Mac appears as a Ready Node carrying the `kairon.zyvor.dev/vm-only` taint (there is no kubelet).
4. **Apply Sample Machine** boots Debian 13 on this Mac (backend `vz`, your SSH key) from Velora's cached image. The Machine shows `Running` and `ssh velora@<address>`.
5. The trash button deletes the Machine and FluxVM removes the VM. **Stop** stops Kairon and removes the Node.

By hand, the same flow is `scripts/macos-e2e.sh` in the Kairon repository (see its `docs/macos.md`).

## How the pieces connect
`Machine` (Kubernetes API in a Velora VM) → `kairon-controller` schedules it to the Mac Node → `kairon-node` calls FluxVM → FluxVM boots the guest on Virtualization.framework → `status.guestIP` flows back to the Machine.

## Verified and not
**Verified** on an Apple M4, macOS 27.2: Kairon's `scripts/macos-e2e.sh` against a Velora-hosted single-node k3s cluster, and Velora's `--selftest kairon` (node Ready, Machine scheduled and Running with `guestIP`, SSH, delete). **Not verified:** macOS guests, live migration, CSI, multi-Mac clusters. Kairon keeps all state in a Kubernetes API, so a Mac still needs a cluster to talk to; Machines get NAT networking only.

Tutorial: [5. FluxVM and Kairon on a Mac](tutorials/05-fluxvm-and-kairon-on-a-mac.md).

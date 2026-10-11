<div align="center">

<img src="docs/social/velora-icon-1024.png" width="128" alt="Velora icon">

# Velora

**VMs, models and clusters on your Mac.**

[![Release](https://img.shields.io/badge/release-v0.4.0%20pre--release-0a84ff?logo=github)](https://github.com/zyvorai/velora/releases/tag/v0.4.0)
[![Download .pkg](https://img.shields.io/badge/download-.pkg-30d158?logo=apple&logoColor=white)](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.pkg)
[![Download .dmg](https://img.shields.io/badge/download-.dmg-64d2ff?logo=apple&logoColor=white)](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.dmg)
[![Website](https://img.shields.io/badge/website-zyvorai.github.io%2Fvelora-8e7cff)](https://zyvorai.github.io/velora/)
[![Platform](https://img.shields.io/badge/Apple%20silicon%20%C2%B7%20macOS%2026%2B-000000?logo=apple&logoColor=white)](docs/INSTALL.md)
[![License](https://img.shields.io/badge/app-BSL%201.1-0071e3)](LICENSING.md)

![Velora 0.4: VMs, models and clusters on your Mac](docs/social/velora-hero-dark.jpg)

✨ **[New in 0.4](#new-in-04)** · 🖼️ **[Gallery](#gallery)** · 🎬 **[In motion](#in-motion)** · 🌐 **[Website](https://zyvorai.github.io/velora/)** · 📦 **[Install guide](docs/INSTALL.md)** · 📚 **[Tutorials](docs/tutorials/README.md)** · 🧩 **[How it works](docs/how-it-works.md)**

| ⬇️ Download v0.4.0 (pre-release) | Size | SHA-256 |
| --- | --- | --- |
| [**Velora-0.4.0.pkg**](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.pkg): installer, puts Velora in Applications | 2.9 MB | [`773bb434…51a05d7`](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.pkg.sha256) |
| [**Velora-0.4.0.dmg**](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.dmg): drag to Applications | 3.5 MB | [`7a558bcf…6e4572f`](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.dmg.sha256) |

<sub>Ad-hoc signed: the first time, right-click Velora and choose Open. All releases: <a href="https://github.com/zyvorai/velora/releases">Releases</a>.</sub>

</div>

Velora is a native Mac app for Apple silicon (macOS 26 or newer). It boots Debian, Ubuntu or macOS virtual machines in one click on
Apple's Virtualization framework, and runs a local AI platform on the same Mac: MLX models and OpenAI-compatible endpoints, LoRA
training, k3s clusters, FluxVM and Kairon, and a fleet of Macs.

This repository holds the **website, documentation and downloadable builds** (see Releases). It does not contain the app's source code.

## Get started

1. Download [`Velora-0.4.0.pkg`](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.pkg) and open it, or
   download [`Velora-0.4.0.dmg`](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.dmg) and drag Velora to Applications.
   Each has a `.sha256` next to it.
2. The build is ad-hoc signed, not notarized: right-click Velora, Open, the first time.
3. Press **⌘N**, choose Debian, Ubuntu or macOS, then **Create & Start**.

Read the [install guide](docs/INSTALL.md), then the [tutorials](docs/tutorials/README.md): [your first VM](docs/tutorials/01-first-vm.md),
[a private OpenAI-compatible endpoint](docs/tutorials/02-private-openai-endpoint.md), [fine-tuning with LoRA](docs/tutorials/03-fine-tune-lora.md),
[a k3s cluster](docs/tutorials/04-k3s-cluster.md), [FluxVM and Kairon](docs/tutorials/05-fluxvm-and-kairon-on-a-mac.md) and
[a fleet of Macs](docs/tutorials/06-fleet-of-macs.md). [How it works](docs/how-it-works.md) explains the pieces.

## New in 0.4

![What's new in Velora 0.4: Console & Command, FluxVM clones and snapshots, Kairon, fleet cards, EXO, .pkg installer](docs/ux/readme-whats-new-04.jpg)

- **Console & Command:** a running Linux machine's toolbar opens its live serial console, a command box with exit codes, and file
  upload and download. It goes through a small guest agent on virtio-vsock, so it works with the guest's network down; older guests
  fall back to SSH, and **Install Agent** adds the agent to them.
- **Machines:** snapshots and restore, clones with a fresh identity, suspend to disk and resume, shared folders, Rosetta, and port
  forwards on `127.0.0.1`.
- **FluxVM:** named images (Debian, Ubuntu, Fedora, CentOS Stream, AlmaLinux, Rocky), port forwards, shared folders, console,
  commands, file copy, snapshots and clones from the app.
- **Kairon:** this Mac registers as a Kubernetes Node in a Velora k3s cluster; Machines scheduled to it boot through FluxVM.
- **Fleet:** a card per Mac with memory and memory pressure, heat, disk, Thunderbolt links, RDMA and per-endpoint speed.
- **One model across Macs (experimental):** EXO-backed endpoints behind the same gateway and keys. Not yet run on two Macs.
- **A `.pkg` installer** next to the DMG on every release; signed and notarized once a Developer ID is configured.

What ran is listed in [docs/RELEASE.md](docs/RELEASE.md).

| Console & Command | Fleet: a card per Mac |
| --- | --- |
| ![Console & Command running uname, os-release, uptime and df in a Debian 13 guest over vsock](docs/ux/app-dark-console.png) | ![Fleet with a card for this Mac: memory, heat, disk, Thunderbolt and RDMA](docs/ux/app-dark-fleet.png) |
| **FluxVM** | **Kairon** |
| ![FluxVM: VMs, images, snapshots and clones](docs/ux/app-dark-fluxvm.png) | ![Kairon: this Mac as a Kubernetes Node](docs/ux/app-dark-kairon.png) |

![Run commands in the guest with no network: Velora.app, virtio-vsock port 1024, velora-agent](docs/ux/readme-console-agent.jpg)

<p align="center"><img src="docs/ux/pkg-installer.png" width="560" alt="The Velora 0.4.0 installer package"><br><sub>The new <code>.pkg</code> installer.</sub></p>

## Gallery

Real captures of the app on an Apple M4 running macOS 27. The guests are real Debian and Ubuntu VMs; the models, training job,
k3s cluster and FluxVM VM are real runs. Open a section to see it in dark and light.

<details open>
<summary><b>🖥️ Machines</b>: Debian, Ubuntu, Console &amp; Command, New Machine, library</summary>

| Dark | Light |
| --- | --- |
| ![Debian 13 running, dark](docs/ux/app-dark-debian.png) | ![Debian 13 running, light](docs/ux/app-light-debian.png) |
| ![Ubuntu 26.04 LTS running, dark](docs/ux/app-dark-ubuntu.png) | ![Ubuntu 26.04 LTS running, light](docs/ux/app-light-ubuntu.png) |
| ![Console & Command, dark](docs/ux/app-dark-console.png) | ![Console & Command, light](docs/ux/app-light-console.png) |
| ![New Machine, dark](docs/ux/app-dark-new-machine.png) | ![New Machine, light](docs/ux/app-light-new-machine.png) |
| ![Machine library, dark](docs/ux/app-dark-library.png) | ![Downloading an image, light](docs/ux/app-light-downloading.png) |

</details>

<details>
<summary><b>🧠 AI platform</b>: Home, models, endpoints, usage, training</summary>

| Dark | Light |
| --- | --- |
| ![Home, dark](docs/ux/app-dark-home.png) | ![Home, light](docs/ux/app-light-home.png) |
| ![Models, dark](docs/ux/app-dark-models.png) | ![Models, light](docs/ux/app-light-models.png) |
| ![Endpoints, dark](docs/ux/app-dark-endpoints.png) | ![Endpoints, light](docs/ux/app-light-endpoints.png) |
| ![Usage, dark](docs/ux/app-dark-usage.png) | ![Usage, light](docs/ux/app-light-usage.png) |
| ![Training, dark](docs/ux/app-dark-training.png) | ![Training, light](docs/ux/app-light-training.png) |

</details>

<details>
<summary><b>🏗️ Infrastructure</b>: Fleet, FluxVM, Kairon, Kubernetes, resources, graphics</summary>

| Dark | Light |
| --- | --- |
| ![Fleet, dark](docs/ux/app-dark-fleet.png) | ![Fleet, light](docs/ux/app-light-fleet.png) |
| ![FluxVM, dark](docs/ux/app-dark-fluxvm.png) | ![FluxVM, light](docs/ux/app-light-fluxvm.png) |
| ![Kairon, dark](docs/ux/app-dark-kairon.png) | ![Kairon, light](docs/ux/app-light-kairon.png) |
| ![Kubernetes cluster, dark](docs/ux/app-dark-cluster.png) | ![Kubernetes cluster, light](docs/ux/app-light-cluster.png) |
| ![Resources, dark](docs/ux/app-dark-resources.png) | ![Resources, light](docs/ux/app-light-resources.png) |
| ![Graphics, dark](docs/ux/app-dark-graphics.png) | ![Graphics, light](docs/ux/app-light-graphics.png) |

</details>

## In motion

| New machine to `ssh` | Endpoints |
| --- | --- |
| ![Velora: new machine, boot, then ssh](docs/ux/velora-demo.gif) | ![Serving a model behind an endpoint](docs/ux/velora-endpoints.gif) |
| **Kubernetes cluster** | **Training** |
| ![A k3s cluster of Velora VMs](docs/ux/velora-cluster.gif) | ![A LoRA training job](docs/ux/velora-training.gif) |
| **FluxVM** | **Kairon** |
| ![FluxVM VMs on this Mac](docs/ux/velora-fluxvm.gif) | ![Kairon: this Mac as a Kubernetes Node](docs/ux/velora-kairon.gif) |

## How it fits together

![Virtual machines, models, endpoints, training, Kubernetes, containers, fleet and FluxVM in one app sharing one memory pool](docs/ux/readme-platform.jpg)

More in [How it works](docs/how-it-works.md): the gateway, the memory scheduler, k3s, FluxVM and Kairon, and the fleet.

## Licensing

- **The app** is under the Business Source License 1.1 ([LICENSE-APP.txt](LICENSE-APP.txt)): free for personal and home use, learning,
  research, labs, development and testing (including inside a company); production business use needs a commercial licence. Plain
  words: [LICENSING.md](LICENSING.md).
- **macOS guests** are licensed by Apple, not by Velora: [MACOS-LICENSING.md](MACOS-LICENSING.md). Velora limits you to two active
  macOS guests by default and asks you to confirm Apple's terms the first time.
- **This website and documentation** are Copyright 2026 Zyvor AI Labs, all rights reserved ([LICENSE](LICENSE)).

Builds before 0.4 (0.3.x) were released earlier under Apache-2.0.

## Support and security

[Open an issue](https://github.com/zyvorai/velora/issues/new?template=bug_report.md) with your Mac model, macOS version and Velora
version. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

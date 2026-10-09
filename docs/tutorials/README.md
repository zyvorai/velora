# Mac tutorials

Each tutorial is written to be followed literally on an Apple silicon Mac and ends with a **Verified** line saying what was run, and where.

| # | Tutorial | You end up with | Needs |
| --- | --- | --- | --- |
| 1 | [Your first VM](01-first-vm.md) | A Debian 13 or Ubuntu 26.04 guest you can `ssh` into | The app, network once |
| 2 | [A private OpenAI endpoint](02-private-openai-endpoint.md) | A local, keyed, OpenAI-compatible API served by MLX on your GPU | 8 GB+ Mac, network once |
| 3 | [Fine-tune a model (LoRA)](03-fine-tune-lora.md) | An adapter trained on your data and served as a new endpoint version | Tutorial 2 |
| 4 | [A Kubernetes cluster in one click](04-k3s-cluster.md) | k3s in an Ubuntu VM, `kubectl` working | 16 GB+ Mac, free memory |
| 5 | [FluxVM and Kairon on a Mac](05-fluxvm-and-kairon-on-a-mac.md) | The Mac as a Kubernetes Node that boots `Machine` resources | Tutorial 4, Rust and Go toolchains |
| 6 | [A fleet of Macs](06-fleet-of-macs.md) | Several Macs sharing models and placing jobs by free memory | Two Macs (one is enough to try it on loopback) |

How the pieces fit: [../how-it-works.md](../how-it-works.md). Installing the app: [../INSTALL.md](../INSTALL.md).

# Kubernetes in Velora

![Kubernetes screen](ux/app-dark-cluster.png)

Velora builds **k3s clusters out of its own Linux VMs**. You get a working `kubectl` without installing Docker, minikube or a cloud account.

## What it does
**Infrastructure → Kubernetes → New Cluster…** creates an Ubuntu 26.04 server VM (and optional workers), installs k3s with cloud-init, learns each guest's address from its serial console, fetches the kubeconfig, and waits until the nodes are Ready. The screen lists nodes and pods, shows pod logs, and prints the exact `kubectl --kubeconfig … get nodes` line to copy.

## Use it
1. Install `kubectl` (`brew install kubectl`).
2. Create the cluster as above (about a minute on an M4, 2 GiB for the server).
3. Point your own tools at it: `export KUBECONFIG="$HOME/Library/Application Support/Velora/Platform/Clusters/<name>/kubeconfig"`.
4. **Destroy** stops and deletes the cluster's VMs.

## How it fits with the rest
- The cluster is the **Kubernetes API that [Kairon](kairon.md) talks to**: Kairon keeps all its state there and registers this Mac as a Node.
- Its VMs are Velora machines, so they count in the [memory ledger](how-it-works.md#one-memory-ledger).
- Clusters use **Ubuntu**: Debian 13's 6.12.111 guest kernel oopses in `autofs4` under k3s.

## Verified and not
**Verified** on an Apple M4, macOS 27.2: single-node cluster, node Ready in 39 s, nginx pods serving HTTP (`--selftest k3s`). **Not verified:** multi-node join (a server guest hung once under host memory pressure), other CNIs, anything beyond one Mac. Keep memory free: under heavy swap the guest can hang.

Tutorial: [4. A Kubernetes cluster in one click](tutorials/04-k3s-cluster.md).

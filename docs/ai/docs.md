# AI docs (velora-site)

_Generated 2026-10-20 by claude-opus-5-5 from a snapshot of tracked sources; verify before acting._

# Part 1: README.md

```markdown
<div align="center">

<img src="docs/social/velora-icon-1024.png" width="128" alt="Velora icon">

# Velora

**A native Mac app that runs Linux and macOS VMs, local MLX model endpoints and k3s clusters on Apple silicon, with one shared memory ledger.**

![Velora: your personal VM studio](docs/social/velora-hero-dark.jpg)

[**Download**](https://github.com/zyvorai/velora/releases/latest) · [Website](https://zyvorai.github.io/velora/) · [Install guide](docs/INSTALL.md) · [Tutorials](docs/tutorials/README.md) · [What is verified](docs/RELEASE.md)

</div>

> **This repository holds the Velora website, the documentation and the downloadable builds (see Releases).
> It does not contain the app's source code.**

## What Velora does

Velora is a SwiftUI app for Apple silicon Macs running macOS 26 or newer. It uses Apple's Virtualization framework, runs as your user, and needs no root access or kernel extension.

| Area | What it does | Docs |
| --- | --- | --- |
| Virtual machines | Debian 13 and Ubuntu 26.04 LTS ARM64 cloud images with a cloud-init login. It also has macOS guests (implemented, **not boot-tested**). | [Tutorial 1](docs/tutorials/01-first-vm.md) |
| Models and endpoints | An isolated MLX runtime and Hugging Face model downloads. A local OpenAI-compatible gateway serves them with hashed API keys, versions and rollback. | [Tutorial 2](docs/tutorials/02-private-openai-endpoint.md) |
| LoRA training | `mlx_lm.lora` jobs with checkpoints, pause and resume. A finished adapter can be served as a new endpoint version. | [Tutorial 3](docs/tutorials/03-fine-tune-lora.md) |
| Kubernetes | k3s clusters built from Ubuntu 26.04 Velora VMs. Velora writes a kubeconfig you can use with your own `kubectl`. | [Tutorial 4](docs/tutorials/04-k3s-cluster.md), [Kubernetes](docs/kubernetes.md) |
| FluxVM and Kairon | Velora supervises a local [FluxVM](https://github.com/zyvorai/zyvor-fluxvm) daemon (`vz` backend). It can register the Mac as a [Kairon](https://github.com/zyvorai/zyvor-kairon) Kubernetes Node. | [Tutorial 5](docs/tutorials/05-fluxvm-and-kairon-on-a-mac.md), [FluxVM](docs/fluxvm.md), [Kairon](docs/kairon.md) |
| Fleet | A node agent over pinned TLS and a bearer token. It places jobs on the node with the most free memory and copies models between Macs. | [Tutorial 6](docs/tutorials/06-fleet-of-macs.md) |

Every VM, model worker, training job and FluxVM VM reserves memory in one ledger before it starts. [How it works](docs/how-it-works.md) explains the pieces.

**Verification status:** everything was run on one Apple M4 with macOS 27.2. The following have **not** been verified:

- macOS guests
- multi-node k3s
- a second physical Mac
- Thunderbolt clusters

The full list is in [docs/RELEASE.md](docs/RELEASE.md).

## Requirements

- An Apple silicon Mac (M1 or newer). Intel Macs are not supported.
- macOS 26 or newer.
- About 10 GB of free disk for a Linux guest, and about 17 GB more for a macOS guest.
- A network connection the first time you download a guest image, model or runtime.
- Per-feature requirements:
  - 8 GB+ of memory for model endpoints.
  - 16 GB+ for k3s.
  - `kubectl` for clusters.
  - Rust and Go toolchains for FluxVM and Kairon.

## Install

1. Download `Velora-<version>.dmg` from [Releases](https://github.com/zyvorai/velora/releases/latest).
2. Optional: verify the download against its `.sha256` file:
   ```bash
   cd ~/Downloads && shasum -a 256 -c Velora-<version>.dmg.sha256
   ```
3. Open the DMG and drag **Velora** to **Applications**.
4. Open it the first time. The build is ad-hoc signed and **not notarized**, so Gatekeeper blocks the first launch. Use one of these:
   - right-click Velora → **Open** → **Open**, or
   - System Settings → Privacy & Security → **Open Anyway**, or
   - run this command:
     ```bash
     xattr -dr com.apple.quarantine /Applications/Velora.app
     ```

See [docs/INSTALL.md](docs/INSTALL.md) for the full guide.

## Quick start

1. Press **⌘N**, choose **Debian 13** (or **Ubuntu 26.04 LTS**), then **Create & Start**.
   Velora downloads the image once, then caches it and verifies its checksum. It prepares the disk and boots the guest.
2. When the guest reports its address, Velora shows a ready-made line under the display:
   ```bash
   ssh velora@192.168.64.x
   ```
   - The password is `velora`, and the account has passwordless `sudo`.
   - Your `~/.ssh/*.pub` keys are installed too.

> **Change the password, or rely on your SSH key, before you expose a guest to anything beyond your own Mac.**

## Usage

### Call a local OpenAI-compatible endpoint

1. Deploy a model under **AI → Endpoints**.
2. Create a key with **New Key…**. The secret is shown once.
3. Call the endpoint:

```bash
curl http://127.0.0.1:8780/v1/chat/completions \
  -H "Authorization: Bearer <your key>" -H "Content-Type: application/json" \
  -d '{"model":"assistant","messages":[{"role":"user","content":"Hello from my Mac"}]}'
```

The endpoint name is the `model`. The app's **Gateway** section shows the base URL.

### Use a Velora k3s cluster with your own tools

```bash
export KUBECONFIG="$HOME/Library/Application Support/Velora/Platform/Clusters/<name>/kubeconfig"
kubectl get nodes
```

### Self-tests from Terminal

```bash
/Applications/Velora.app/Contents/MacOS/Velora --selftest scheduler
/Applications/Velora.app/Contents/MacOS/Velora --selftest debian13   # boots a throwaway VM; passes when SSH answers
```

- [INSTALL.md](docs/INSTALL.md) lists these other suites: `runtime`, `gateway`, `train`, `fleet`, `k3s`, `containers`, `fluxvm`.
- The docs also mention `ubuntu` and `kairon`.
- The suites use throwaway data and clean up after themselves.
- Keep memory free when you run `k3s`. Under heavy swap the guest can hang.

## Configuration

### Environment variables

These variables are read by the app's FluxVM and Kairon integration.

| Variable | Purpose |
| --- | --- |
| `FLUXVM_FLUXCTL` | Path to `fluxctl`. If it is not set, Velora looks in `~/.cargo/bin`, then in a sibling `fluxvm` checkout. |
| `KAIRON_DIR` | Path to a `zyvor-kairon` checkout, used by the **Build** button. Velora also looks next to Velora or at `~/tt/tt/kairon`. |
| `KAIRON_CONTROLLER`, `KAIRON_NODE` | Paths to prebuilt `kairon-controller` and `kairon-node` binaries. Use them instead of building. |

### Data locations

All paths are under `~/Library/Application Support/Velora/`.

| Path | Contents |
| --- | --- |
| `Images/` | Cached guest images |
| `Machines/<id>/` | One machine, including its `console.log` |
| `Platform/` | The isolated MLX runtime (`Platform/Runtimes`) and clusters (`Platform/Clusters/<name>/kubeconfig`) |

Remove this folder to start over.

### Network listeners

Velora only opens these when you turn them on:

| Listener | Default address | Notes |
| --- | --- | --- |
| OpenAI-compatible gateway | `127.0.0.1:8780` | Bound to loopback unless you allow the LAN |
| FluxVM daemon | `127.0.0.1:7788` | Supervised by the app |
| Fleet node agent | Loopback only, until you allow the network | Uses TLS with a self-signed certificate and a join token. The app shows the port. |

### macOS guest limit

By default, Velora allows at most two concurrently active macOS guests. This is a technical guard, not a grant of rights. Apple's licence still applies; see [MACOS-LICENSING.md](MACOS-LICENSING.md).

## Uninstall

1. Quit Velora.
2. Delete `/Applications/Velora.app`.
3. Optionally, delete `~/Library/Application Support/Velora`.

## Contributing

### Report problems

- **Bugs:** [open an issue](https://github.com/zyvorai/velora/issues/new?template=bug_report.md). Include:
  - your Velora version
  - your Mac model and chip
  - your macOS version
  - the guest type
  - for guest problems, that machine's `console.log`, with anything private removed
- **Security issues:** report privately as described in [SECURITY.md](SECURITY.md).

### Work on the website

The site is static HTML, CSS and JavaScript with no runtime dependencies. It lives in `site/` and uses images from `docs/social/` and `docs/ux/`.

```bash
./scripts/build-site.sh            # assembles _site/ (or pass another output directory)
node scripts/site-check.mjs        # checks the built site
```

CI (`.github/workflows/ci.yml`) runs on every push and pull request. It uses Node 22 and runs:

```bash
npm ci
npx playwright install --with-deps chromium
npm run check:site
```

Pushes to `main` that touch any of these paths deploy the site to GitHub Pages (`.github/workflows/pages.yml`):

- `site/`
- `docs/ux/`
- `docs/social/`
- `scripts/build-site.sh`
- the Pages workflow itself

The site is served under `/velora/`, and `site/404.html` sets `<base href="/velora/">`.

### Documentation conventions

Each tutorial is written to be followed literally on an Apple silicon Mac. It ends with a **Verified** line that says what was run and where. Keep that line accurate when you edit.

## License

| Component | Licence |
| --- | --- |
| The app | Business Source License 1.1 ([LICENSE-APP.txt](LICENSE-APP.txt)) |
| macOS guests | Apple's licence, not Velora's ([MACOS-LICENSING.md](MACOS-LICENSING.md)) |
| This website and documentation | Copyright 2026 Zyvor AI Labs, all rights reserved ([LICENSE](LICENSE)) |

**The app's licence in brief:**

- It is free for:
  - personal and home use
  - learning, teaching and research
  - development and testing, including inside a company
  - labs and evaluation
- Production business use needs a commercial licence from Zyvor AI Labs.
- Each version becomes available under Apache-2.0 four years after its first publication.
- [LICENSING.md](LICENSING.md) explains this in plain words.

Builds before 0.4 (0.3.x) were released under Apache-2.0.

Apple, Mac, macOS and Apple silicon are trademarks of Apple Inc. Velora and Zyvor AI Labs are not affiliated with Apple.
```

# Part 2: Docs gaps I could not fill

**Build and contributing**
- `package.json` is not shown. I can't say what `npm run check:site` does, or whether there are other npm scripts such as a dev server or preview command.
- `scripts/site-check.mjs` is not shown. I don't know what it checks (links, accessibility, Playwright screenshots?) or what flags it accepts.
- There is no documented way to preview the site locally. Because `404.html` hard-codes `<base href="/velora/">`, a plain static server at `/` would break the 404 page.
- There is no CONTRIBUTING.md or code of conduct. It is unclear whether docs or site pull requests are accepted, and under what terms. The docs are "all rights reserved", so the licence for contributions is undefined.
- `docs/design/UX-CONTRACT.md` is referenced in `site.css` but not provided.

**Versions and licensing**
- **Version mismatch:**
  - The website's Download section says "Velora 0.3.0".
  - README.md says the app is BSL and that pre-0.4 (0.3.x) builds were Apache-2.0.
  - The current release version and its licence are unclear.
- **No commercial-licence contact:** LICENSING.md says "contact details to be added before release".
- **macOS guest limit:** it is described as a "default". There are no docs on whether or how it can be changed.
- **The "Python service":** MACOS-LICENSING.md and RELEASE.md mention a Python service that enforces the macOS limit. No other document explains what it is, or whether it ships in the DMG.

**Configuration and settings**
- How to "allow the LAN" for the gateway and the fleet agent. The setting's location and name are not documented.
- The fleet agent's default port is not documented.
- Gateway rate limits, key scopes and other gateway settings: the docs say they exist but not how to configure them.
- The Settings screen is not documented at all.
- `~/tt/tt/kairon` as a default Kairon search path looks like a developer-machine path. Confirm whether it is intended for users.
- FluxVM guests receive "Velora's key". The docs don't say what this key is or where it lives.

**Feature documentation**
- Several features are mentioned in RELEASE.md or on the site but have no user docs:
  - files search / "Use my files"
  - containers (and the `containers` self-test)
  - Shortcuts and Siri actions
  - the Services menu entry
  - the QR code
  - offline bundles
  - Open at login
  - Benchmark, Test Tools, and the Export/Import panels
- The self-test suite list is inconsistent:
  - INSTALL.md lists `scheduler`, `debian13`, `runtime`, `gateway`, `train`, `fleet`, `k3s`, `containers`, `fluxvm`.
  - Other pages also use `ubuntu` and `kairon`.
  - There is no single authoritative list.
- Tutorial 5 needs "Velora's cached Debian image … once extracted" and `brew install hivex`, but it doesn't give extraction steps or explain why hivex is needed.

**Inconsistencies between pages**
- **Drag-and-drop:**
  - INSTALL.md and Tutorial 1 accept `.iso`, `.img` and `.ipsw`.
  - The website lists only `.ipsw` and `.iso`.
  - RELEASE.md says drag-and-drop is not verified, yet it is presented as working.
- **Menu names:** the tutorials say "AI → Models" and "Infrastructure → Kubernetes". INSTALL.md says "Models" and "Clusters".
- **"In-process" claims:**
  - how-it-works.md says everything runs "in-process", and the site says "no helper service".
  - The same docs describe separate `InferenceWorker` processes and per-VM FluxVM runner processes.
- **Unverified claims on the website:**
  - The "Runs on every Mac … Mac Studio cluster" section and the "Thunderbolt 5 mesh" scenario describe untested configurations.
  - The caveat that they are on the roadmap appears only at the end of that section.
- **Minimum macOS:** macOS 26 is the stated minimum, but only macOS 27.2 is verified.

**Smaller issues**
- SECURITY.md has a typo: "kernel extension or kernel extension". It also doesn't state a disclosure timeline or a supported-versions policy.
- `docs/INSTALL.md` describes the build as an "ad-hoc signed developer build". There is no information on notarization plans or an update mechanism, and it is unclear whether the app updates itself.

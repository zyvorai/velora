# Install and test Velora

## Requirements

- An Apple silicon Mac (M1 or newer). Intel Macs are not supported.
- macOS 26 or newer. Verified on macOS 27.2 on an Apple M4.
- About 10 GB free disk for a Linux guest (images are cached), 17 GB more for a macOS guest.
- Internet for the first run of a guest image (Debian and Ubuntu are downloaded and checksum-verified).

## Install

Velora 0.4.0 is a pre-release, so GitHub's "latest release" page does not point at it yet. Use these direct links:

| File | What it does |
| --- | --- |
| [Velora-0.4.0.pkg](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.pkg) ([.sha256](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.pkg.sha256)) | A standard macOS installer: puts Velora.app in Applications |
| [Velora-0.4.0.dmg](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.dmg) ([.sha256](https://github.com/zyvorai/velora/releases/download/v0.4.0/Velora-0.4.0.dmg.sha256)) | A disk image: drag Velora to Applications |

Every version is on the [Releases](https://github.com/zyvorai/velora/releases) page.

1. Download the `.pkg` or the `.dmg`, and its `.sha256`.
2. Optional: verify it.
   ```bash
   cd ~/Downloads && shasum -a 256 -c Velora-0.4.0.pkg.sha256    # or Velora-0.4.0.dmg.sha256
   ```
3. Install it, one of two ways:
   - **.pkg:** open it and follow the installer (Introduction, Licence, Destination, Install). If macOS refuses to open the
     package because it is not notarized, right-click it and choose **Open**. Or from Terminal:
     `sudo installer -pkg ~/Downloads/Velora-0.4.0.pkg -target /`
   - **.dmg:** open it and drag **Velora** to **Applications**.
4. **First launch.** Velora is ad-hoc signed, not notarized, so Gatekeeper blocks it once. Either
   right-click Velora → **Open** → **Open**, or run:
   ```bash
   xattr -dr com.apple.quarantine /Applications/Velora.app
   ```
   On recent macOS you can also use System Settings → Privacy & Security → **Open Anyway**.

## Try it (5 minutes)

1. Press **⌘N**, choose **Debian 13**, press **Create & Start**. The image downloads once, the disk is prepared and the guest boots.
2. The guest address and an `ssh velora@…` line appear under the display. Password is `velora`; your `~/.ssh/*.pub` keys are installed too.
3. Try **Host → Graphics** (Metal GPU inventory), pause and shut down from the toolbar, then create **Ubuntu 26.04 LTS**.
4. Drag an `.iso`, `.img` or `.ipsw` onto the window to create a machine from your own file.
5. Optional platform features: **Models** (installs an isolated MLX runtime on first use, needs network), **Clusters** (k3s in Ubuntu VMs), **Fleet**.

Change the default password before exposing a guest beyond your own Mac.

## Self-test from Terminal

```bash
/Applications/Velora.app/Contents/MacOS/Velora --selftest scheduler
/Applications/Velora.app/Contents/MacOS/Velora --selftest debian13     # boots a throwaway VM, passes when SSH answers
```

Other suites: `runtime`, `gateway`, `train`, `fleet`, `k3s`, `containers`, `fluxvm`. They use throwaway data and clean up after themselves.
Keep memory free when running `k3s`: under heavy swap the guest can hang.

## What to know

- **Not verified:** macOS guest install and boot, multi-node k3s, a second physical Mac. See [RELEASE.md](RELEASE.md).
- Data: `~/Library/Application Support/Velora` (`Images`, `Machines`). Delete a machine in the app, or remove that folder to start over.
- The app needs the `com.apple.security.virtualization` entitlement, which the build includes.

## Report a problem

[Open an issue](https://github.com/zyvorai/velora/issues/new?template=bug_report.md) with your Mac model, macOS version, Velora version and, for a guest problem, that machine's `console.log`.

## Uninstall

Quit Velora, delete `/Applications/Velora.app` and, if you want, `~/Library/Application Support/Velora`.

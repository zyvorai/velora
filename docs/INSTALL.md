# Install and test Velora

## Requirements

- An Apple silicon Mac (M1 or newer). Intel Macs are not supported.
- macOS 26 or newer. Verified on macOS 27.2 on an Apple M4.
- About 10 GB free disk for a Linux guest (images are cached), 17 GB more for a macOS guest.
- Internet for the first run of a guest image (Debian and Ubuntu are downloaded and checksum-verified).

## Install

### Homebrew (recommended)

```bash
brew install --cask zyvorai/tap/velora
```

Production business use needs **Velora Pro** (INR 7,299 incl. GST in India, about US$74 excl. tax elsewhere, per Mac per year): [Buy](https://zyvor.dev/buy#velora). Start with the free 30-day trial. Prices: INR incl. 18% GST in India; US dollars excl. tax elsewhere (VAT, GST or sales tax added where applicable). Pay online by UPI, card or netbanking; international cards work (charged in rupees); or request a US-dollar invoice by bank transfer. Custom pricing: contact sales@zyvor.dev.

### Direct download

| File | What it does |
| --- | --- |
| [Velora-0.5.1.dmg](https://github.com/zyvorai/velora/releases/download/v0.5.1/Velora-0.5.1.dmg) ([.sha256](https://github.com/zyvorai/velora/releases/download/v0.5.1/Velora-0.5.1.dmg.sha256)) | Disk image: drag Velora to Applications |

Every version is on the [Releases](https://github.com/zyvorai/velora/releases) page. Release 0.5.1 ships the DMG only (a signed installer package is not offered yet).

1. Download the `.dmg` and its `.sha256`.
2. Optional: verify it.
   ```bash
   cd ~/Downloads && shasum -a 256 -c Velora-0.5.1.dmg.sha256
   ```
3. Open the DMG and drag **Velora** to **Applications**.
4. **First launch.** Velora 0.5.1 is Developer ID signed and notarized by Apple. macOS shows its standard first-open confirmation for apps downloaded from the internet; choose **Open**. Earlier builds (before 0.5.1) were ad-hoc signed and not notarized and needed a Gatekeeper override.

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

Other suites: `ubuntu`, `runtime`, `gateway`, `train`, `fleet`, `k3s`, `containers`, `fluxvm`, `kairon`, `macos` (macOS guest install is unverified; see [RELEASE.md](RELEASE.md)). They use throwaway data and clean up after themselves.
Keep memory free when running `k3s`: under heavy swap the guest can hang.

## What to know

- **Not verified:** macOS guest install and boot, multi-node k3s, a second physical Mac. See [RELEASE.md](RELEASE.md).
- Data: `~/Library/Application Support/Velora` (`Images`, `Machines`). Delete a machine in the app, or remove that folder to start over.
- The app needs the `com.apple.security.virtualization` entitlement, which the build includes.

## Report a problem

[Open an issue](https://github.com/zyvorai/velora/issues/new?template=bug_report.md) with your Mac model, macOS version, Velora version and, for a guest problem, that machine's `console.log`.

## Uninstall

Quit Velora, delete `/Applications/Velora.app` and, if you want, `~/Library/Application Support/Velora`.

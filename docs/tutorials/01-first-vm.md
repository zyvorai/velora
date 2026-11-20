# 1. Your first VM

![Debian 13 running in Velora](../ux/app-dark-debian.png)

## Before you start
Apple silicon Mac, macOS 26+, Velora installed ([INSTALL.md](../INSTALL.md)), about 10 GB free disk, network for the first image.

## Steps
1. Open Velora and press **⌘N**.
2. Choose **Debian 13** (or **Ubuntu 26.04 LTS**) and press **Create & Start**.
3. Watch it work: the image downloads (resumable, checksum-verified, cached in `~/Library/Application Support/Velora/Images`), the disk is prepared, the guest boots.
4. When the guest reports its address, Velora shows it under the display together with a ready-made line:
   ```bash
   ssh velora@192.168.64.x
   ```
   The password is `velora`; your `~/.ssh/*.pub` keys are installed as well. Change the password before exposing the guest beyond your Mac.
5. Use the toolbar to pause, resume, shut down or force stop. **Host → Graphics** shows your Metal devices and what each kind of guest gets.
6. Try the shortcut: drag an `.iso`, `.img` or `.ipsw` onto the window to create a machine from your own file.

## What you should see
A running machine with a green dot in the sidebar and an `ssh` line that works.

## Troubleshooting
- *Stuck downloading:* the download resumes; check free disk space and network.
- *No address after a few minutes:* the Mac may be under memory pressure; close other VMs/apps. Velora reads the address from the guest's serial console, not from DHCP leases (macOS 27 hides those).
- *Debian shows a black screen:* use the default `generic` image Velora picks; the `genericcloud` kernel has no display driver.

**Verified:** Debian 13 and Ubuntu 26.04 LTS boot to SSH on an Apple M4, macOS 27.2 (`--selftest debian13`, `--selftest ubuntu`). macOS guests are implemented but **not** boot-tested.

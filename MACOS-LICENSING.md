# macOS virtualization licensing

*This page explains how Velora relates to Apple's licence. It is not legal advice. If you rely on it for a commercial or hosted
use, have a lawyer read Apple's licence for the macOS release you run.*

## Two licences, two layers

- **Velora** (the app released here) is licensed under the [Business Source License 1.1](LICENSE-APP.txt) (see [LICENSING.md](LICENSING.md)). That licence covers Velora only.
  It grants no rights to macOS, macOS restore images (`.ipsw` files), Apple frameworks, Apple services or any other Apple software.
- **macOS**, including every macOS guest you run in Velora, is licensed to you by Apple Inc. under the Apple Software License
  Agreement that comes with the release you install. Velora does not distribute, sell, sublicense or otherwise license macOS.
  When you create a macOS machine, Velora asks Apple for a restore image and downloads it on your behalf.

Velora's macOS support uses Apple's Virtualization framework and runs only on Apple-branded Macs with Apple silicon.

## What Apple's licence says about virtual machines

For macOS Tahoe, Section 2B(iii) of the [software licence agreement](https://www.apple.com/legal/sla/docs/macOSTahoe.pdf)
permits you to install, use and run **up to two (2) additional copies or instances** of macOS in virtual operating system
environments **on each Apple-branded computer you own or control that is already running macOS**, for these purposes:

1. software development;
2. testing during software development;
3. using macOS Server; or
4. personal, non-commercial use.

The agreement also says that these virtualized copies may not be used for **service bureau, time-sharing, terminal sharing, relay
service or similar services** (except as Section 3 of the agreement expressly permits), and that you may not use macOS to run
other Apple operating systems such as iOS, iPadOS, watchOS or tvOS in virtual environments on a Mac. Other macOS releases can have
different wording; read the agreement for the release you use. Apple's list is at <https://www.apple.com/legal/sla/>.

What this means for Velora:

- Velora is not a way to run an unlimited number of macOS machines, and it does not advertise one.
- Running macOS guests for other people (hosting, sharing, renting or a managed service) is outside what Section 2B(iii) permits as
  written. Get Apple's agreement or legal advice before building that on Velora.
- Linux guests are not macOS and are not covered by Apple's licence; each Linux distribution's own licences apply.

## What Velora does

- Velora applies a conservative default limit of **two concurrently active macOS guests**: the native app and the Python service
  both refuse to start a third and say why. The limit is a technical guard, **not** a grant of permission: where Apple's licence
  limits the number, purpose, location or manner of macOS virtual instances, those limits apply whatever Velora allows.
- The first time you start a macOS guest, the app shows a short summary of the points above and asks you to continue or cancel.
- Velora does not check whether your intended use is one of the purposes Apple permits. That is your responsibility.

## Trademarks

Apple, Mac, macOS, Apple silicon and related marks are trademarks of Apple Inc. Velora and Zyvor AI Labs are not affiliated with,
sponsored by or endorsed by Apple Inc.

# AI review (velora-site)

_Generated 2026-10-20 by claude-opus-5-5 from a snapshot of tracked sources; verify before acting._

# Code review: velora-site

## Summary

This repository holds the marketing website (`site/`), the user documentation and tutorials (`docs/`), and the licensing pages for Velora. Velora is a closed-source macOS app for Apple silicon that runs Linux and macOS VMs, MLX model endpoints, LoRA training, k3s clusters, FluxVM/Kairon integration and a multi-Mac fleet. The app source is not here, so this review covers only the site, the build/deploy scripts and the accuracy of the docs.

## Bugs and correctness risks

**Version and licence mismatch on the site.**
- `site/index.html` (Download section) says "Velora 0.3.0".
- The footer says "App: Business Source License 1.1".
- `README.md` says 0.3.x builds were Apache-2.0 and BSL applies from 0.4.
- Either the version string is stale or the licence statement is wrong for the advertised build.

**Fragile asset build.**
- `scripts/build-site.sh` runs `cp "$ROOT"/docs/ux/*.png "$ROOT"/docs/ux/*.jpg "$ROOT"/docs/ux/*.gif` under `set -euo pipefail`.
- If any glob matches nothing (for example, no GIFs), bash passes the literal pattern and `cp` fails, so the build aborts.
- The same applies to `docs/social/*.jpg`.

**Gallery image paths are unchecked.**
- `site/site.js` builds `ux/app-{light|dark}-{view}.png` for 15 views × 2 modes, which is 30 files.
- I cannot see whether all of them exist in `docs/ux/`. A missing file triggers `pre.onerror`, which still swaps in the broken `src`.
- Unclear whether `check:site` catches this; its script is not shown.

**Other site assets I cannot confirm.**
- `site/index.html` references `favicon.svg` and `apple-touch-icon.png`, which are not among the shown files.

**Hard-coded base path in the 404 page.**
- `site/404.html` uses `<base href="/velora/">`.
- This breaks if the repo is renamed or the site moves to a custom domain.

**Pages deploys without running checks.**
- `.github/workflows/pages.yml` builds and deploys without running `check:site`.
- It does not depend on `ci.yml`, so a broken site can ship from `main`.

**Docs that contradict each other or the site.**

*Architecture claims vs. what the docs describe:*
- `docs/how-it-works.md` says the app runs "everything in-process".
- `site/index.html` says "in-process, with no helper service".
- But the same docs describe `InferenceWorker` processes, supervised `mlx_lm.lora` jobs, and a "signed helper process per VM" for FluxVM.
- `MACOS-LICENSING.md` and `docs/RELEASE.md` mention a "Python service" that the architecture page never describes.

*Self-test suites:*
- `docs/INSTALL.md` lists the suites `scheduler`, `debian13`, `runtime`, `gateway`, `train`, `fleet`, `k3s`, `containers` and `fluxvm`.
- Tutorials and pages use `--selftest ubuntu` and `--selftest kairon`, which are missing from that list.

*Features presented as working that `docs/RELEASE.md` says are unverified:*
- The site's macOS card says "installs and boots it", but `RELEASE.md` says the macOS install path is "implemented but unrun".
- Drag-and-drop is shown as a feature on the site and in `INSTALL.md` step 4; `RELEASE.md` says it is not verified.
- The "Regulated, on-premise… Thunderbolt 5 mesh" positioning describes an untested setup.

*Smaller inconsistencies:*
- The site's drag-and-drop card lists `.ipsw`/`.iso` only, while the docs also list `.img`.

**Leaked developer path.**
- `docs/kairon.md` and tutorial 5 name `~/tt/tt/kairon` as a default lookup location for the Kairon checkout.
- This looks like a personal path that has leaked into the docs (and possibly the app).

**Paths to a closed source tree.**
- `docs/how-it-works.md` cites `native/App/Platform/Scheduler.swift`.
- That file is not in this repo and readers cannot follow it.

## Security concerns

**Default guest credentials.**
- Guests ship with `velora`/`velora` and passwordless sudo, as documented in `SECURITY.md` and tutorial 1.
- This is documented, but a forced password change or key-only SSH would be safer than advice alone.

**Install integrity.**
- The `.sha256` file is hosted next to the DMG, so it detects corruption but not tampering.
- Combined with ad-hoc signing and the advice to run `xattr -dr com.apple.quarantine` (in `site/index.html` and `INSTALL.md`), users have no authenticity check.
- Recommend notarization, or at least signed checksums (minisign or GPG).

**Gateway on the LAN.**
- Tutorial 2 shows the gateway over plain `http://127.0.0.1:8780`.
- When "allow the LAN" is enabled, bearer keys would cross the network in cleartext unless the gateway switches to TLS. The docs don't say whether it does.

**Fleet discovery may weaken pinning.**
- Tutorial 6 says Bonjour discovery "fill[s] them in" (host, port, token, fingerprint).
- If the fingerprint is taken from the network, the pin becomes trust-on-first-use and can be spoofed on the LAN. The docs should state what discovery fills and what must be copied out-of-band.

**Credentials on disk.**
- The kubeconfig and the Kairon 12-hour ServiceAccount tokens are written under `~/Library/Application Support/Velora`.
- File permissions are not documented, and I cannot verify them from this repo.

**`SECURITY.md` gaps.**
- No supported-versions policy, no response timeline and no encryption key; reports go to a personal address.
- It has a typo: "kernel extension or kernel extension".

**Site hardening.** No CSP, not even via `<meta>`. Risk is low because the site has no third-party scripts.

**Workflow actions are not pinned.**
- Actions are referenced by tag (`@v4`, `@v5`, `@v3`), not by commit SHA.
- `pages.yml` holds `pages: write` and `id-token: write`.

## Test and CI gaps

- `ci.yml` depends on `npm ci`, `package-lock.json`, `npm run check:site` and `scripts/site-check.mjs`. None of these are shown, so I can't assess what the check covers: links, gallery images, accessibility and so on.
- The site is not checked before Pages deploys (see Bugs).
- `ci.yml` triggers on both `push` and `pull_request` with no branch filter, so PR branches run twice.
- No automated check that Markdown links in `docs/` resolve (relative image paths such as `../ux/*.png`, cross-doc anchors).
- No check that the version on the site matches the latest release.

## Documentation gaps

- `LICENSING.md` says "contact details to be added before release", yet releases are already published.
- Tutorial 5 says "Velora's cached Debian image works once extracted" but gives no command for extracting it.
- The pages give no supported or tested version matrix for FluxVM and Kairon. "Verified on macOS 27.2" sits next to a requirement of "macOS 26 or newer", with no statement on whether macOS 26 itself was tested.
- No changelog. `docs/RELEASE.md` is not tied to a specific version number.
- The GPU table's "future work on Linux" for passthrough is ambiguous.
- The section titled "Runs on every Mac" contradicts the Apple-silicon-only requirement.

## Top 5 recommended actions (ordered)

1. **Fix the version and licence inconsistency** on the site's Download section and footer, and the false "in-process / no helper" claims. Remove or label claims about unverified features (macOS guests, drag-and-drop, Thunderbolt clusters).
2. **Gate Pages on checks.** Run `npm run check:site` in `pages.yml` before upload, or deploy only after CI succeeds. Make `build-site.sh` tolerate empty globs with `shopt -s nullglob` or explicit existence checks.
3. **Strengthen install integrity.** Notarize, or publish signed checksums, and stop recommending a blanket quarantine strip as the first option.
4. **Clarify network security in the docs.**
   - Gateway: does it use TLS when bound to the LAN?
   - Fleet: what does Bonjour fill in, and must the fingerprint be verified out-of-band?
   - Credentials: what are the file permissions for the kubeconfig and tokens?
   - Also expand `SECURITY.md` with supported versions and a response policy.
5. **Clean up the docs.**
   - Remove `~/tt/tt/kairon`.
   - Complete the self-test suite list in `INSTALL.md`.
   - Add the commercial licence contact.
   - Fix the `SECURITY.md` typo.
   - Add a Markdown link and image checker to CI.

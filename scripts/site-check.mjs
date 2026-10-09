// Browser check of the built Pages site, served under the real /velora/ sub-path (as GitHub Pages does).
//   ./scripts/build-site.sh && node scripts/site-check.mjs [--shots dir]
// Needs `npm ci` (Playwright) and either its Chromium or a system Google Chrome.
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../", import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const shotsDir = arg("--shots", "");
const siteDir = path.resolve(arg("--dir", path.join(root, "_site")));
const PREFIX = "/velora/";
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".gif": "image/gif", ".txt": "text/plain", ".xml": "application/xml" };
const failures = [];
const check = (ok, msg) => { console.log(`${ok ? "ok  " : "FAIL"} ${msg}`); if (!ok) failures.push(msg); };

const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (!p.startsWith(PREFIX)) { res.writeHead(404); return res.end("outside the project path"); }
  p = p.slice(PREFIX.length) || "index.html";
  let file = path.join(siteDir, p);
  if (!file.startsWith(siteDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { file = path.join(siteDir, "404.html"); res.statusCode = 404; }
  res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
  res.end(fs.readFileSync(file));
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${srv.address().port}${PREFIX}`;
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const shot = async (page, name) => { if (shotsDir) { fs.mkdirSync(shotsDir, { recursive: true }); await page.screenshot({ path: path.join(shotsDir, name + ".png") }); } };

async function open(scheme, viewport, tag) {
  const ctx = await browser.newContext({ colorScheme: scheme, viewport, permissions: ["clipboard-read", "clipboard-write"], reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const bad = [];
  page.on("pageerror", (e) => bad.push(`${tag} pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) bad.push(`${tag} console: ${m.text()}`); });
  page.on("response", (r) => { if (r.status() >= 400 && !/\/404\.html$/.test(r.url()) && !r.url().includes("no-such-page")) bad.push(`${tag} ${r.status()} ${r.url()}`); });
  return { ctx, page, bad };
}
const scrollAll = (page) => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
const noSideScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

// ---------- desktop, light
let { ctx, page, bad } = await open("light", { width: 1440, height: 900 }, "landing");
await page.goto(base);
check((await page.title()).includes("Velora"), "landing: title");
check((await page.locator("h1").innerText()).includes("clusters"), "landing: h1");
check(await page.getAttribute("html", "data-theme") === "light", "landing: follows OS light");
check((await page.locator("#shot").getAttribute("src")).includes("app-light-debian"), "gallery: starts on Debian matching the page theme");
await shot(page, "site-landing-light");
await page.click('[aria-label="Scene"] [data-value="ubuntu"]');
await page.waitForFunction(() => document.getElementById("shot").src.includes("app-light-ubuntu"));
check((await page.locator("#shot-cap").innerText()) === "Ubuntu 26.04 LTS running · light", "gallery: caption describes the selection");
check(await page.locator("#shot").evaluate((i) => i.complete && i.naturalWidth > 0), "gallery: the swapped image loads");
await page.focus('[aria-label="Scene"] [aria-checked="true"]');
await page.keyboard.press("ArrowRight");
await page.waitForFunction(() => document.getElementById("shot").src.includes("app-light-new-machine"));
check(true, "gallery: ArrowRight moves to the next scene");
await page.keyboard.press("End");
await page.waitForFunction(() => document.getElementById("shot").src.includes("app-light-library"));
check(true, "gallery: End goes to the last scene");
await page.click("#theme");
check(await page.getAttribute("html", "data-theme") === "dark", "landing: theme toggle -> dark");
await page.waitForFunction(() => document.getElementById("shot").src.includes("app-dark-library"));
check(await page.locator('[aria-label="Appearance"] [aria-checked="true"]').innerText() === "Dark", "gallery: follows the page theme");
await page.reload();
check(await page.getAttribute("html", "data-theme") === "dark", "landing: theme persists across reload");
await shot(page, "site-landing-dark");
const combos = [];
for (const m of ["light", "dark"]) for (const v of ["debian", "ubuntu", "new-machine", "downloading", "graphics", "library"]) combos.push(`ux/app-${m}-${v}.png`);
const missing = [];
for (const c of combos) { const r = await page.request.get(base + c); if (!r.ok()) missing.push(c); }
check(missing.length === 0, `gallery: all ${combos.length} screenshots are served${missing.length ? " (missing: " + missing.join(", ") + ")" : ""}`);
await scrollAll(page);
const brokenImgs = () => page.evaluate(() => [...document.images].filter((i) => i.offsetParent !== null && (!i.complete || i.naturalWidth === 0)).map((i) => i.getAttribute("src")));
let broken = await brokenImgs();
for (let i = 0; broken.length && i < 40; i++) { await page.waitForTimeout(250); broken = await brokenImgs(); }
check(broken.length === 0, `landing: every visible image loads${broken.length ? " (broken: " + broken.join(", ") + ")" : ""}`);
await page.locator("#quickstart .copy").first().click();
await page.waitForSelector("#toast:not([hidden])");
check((await page.locator("#toast").innerText()).includes("Copied"), "quickstart: copy reports success");
check((await page.evaluate(() => navigator.clipboard.readText())).includes("ssh velora@"), "quickstart: clipboard holds the ssh command");
await page.locator("#quickstart").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
check(await page.locator('#sections a[href="#quickstart"]').getAttribute("aria-current") === "true", "nav: scroll-spy marks the section in view");
check(await noSideScroll(page), "landing: no horizontal scroll (desktop)");
const meta = await page.evaluate(() => ({ og: document.querySelector('meta[property="og:image"]')?.content, canonical: document.querySelector("link[rel=canonical]")?.href, ld: !!document.querySelector('script[type="application/ld+json"]') }));
check(!!meta.og && meta.og.endsWith("/social/velora-hero-dark.jpg") && !!meta.canonical && meta.ld, "landing: og:image, canonical, JSON-LD");
for (const f of ["robots.txt", "sitemap.xml", "favicon.svg", "apple-touch-icon.png", "social/velora-hero-dark.jpg", "og.jpg", "ux/velora-demo.gif"]) check((await page.request.get(base + f)).ok(), `landing: ${f} is served`);
const r404 = await page.request.get(base + "no-such-page");
check(r404.status() === 404 && (await r404.text()).includes("No machine here"), "404: unknown path serves the 404 page");
const html = fs.readFileSync(path.join(siteDir, "index.html"), "utf8") + fs.readFileSync(path.join(siteDir, "site.css"), "utf8");
check(!/orange|#f56a21|#f77745|#ff7a1a/i.test(html), "style: no orange anywhere in the page or stylesheet");
bad.forEach((b) => check(false, b));
await ctx.close();

// ---------- phone
({ ctx, page, bad } = await open("dark", { width: 390, height: 844 }, "landing-mobile"));
await page.goto(base);
check(await noSideScroll(page), "mobile: no horizontal scroll");
check(await page.locator(".seg.wide").evaluate((el) => el.scrollWidth >= el.clientWidth), "mobile: the scene picker scrolls instead of overflowing the page");
await shot(page, "site-landing-mobile");
bad.forEach((b) => check(false, b));
await ctx.close();

await browser.close();
srv.close();
if (failures.length) { console.error(`\n${failures.length} check(s) failed`); process.exit(1); }
console.log("\nsite check passed");

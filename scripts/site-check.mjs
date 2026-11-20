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
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".txt": "text/plain", ".xml": "application/xml", ".pdf": "application/pdf" };
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

async function open(scheme, viewport, tag) {
  const ctx = await browser.newContext({ colorScheme: scheme, viewport, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const bad = [];
  page.on("pageerror", (e) => bad.push(`${tag} pageerror: ${e.message}`));
  page.on("response", (r) => { if (r.status() >= 400 && !/\/404\.html$/.test(r.url()) && !r.url().includes("no-such-page")) bad.push(`${tag} ${r.status()} ${r.url()}`); });
  return { ctx, page, bad };
}
const scrollAll = (page) => page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
const noSideScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const brokenImgs = (page) => page.evaluate(() => [...document.images].filter((i) => i.offsetParent !== null && (!i.complete || i.naturalWidth === 0)).map((i) => i.getAttribute("src")));

for (const [scheme, vp, tag] of [["light", { width: 1440, height: 900 }, "desktop-light"], ["dark", { width: 390, height: 844 }, "mobile-dark"]]) {
  const { ctx, page, bad } = await open(scheme, vp, tag);
  await page.goto(base);
  check((await page.title()).includes("Velora"), `${tag}: title`);
  check((await page.locator("h1").count()) === 1 && (await page.locator("h1").innerText()).includes("Velora"), `${tag}: one h1`);
  await scrollAll(page);
  await page.evaluate(() => [...document.images].forEach((i) => { i.loading = "eager"; }));
  let broken = await brokenImgs(page);
  for (let i = 0; broken.length && i < 40; i++) { await page.waitForTimeout(250); broken = await brokenImgs(page); }
  check(broken.length === 0, `${tag}: every visible image loads${broken.length ? " (broken: " + broken.join(", ") + ")" : ""}`);
  check(await noSideScroll(page), `${tag}: no horizontal scroll`);
  if (shotsDir) { fs.mkdirSync(shotsDir, { recursive: true }); await page.screenshot({ path: path.join(shotsDir, `site-${tag}.png`) }); }
  if (tag === "desktop-light") {
    const meta = await page.evaluate(() => ({ og: document.querySelector('meta[property="og:image"]')?.content, canonical: document.querySelector("link[rel=canonical]")?.href, ld: !!document.querySelector('script[type="application/ld+json"]') }));
    check(/^https:\/\/zyvorai\.github\.io\/velora\/social\/og\.png$/.test(meta.og || "") && !!meta.canonical && meta.ld, "landing: absolute og:image, canonical, JSON-LD");
    for (const f of ["robots.txt", "sitemap.xml", "favicon.svg", "apple-touch-icon.png", "social/og.png", "social/square.png", "social/social-preview.png", "og.jpg", "Velora-Client-Overview.pdf", "assets/landing.css", "ux/app-dark-home.png"]) check((await page.request.get(base + f)).ok(), `landing: ${f} is served`);
    const r404 = await page.request.get(base + "no-such-page");
    check(r404.status() === 404 && (await r404.text()).includes("No machine here"), "404: unknown path serves the 404 page");
  }
  bad.forEach((b) => check(false, b));
  await ctx.close();
}
await browser.close();
srv.close();
if (failures.length) { console.error(`\n${failures.length} check(s) failed`); process.exit(1); }
console.log("\nsite check passed");

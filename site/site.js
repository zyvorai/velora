// Theme toggle, scroll-spy, the screenshot gallery, copy buttons. No dependencies.
(function () {
  var root = document.documentElement;
  var KEY = (window.__veloraTheme || {}).key || "velora-site-theme";
  var btn = document.getElementById("theme");

  function paint(theme) {
    root.setAttribute("data-theme", theme);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", theme === "dark" ? "#07080d" : "#ffffff");
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  // ---- gallery: appearance x scene, all real captures of the app
  var state = { mode: root.getAttribute("data-theme") === "light" ? "light" : "dark", view: "debian" };
  var LABEL = { light: "light", dark: "dark", debian: "Debian 13 running", ubuntu: "Ubuntu 26.04 LTS running", console: "Console & Command", usage: "Usage", "new-machine": "New Machine", downloading: "Downloading an image", graphics: "Graphics", library: "Library", models: "Models", endpoints: "Endpoints", training: "Training a LoRA adapter", resources: "Resources and a running VM", fleet: "Fleet", cluster: "Kubernetes", fluxvm: "FluxVM", kairon: "Kairon", home: "Platform home" };
  var img = document.getElementById("shot"), cap = document.getElementById("shot-cap");
  var groups = [].slice.call(document.querySelectorAll(".seg"));

  function syncControls() {
    groups.forEach(function (g) {
      [].forEach.call(g.querySelectorAll('[role="radio"]'), function (b) {
        var on = b.getAttribute("data-value") === state[g.getAttribute("data-key")];
        b.setAttribute("aria-checked", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
      });
    });
  }
  function render() {
    var src = "ux/app-" + state.mode + "-" + state.view + ".png";
    var text = LABEL[state.view] + " · " + LABEL[state.mode];
    var alt = "Velora: " + LABEL[state.view] + ", " + LABEL[state.mode] + " appearance";
    syncControls();
    if (!img || img.getAttribute("src") === src) { if (cap) cap.textContent = text; return; }
    img.classList.add("swap");
    var pre = new Image();
    pre.onload = pre.onerror = function () { img.src = src; img.alt = alt; img.classList.remove("swap"); };
    pre.src = src;
    if (cap) cap.textContent = text;
  }
  groups.forEach(function (g) {
    var radios = [].slice.call(g.querySelectorAll('[role="radio"]'));
    radios.forEach(function (b, i) {
      b.addEventListener("click", function () { state[g.getAttribute("data-key")] = b.getAttribute("data-value"); render(); });
      b.addEventListener("keydown", function (e) {
        var n = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: radios.length - 1 }[e.key];
        if (n === undefined) return;
        e.preventDefault();
        var t = radios[(n + radios.length) % radios.length];
        state[g.getAttribute("data-key")] = t.getAttribute("data-value"); render(); t.focus();
      });
    });
  });

  paint(root.getAttribute("data-theme") || "light");
  render();
  if (btn) btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
    paint(next);
    state.mode = next; render(); // the gallery follows the page
  });

  // Scroll-spy
  var links = [].slice.call(document.querySelectorAll("#sections a"));
  if ("IntersectionObserver" in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = byId[e.target.id]; if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  // Copy buttons (clipboard API needs https/localhost; fall back so it also works elsewhere)
  var toast = document.getElementById("toast"), timer;
  function say(msg) { toast.textContent = msg; toast.hidden = false; clearTimeout(timer); timer = setTimeout(function () { toast.hidden = true; }, 2200); }
  function legacy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    var ok = document.execCommand("copy"); document.body.removeChild(ta);
    if (!ok) throw new Error("copy refused");
  }
  [].forEach.call(document.querySelectorAll(".copy"), function (b) {
    b.addEventListener("click", function () {
      var text = b.parentNode.querySelector("pre").textContent;
      var done = function () { say("Copied to clipboard"); }, fail = function () { say("Copy failed. Select the text and copy it."); };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { try { legacy(text); done(); } catch (e) { fail(); } });
      else { try { legacy(text); done(); } catch (e) { fail(); } }
    });
  });
})();

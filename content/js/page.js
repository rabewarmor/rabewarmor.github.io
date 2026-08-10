(function () {
  "use strict";

  const mount = document.getElementById("page");
  const section = document.body.getAttribute("data-section");

  if (typeof SITE === "undefined" || typeof RENDER === "undefined") {
    mount.innerHTML = '<p class="err">FATAL: data.js or render.js failed to load.</p>';
    return;
  }
  if (typeof RENDER[section] !== "function") {
    mount.innerHTML = '<p class="err">Unknown section: ' + RENDER.esc(section) + "</p>";
    return;
  }

  mount.innerHTML = RENDER[section]();

  try {
    const t = localStorage.getItem("theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
  } catch (e) { /* private mode */ }
})();
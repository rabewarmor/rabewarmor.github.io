/* Shared HTML builders, used by BOTH terminal.js and page.js. */
window.RENDER = (function () {
  "use strict";

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  function item(o) {
    const org  = o.org  ? ' <span class="item-org">— ' + esc(o.org) + "</span>" : "";
    const date = o.date ? '<span class="item-date">' + esc(o.date) + "</span>" : "";
    const tech = o.tech ? '<div class="dim">[ ' + o.tech.map(esc).join(" · ") + " ]</div>" : "";
    const link = o.link ? ' <a href="' + esc(o.link) + '" target="_blank" rel="noopener">↗</a>' : "";
    const list = o.bullets
      ? '<ul class="bullets">' + o.bullets.map(b => "<li>" + esc(b) + "</li>").join("") + "</ul>"
      : "";
    return '<div class="item"><div class="item-head">' +
             '<div><span class="item-title">' + esc(o.title) + "</span>" + org + link + "</div>" +
             date + "</div>" + tech + list + "</div>";
  }

  const wrap = (title, body) =>
    '<div class="section-title">' + esc(title) + "</div>" + body;

  const dl = (obj, fmt) =>
    '<dl class="kv">' + Object.entries(obj)
      .map(([k, v]) => "<dt>" + esc(k) + "</dt><dd>" + fmt(v) + "</dd>").join("") + "</dl>";

  return {
    esc: esc,

    about()      { return wrap("about", "<div>" + SITE.about.map(esc).join("<br>") + "</div>"); },
    experience() { return wrap("experience", SITE.experience.map(item).join("")); },
    projects()   { return wrap("projects",   SITE.projects.map(item).join("")); },
    education()  { return wrap("education",  SITE.education.map(item).join("")); },
    skills()     { return wrap("skills", dl(SITE.skills, esc)); },
    socials()    {
      return wrap("socials", dl(SITE.socials, (v) =>
        "<a href='" + esc(v.url) + "' target='_blank' rel='noopener'>" + esc(v.label) + "</a>"));
    }
  };
})();
(function () {
  "use strict";

  const output = document.getElementById("output");
  const input  = document.getElementById("cmd-input");
  const form   = document.getElementById("cmd-form");
  const shell  = document.getElementById("terminal");

  const THEMES = ["dark", "light", "matrix", "ubuntu", "amber"];

  const history = [];
  let historyIndex = -1;

  /* ---------- helpers ---------- */

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

  const promptHTML = () =>
    '<span class="prompt">' +
      '<span class="prompt-user">visitor</span>' +
      '<span class="prompt-at">@</span>' +
      '<span class="prompt-host">rabewar</span>' +
      '<span class="prompt-sep">:</span>' +
      '<span class="prompt-path">~</span>' +
      '<span class="prompt-sym">$</span>' +
    '</span>';

  function append(html) {
    const div = document.createElement("div");
    div.className = "entry-body";
    div.innerHTML = html;
    output.appendChild(div);
    scrollToBottom();
  }

  function echoCommand(raw) {
    const div = document.createElement("div");
    div.className = "entry-cmd";
    div.innerHTML = promptHTML() + "<span>" + esc(raw) + "</span>";
    output.appendChild(div);
  }

  function scrollToBottom() {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
  }

  function itemBlock(item) {
    const org   = item.org ? ' <span class="item-org">— ' + esc(item.org) + "</span>" : "";
    const date  = item.date ? '<span class="item-date">' + esc(item.date) + "</span>" : "";
    const tech  = item.tech ? '<div class="dim">[ ' + item.tech.map(esc).join(" · ") + " ]</div>" : "";
    const link  = item.link ? ' <a href="' + esc(item.link) + '" target="_blank" rel="noopener">↗</a>' : "";
    const list  = item.bullets
      ? '<ul class="bullets">' + item.bullets.map((b) => "<li>" + esc(b) + "</li>").join("") + "</ul>"
      : "";

    return (
      '<div class="item">' +
        '<div class="item-head">' +
          '<div><span class="item-title">' + esc(item.title) + "</span>" + org + link + "</div>" +
          date +
        "</div>" + tech + list +
      "</div>"
    );
  }

  function section(title, body) {
    return '<div class="section-title">' + esc(title) + "</div>" + body;
  }

  /* ---------- commands ---------- */

  const COMMANDS = {
    help: {
      desc: "list all available commands",
      run() {
        const rows = Object.keys(COMMANDS)
          .sort()
          .map((k) => "<dt>" + k + "</dt><dd>" + esc(COMMANDS[k].desc) + "</dd>")
          .join("");
        return (
          section("available commands", '<dl class="help-grid">' + rows + "</dl>") +
          '<div class="hint" style="margin-top:1rem">' +
            "Tab to autocomplete · ↑ ↓ to walk history · " +
            '<span class="cmd">clear</span> to reset the screen' +
          "</div>"
        );
      }
    },

    about: {
      desc: "who I am",
      run() {
        return section("about", "<div>" + SITE.about.map(esc).join("<br>") + "</div>");
      }
    },

    experience: {
      desc: "where I have worked",
      run() {
        return section("experience", SITE.experience.map(itemBlock).join(""));
      }
    },

    projects: {
      desc: "things I have built",
      run() {
        return section("projects", SITE.projects.map(itemBlock).join(""));
      }
    },

    education: {
      desc: "schooling",
      run() {
        return section("education", SITE.education.map(itemBlock).join(""));
      }
    },

    skills: {
      desc: "tools and technologies",
      run() {
        const rows = Object.entries(SITE.skills)
          .map(([k, v]) => "<dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd>")
          .join("");
        return section("skills", '<dl class="kv">' + rows + "</dl>");
      }
    },

    socials: {
      desc: "where to find me",
      run() {
        const rows = Object.entries(SITE.socials)
          .map(([k, v]) =>
            "<dt>" + esc(k) + "</dt><dd><a href='" + esc(v.url) +
            "' target='_blank' rel='noopener'>" + esc(v.label) + "</a></dd>")
          .join("");
        return section("socials", '<dl class="kv">' + rows + "</dl>");
      }
    },

    resume: {
      desc: "open my resume (PDF)",
      run() {
        window.open(SITE.resumeUrl, "_blank", "noopener");
        return '<div class="dim">opening ' + esc(SITE.resumeUrl) +
               ' … if nothing happened, <a href="' + esc(SITE.resumeUrl) +
               '" target="_blank" rel="noopener">click here</a>.</div>';
      }
    },

    whoami: {
      desc: "print the current user",
      run() {
        return "<div>" + esc(SITE.name) + ' <span class="dim">— ' +
               esc(SITE.tagline) + " · " + esc(SITE.location) + "</span></div>";
      }
    },

    themes: {
      desc: "list themes — usage: themes set <name>",
      run(args) {
        if (args[0] === "set" && args[1]) {
          const name = args[1].toLowerCase();
          if (!THEMES.includes(name)) {
            return '<div class="err">unknown theme: ' + esc(name) + "</div>";
          }
          setTheme(name);
          return '<div>theme set to <span class="tag">' + esc(name) + "</span></div>";
        }
        return section(
          "themes",
          "<div>" + THEMES.map((t) => '<span class="tag">' + t + "</span>").join(" · ") + "</div>" +
          '<div class="dim" style="margin-top:.5rem">usage: <span class="cmd">themes set matrix</span></div>'
        );
      }
    },

    banner: {
      desc: "redraw the banner",
      run() { return bannerHTML(); }
    },

    history: {
      desc: "show command history",
      run() {
        if (!history.length) return '<div class="dim">no history yet.</div>';
        return "<div>" + history.map((h, i) =>
          '<span class="dim">' + String(i + 1).padStart(3, " ") + "</span>  " + esc(h)
        ).join("<br>") + "</div>";
      }
    },

    echo: {
      desc: "print text back",
      run(args) { return "<div>" + esc(args.join(" ")) + "</div>"; }
    },

    clear: {
      desc: "clear the terminal",
      run() { output.innerHTML = ""; return null; }
    }
  };

  /* ---------- theme ---------- */

  function setTheme(name) {
    document.documentElement.setAttribute("data-theme", name);
    try { localStorage.setItem("theme", name); } catch (e) { /* private mode */ }
  }

  function restoreTheme() {
    try {
      const saved = localStorage.getItem("theme");
      if (saved && THEMES.includes(saved)) setTheme(saved);
    } catch (e) { /* ignore */ }
  }

  /* ---------- banner ---------- */

  function bannerHTML() {
    return (
      '<h1 class="banner-name">' + esc(SITE.name) + "</h1>" +
      '<div class="banner-rule"></div>' +
      '<div class="tagline">' + esc(SITE.tagline) + " · " + esc(SITE.location) + "</div>" +
      '<div class="hint">Type <span class="cmd">help</span> to see what this thing does.</div>'
    );
  }

  /* ---------- execution ---------- */

  function run(raw) {
    echoCommand(raw);
    const line = raw.trim();
    if (!line) { scrollToBottom(); return; }

    history.push(raw);
    historyIndex = history.length;

    const parts = line.split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);
    const cmd = COMMANDS[name];

    if (!cmd) {
      append(
        '<div><span class="err">command not found: ' + esc(name) + "</span>" +
        ' — try <span class="cmd">help</span></div>'
      );
      return;
    }

    const result = cmd.run(args);
    if (result) append(result);
    else scrollToBottom();
  }

  /* ---------- input handling ---------- */

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;
    input.value = "";
    run(value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) { historyIndex--; input.value = history[historyIndex]; }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      if (!partial) return;
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        echoCommand(input.value);
        append("<div>" + matches.map((m) => '<span class="cmd">' + m + "</span>").join("  ") + "</div>");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      output.innerHTML = "";
    }
  });

  // Clicking anywhere refocuses the input, unless the user is selecting text
  // or clicking a link.
  shell.addEventListener("click", (e) => {
    if (window.getSelection().toString()) return;
    if (e.target.closest("a")) return;
    input.focus();
  });

  /* ---------- boot ---------- */

  restoreTheme();
  append(bannerHTML());
  input.focus();
})();
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ boot sequence ============ */
  const boot = document.getElementById("boot");
  const bootLog = document.getElementById("boot-log");
  const bootLines = [
    "> initializing sathwik.os ...",
    "> mounting /dev/curiosity ............ ok",
    "> loading neural modules ████████████ 100%",
    "> verifying signal-to-noise ratio .... high",
    "> welcome, recruiter.",
  ];

  const skipBoot = () => {
    boot.classList.add("fade");
    setTimeout(() => boot.remove(), 450);
    sessionStorage.setItem("booted", "1");
  };

  if (sessionStorage.getItem("booted") || reduced) {
    boot.remove();
  } else {
    let i = 0;
    const tick = () => {
      if (i >= bootLines.length) {
        setTimeout(skipBoot, 350);
        return;
      }
      bootLog.textContent += bootLines[i] + "\n";
      i++;
      setTimeout(tick, 220);
    };
    tick();
    addEventListener("keydown", skipBoot, { once: true });
    boot.addEventListener("click", skipBoot, { once: true });
  }

  /* ============ typed hero ============ */
  const typed = document.getElementById("typed");
  const phrases = [
    "building AI systems that think locally, act globally.",
    "shipping small models, big outcomes.",
    "agents that do work, not just chat.",
  ];
  if (typed && !reduced) {
    let p = 0,
      c = 0,
      deleting = false;
    const loop = () => {
      const word = phrases[p];
      typed.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
      let delay = deleting ? 22 : 38;
      if (!deleting && c === word.length + 1) {
        delay = 1800;
        deleting = true;
      } else if (deleting && c === 0) {
        deleting = false;
        p = (p + 1) % phrases.length;
        delay = 250;
      }
      setTimeout(loop, delay);
    };
    setTimeout(loop, 600);
  } else if (typed) {
    typed.textContent = phrases[0];
  }

  /* ============ scroll reveal ============ */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ============ hire pill ============ */
  const hire = document.getElementById("hire-pill");
  addEventListener(
    "scroll",
    () => {
      if (scrollY > 600) hire.classList.add("show");
      else hire.classList.remove("show");
    },
    { passive: true },
  );

  /* ============ toast ============ */
  const toast = document.getElementById("toast");
  let toastT;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 1800);
  };

  /* ============ copy buttons ============ */
  document.querySelectorAll("[data-copy]").forEach((el) => {
    if (el.tagName === "BUTTON") {
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(el.dataset.copy);
          showToast("copied: " + el.dataset.copy);
        } catch {
          showToast("copy failed");
        }
      });
    }
  });

  /* ============ command palette ============ */
  const cmdk = document.getElementById("cmdk");
  const cmdkQ = document.getElementById("cmdk-q");
  const cmdkList = document.getElementById("cmdk-list");
  const cmdkOpen = document.getElementById("cmdk-open");

  const commands = [
    {
      id: "hero",
      label: "goto: top",
      hint: "↵",
      run: () => (location.hash = "#top"),
    },
    {
      id: "manifesto",
      label: "goto: manifesto",
      hint: "↵",
      run: () => (location.hash = "#manifesto"),
    },
    {
      id: "work",
      label: "goto: work",
      hint: "↵",
      run: () => (location.hash = "#work"),
    },
    {
      id: "stack",
      label: "goto: stack",
      hint: "↵",
      run: () => (location.hash = "#stack"),
    },
    {
      id: "contact",
      label: "goto: contact",
      hint: "↵",
      run: () => (location.hash = "#contact"),
    },
    {
      id: "email",
      label: "email pinnam",
      hint: "mailto + copy",
      run: async () => {
        try {
          await navigator.clipboard.writeText("pinnamsathwikkumar@gmail.com");
        } catch {}
        showToast("email copied — opening mail");
        location.href =
          "mailto:pinnamsathwikkumar@gmail.com?subject=Hello%20Sathwik";
      },
    },
    {
      id: "phone",
      label: "copy phone",
      hint: "+91 …",
      run: async () => {
        try {
          await navigator.clipboard.writeText("+919390798091");
          showToast("phone copied");
        } catch {
          showToast("copy failed");
        }
      },
    },
    {
      id: "github",
      label: "open github",
      hint: "↗",
      run: () => window.open("https://github.com/PinnamSathwikKumar", "_blank"),
    },
    {
      id: "source",
      label: "open EduMate source",
      hint: "↗",
      run: () =>
        window.open(
          "https://github.com/PinnamSathwikKumar/EduMate-Notes_to_Knowledge.git",
          "_blank",
        ),
    },
    {
      id: "clear",
      label: "clear: reset boot animation",
      hint: "reload",
      run: () => {
        sessionStorage.removeItem("booted");
        location.reload();
      },
    },
  ];

  let active = 0;
  const renderList = (q = "") => {
    const filtered = commands.filter((c) =>
      c.label.toLowerCase().includes(q.toLowerCase()),
    );
    cmdkList.innerHTML =
      filtered
        .map(
          (c, i) =>
            `<li data-id="${c.id}" class="${i === active ? "active" : ""}"><span>${c.label}</span><span class="hint">${c.hint}</span></li>`,
        )
        .join("") || '<li class="hint" style="cursor:default">no matches</li>';
    return filtered;
  };

  let visible = [];
  const openCmdk = () => {
    cmdk.hidden = false;
    active = 0;
    cmdkQ.value = "";
    visible = renderList("");
    setTimeout(() => cmdkQ.focus(), 30);
  };
  const closeCmdk = () => {
    cmdk.hidden = true;
  };

  cmdkOpen.addEventListener("click", openCmdk);
  cmdk.addEventListener("click", (e) => {
    if (e.target === cmdk) closeCmdk();
  });

  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      cmdk.hidden ? openCmdk() : closeCmdk();
    } else if (!cmdk.hidden) {
      if (e.key === "Escape") closeCmdk();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        active = Math.min(active + 1, visible.length - 1);
        visible = renderList(cmdkQ.value);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = Math.max(active - 1, 0);
        visible = renderList(cmdkQ.value);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = visible[active];
        if (cmd) {
          closeCmdk();
          cmd.run();
        }
      }
    }
  });

  cmdkQ.addEventListener("input", () => {
    active = 0;
    visible = renderList(cmdkQ.value);
  });
  cmdkList.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-id]");
    if (!li) return;
    const cmd = commands.find((c) => c.id === li.dataset.id);
    if (cmd) {
      closeCmdk();
      cmd.run();
    }
  });
})();

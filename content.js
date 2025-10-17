// Prevent double injection
if (window.leetcodeFocusModeLoaded) {
  console.log("LeetCode Focus Mode already loaded — skipping reinjection.");
} else {
  window.leetcodeFocusModeLoaded = true;
  let hiddenEls = [];
  let obs = null;
  let lastUrl = location.href;

  // --- Overlay (for smoother hide) ---
  function showFocusOverlay() {
    if (document.getElementById("focus-mode-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "focus-mode-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: 0,
      background: "white",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.1rem",
      fontWeight: "500",
      color: "#333",
      transition: "opacity 0.3s ease"
    });
    overlay.textContent = "🧘 Focus Mode loading...";
    document.body.appendChild(overlay);
  }

  function hideFocusOverlay() {
    const overlay = document.getElementById("focus-mode-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 300);
    }
  }

  // --- Hiding logic ---
  function hideDistractions() {
    const isProblemPage = /leetcode\.com\/problems\//.test(location.href);
    const isProblemSetPage = /leetcode\.com\/problemset\//.test(location.href);

    const main = document.querySelector("main, #__next") || document.body;

    const attrSelectors = isProblemPage
      ? ['[data-layout-path="/ts0/tb1"]', '[data-layout-path="/ts0/tb2"]']
      : [];

    const textTargets = isProblemPage
      ? ["Easy", "Med.", "Medium", "Hard", "Topics", "Companies", "Hint", "Similar Questions", "Discussion"]
      : ["Easy", "Med.", "Medium", "Hard"];

    const hintRegex = /^Hint\s*\d*$/;
    const percentRegex = /^\d+(\.\d+)?\s*%$/;

    const nodes = main.querySelectorAll("a,button,span,div,li,p");

    nodes.forEach((el) => {
      // skip logo/header/nav
      if (el.closest("header") || el.closest("nav") || el.className?.includes("logo")) return;

      const text = el.textContent?.trim();
      if (!text) return;

      const match =
        attrSelectors.some((s) => el.matches(s)) ||
        textTargets.includes(text) ||
        hintRegex.test(text) ||
        percentRegex.test(text);

      if (
        match &&
        el.offsetWidth < window.innerWidth * 0.9 &&
        el.offsetHeight < window.innerHeight * 0.9
      ) {
        el.dataset.prevDisplay = el.style.display || "";
        el.style.display = "none";
        hiddenEls.push(el);
      }
    });
  }

  function restoreDistractions() {
    hiddenEls.forEach((el) => {
      el.style.display = el.dataset.prevDisplay || "";
      delete el.dataset.prevDisplay;
    });
    hiddenEls = [];
  }

  // --- Fullscreen helpers ---
  function enterFullScreen() {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen().catch(() => {});
  }
  function exitFullScreen() {
    if (document.fullscreenElement)
      document.exitFullscreen().catch(() => {});
  }

  // --- Toggle Focus ---
  function toggleFocus(enable) {
    const isProblemPage = /leetcode\.com\/problems\//.test(location.href);
    if (enable) {
      showFocusOverlay();
      setTimeout(() => {
        hideDistractions();
        hideFocusOverlay();
        // if (isProblemPage) enterFullScreen();
        if (obs) obs.disconnect();
        obs = new MutationObserver(() => hideDistractions());
        obs.observe(document.body, { childList: true, subtree: true });
      }, 500);
    } else {
      if (obs) obs.disconnect();
      showFocusOverlay();
      setTimeout(() => {
        restoreDistractions();
        hideFocusOverlay();
        // if (isProblemPage) exitFullScreen();
      }, 200);
    }
  }

  // --- React/SPA route detection ---
  function setupSpaListener() {
    const push = history.pushState;
    const replace = history.replaceState;
    const onChange = () => {
      setTimeout(() => {
        if (location.href !== lastUrl) {
          lastUrl = location.href;
          chrome.storage.local.get("focusOn", ({ focusOn }) => {
            if (focusOn) toggleFocus(true);
          });
        }
      }, 500);
    };
    history.pushState = function (...args) {
      push.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
    };
    history.replaceState = function (...args) {
      replace.apply(this, args);
      window.dispatchEvent(new Event("locationchange"));
    };
    window.addEventListener("popstate", () => window.dispatchEvent(new Event("locationchange")));
    window.addEventListener("locationchange", onChange);
  }

  // --- Listen for background toggle ---
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "LEETCODE_FOCUS_TOGGLE") toggleFocus(msg.enable);
  });

  // --- Initialize ---
  setupSpaListener();
  chrome.storage.local.get("focusOn", ({ focusOn }) => {
    if (focusOn) toggleFocus(true);
  });
}

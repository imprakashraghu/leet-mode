chrome.runtime.onInstalled.addListener(() => createOrUpdateMenu(false));
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("focusOn", ({ focusOn }) => {
    createOrUpdateMenu(!!focusOn);
  });
});

function createOrUpdateMenu(state) {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "leetcode-focus-toggle",
      title: state ? "Disable Leet Mode" : "Enable Leet Mode",
      contexts: ["page"],
      documentUrlPatterns: [
        "*://leetcode.com/*",
        "*://leetcode.com/problems/*",
        "*://leetcode.com/problemset/*"
      ]
    });
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "leetcode-focus-toggle") {
    const { focusOn = false } = await chrome.storage.local.get("focusOn");
    const newState = !focusOn;
    await chrome.storage.local.set({ focusOn: newState });
    createOrUpdateMenu(newState);
    await ensureContentScript(tab.id, newState);
  }
});

// ✅ Injects or re-injects content script when needed
async function ensureContentScript(tabId, enableState) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: "LEETCODE_FOCUS_TOGGLE",
      enable: enableState
    });
  } catch {
    console.log("Injecting content.js into LeetCode tab…");
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });
    await chrome.tabs.sendMessage(tabId, {
      type: "LEETCODE_FOCUS_TOGGLE",
      enable: enableState
    });
  }
}

// ✅ Detects SPA and normal navigations
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  const { focusOn } = await chrome.storage.local.get("focusOn");
  if (focusOn && details.url.includes("leetcode.com")) {
    console.log("LeetCode route changed → re-injecting Focus Mode");
    await ensureContentScript(details.tabId, true);
  }
});
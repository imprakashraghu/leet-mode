# 🧘 Leet Mode Extension

![License: MIT License](https://img.shields.io/badge/License-mit-blue.svg)

**Leet Mode** is an open-source Chrome extension that helps you stay distraction-free while practicing coding problems on [LeetCode](https://leetcode.com).

---

## 🎯 What it does

- **Hides common distractions**  
  Automatically removes tabs and elements such as *Solutions*, *Editorial*, *Companies*, *Hint 1…n*, and difficulty labels (*Easy / Medium / Hard*).

- **Cleans up statistics**  
  Hides acceptance percentages and other noisy data from the problemset list.

- **Focus mode toggle**  
  Right-click anywhere on a LeetCode page and enable or disable Focus Mode instantly.

- **Smart re-apply**  
  Works across LeetCode’s single-page-app navigation so you stay in focus even when routing internally.

---

## 🧩 How it works

- The extension adds a **context-menu toggle** that saves its state in local storage.  
- A **background service worker** listens for route changes inside LeetCode and reinjects a small **content script** when needed.  
- The content script hides distracting DOM elements and re-enables them when focus mode is turned off.  
- A brief **loading overlay** prevents flickering while changes apply.

---

## 💬 Contributing

Pull requests are welcome!  
If you’d like to improve performance, add new filters, or adjust the visual transitions:

1. Fork the repository.  
2. Create a feature branch.  
3. Commit and push your changes.  
4. Open a pull request with a clear description of your update.

Please keep contributions small and focused—one improvement per PR makes review easier.

---

## 🧱 Folder overview

```
leet-mode/
│
├── background.js        # Service worker controlling context menu & reinjection
├── content.js           # Logic for hiding elements
├── manifest.json        # Chrome MV3 manifest
├── icons/
│   └── icon128.png
└── README.md
```

---

## 🧑‍💻 Development guidelines

- Follow existing code style and naming conventions.  
- Test thoroughly on both problem and problemset pages.  
- Avoid adding heavy dependencies—keep it lightweight.  
- Ensure new features respect user privacy (no external network calls).

---

## 📜 License

Released under the **MIT License** — free to use, modify, and share.

---

## 🌟 Acknowledgements

Built by the community for developers who prefer focus over distraction.  
Contributions, ideas, and improvements are always welcome.

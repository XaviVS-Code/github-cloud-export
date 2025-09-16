# GitHub Cloud Export 🚀

Export GitHub repositories, releases, or files directly to your cloud storage of choice: **Google Drive**, **OneDrive**, or **Dropbox**. Built for chaos-tolerant devs who want modular workflows and immortalized exports.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Beta-orange)
![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-pending-lightgrey)
![Discord](https://img.shields.io/badge/support-Discord%3A%20Xavi138-5865F2)
![OneDrive](https://img.shields.io/badge/OneDrive-sandboxed%20%26%20sleeping-lightgrey)

> Quick links: [Install](#installation) • [Features](#-features) • [Architecture](#-architecture) • [Roadmap](#-roadmap) • [Support](#-support) • [Contributing](#-contributing)

---

## ⚠️ OneDrive Status

> **Heads up:** OneDrive integration is temporarily disabled due to Microsoft sandbox access issues.  
> We're actively working to restore functionality once the Microsoft 365 E5 developer environment is provisioned.  
> Until then, Google Drive and Dropbox exports work flawlessly.

---

## 📦 Installation

To install GitHub Cloud Export locally:

1. **Clone the repo**  
   ```bash
   git clone https://github.com/XaviVS-Code/github-cloud-export.git
   ```
2. **Open Chrome and go to** `chrome://extensions`
3. **Enable Developer Mode** (toggle in the top right)
4. **Click “Load unpacked”** and select the cloned project folder
5. **Visit any GitHub repo page**
6. **Click the extension icon** and choose your cloud target

> ⚠️ **Note:** OneDrive integration is currently disabled due to Microsoft sandbox restrictions.  
> Google Drive and Dropbox exports work as expected.

---

## 🔧 Features

- **One-click export** from any GitHub repo page  
- **Choose your cloud**: Google Drive, Dropbox, or OneDrive  
- **Minimal popup UI** with dark mode support  
- **Secure OAuth flows** for each provider  
- **Modular background logic** for easy expansion  
- **Future-proof architecture** for desktop and batch exports  

---

## 🏆 Git Lore & Achievements

#### 🧙‍♂️ Git Exorcist Badge  
**Sept 16, 2025** — Survived haunted object trees, corrupted packfiles, and 400+ manual deletion prompts. Repo reborn with Electron 38.1.0 and clean history. `.git.haunted` archived for lore preservation.

#### 🧩 Environment Variable Vanquisher Badge  
**Sept 15, 2025** — Survived the npm/Node.js/PowerShell PATH saga. Documented every escalation. Setup now reproducible and meme-worthy.

---

## 🧠 Architecture

```
github-cloud-export/
├── assets/
│   ├── icon128.png
│   ├── icon48.png
│   ├── icon16.png
│   ├── icon128-dark.png
│   ├── icon48-dark.png
│   ├── icon16-dark.png
│   ├── screenshot-light.png
│   └── screenshot-dark.png
├── src/
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── background/
│   │   └── service-worker.js
│   └── utils/
│       ├── github.js
│       ├── zip.js
│       ├── drive.js
│       ├── dropbox.js
│       └── onedrive.js
├── manifest.json
├── README.md
└── LICENSE
```

---

## 🔐 Permissions

- `storage` — for future preferences and tokens  
- `identity` / `launchWebAuthFlow` — OAuth for cloud providers  
- `downloads` — for packaging and export  
- `activeTab` / `scripting` — to detect GitHub repo context  
- `host_permissions` — GitHub + cloud APIs

---

## 🛣️ Roadmap

- [x] Export current repo to cloud  
- [x] Dark mode support  
- [x] Modular background routing  
- [ ] Desktop app (Electron wrapper)  
- [ ] Export GitHub releases  
- [ ] Export starred repos and gists  
- [ ] Export history and tagging  
- [ ] Custom folder naming per provider

---

## 💬 Support

- Discord: **Xavi138**  
- GitHub Issues: Open a ticket with steps to reproduce  
- Logs: Check `chrome://extensions` > Service Worker console

---

## 🤝 Contributing

Pull requests welcome! To contribute:

1. Fork the repo  
2. Create a feature branch  
3. Add tests if needed  
4. Submit a PR with clear description

Please follow the modular structure and keep UI logic separate from background logic. For questions, ping **Xavi138** on Discord.

---

## 📜 License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE) for full terms.

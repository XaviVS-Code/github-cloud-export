# Contributing to GitHub Cloud Export

Thanks for your interest in contributing! This project thrives on modularity, chaos tolerance, and community creativity. Whether you're fixing a bug, adding a feature, or immortalizing a meme in code — you're welcome here.

---

## 🧰 Project Philosophy

- **Modular by default:** Keep logic isolated and reusable.
- **Minimalist UI:** No bloat, no fluff — just clean interactions.
- **Chaos-friendly:** Expect edge cases, and weaponize them.
- **Accessible onboarding:** Every file should be self-explanatory.

---

## 🛠️ How to Contribute

1. **Fork the repo**
2. **Create a feature branch:** `git checkout -b feature/my-feature`
3. **Make your changes**
4. **Add tests or comments if needed**
5. **Submit a pull request**
6. **Describe your changes clearly**

---

## 🧪 Testing

Manual testing:
- Load unpacked extension via `chrome://extensions`
- Visit a GitHub repo page
- Trigger export and check console logs

Automated testing (coming soon):
- Unit tests for `utils/`
- Mocked cloud responses

---

## 🧠 Style Guide

- Use ES6+ syntax  
- Prefer async/await over callbacks  
- Keep UI logic in `popup/`, cloud logic in `utils/`, and routing in `background/`  
- Comment weird edge cases — future contributors will thank you

---

## 💬 Support

Need help? Ping **Xavi138** on Discord or open an issue.

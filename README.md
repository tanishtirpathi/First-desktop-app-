# ✅ Jarvis Todo - Desktop Checklist App

A beautiful, distraction-free **Electron-based Todo Checklist** app with a sleek dark UI, animated transitions, smart timer, and interactive checkboxes.  
Built for productivity lovers who want a fast and elegant desktop experience. 🧠✨

---

## 📸 Screenshot

![Jarvis Todo Preview](./screenshot.png)

---

## 💡 Features

- ✅ **Editable rich-text checklist**
- ☑️ **Checkbox toggle** with `Shift + Enter`
- 🎯 Smart **reordering** (optional)
- 🕒 **Built-in Timer** with Start/Pause/Reset
- 🎨 **Font selector** (Inter, Roboto, Poppins, Georgia...)
- 💾 **Autosave** task content & timer state
- 🖼️ **Transparent, glassy dark UI** with blur
- 📦 Minimalist & smooth UX (no delete clutter)

---

## 🚀 Getting Started

### 1. Clone this repository
 Install Dependencies

npm install
3. Run the App
npm start
🛠️ Build the App (for production)
To create a standalone executable (Windows/macOS/Linux):
npm run build
The final packaged .exe, .dmg, or AppImage will appear inside the dist/ folder.

🧩 Technologies Used
Electron — Cross-platform desktop framework

 JavaScript — Frontend logic (no frameworks)

HTML5 + CSS3 — UI Layout and animations

Node.js — Backend Runtime

Electron Builder — For app packaging

🎨 Customization Tips
You can easily:

Change fonts by editing index.html → <select id="font-selector">

Adjust layout/blur/background from style.css

Add support for themes, reminders, or syncing with file storage

📁 Project Structure
bash
Copy
Edit
├── index.html          # Main UI layout
├── style.css           # UI styling and themes
├── renderer.js         # Frontend logic (tasks, checkboxes, timer)
├── main.js             # Electron window & IPC setup
├── package.json        # Project metadata and scripts
└── README.md           # Project documentation



MIT License — Free for personal & commercial use.
Made with ❤️ by Tanish Tirpathi

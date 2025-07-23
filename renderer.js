// 📦 Electron communication for window control buttons
const { ipcRenderer } = require("electron");

// 🎯 DOM references
const taskEditor = document.getElementById("task-container");
const fontSelector = document.getElementById("font-selector");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-timer");
const resetBtn = document.getElementById("reset-timer");

// ✅ Load previously saved font selection
const savedFont = localStorage.getItem("selectedFont");
if (savedFont) {
  taskEditor.style.fontFamily = savedFont;
  fontSelector.value = savedFont;
}

// ✅ Load previous task content
taskEditor.innerHTML = localStorage.getItem("savedContent") || "";

// 📝 Save content on every input
taskEditor.addEventListener("input", () => {
  localStorage.setItem("savedContent", taskEditor.innerHTML);
});

// 🎨 Font selector dropdown change
fontSelector.addEventListener("change", (e) => {
  const font = e.target.value;
  taskEditor.style.fontFamily = font;
  localStorage.setItem("selectedFont", font);
});

// ⌨️ Handle Enter / Shift+Enter key events for checkboxes
taskEditor.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
    const parentDiv = container.nodeType === 3 ? container.parentElement : container;
    const currentLineText = parentDiv.textContent.trim();

    const newLine = document.createElement("div");
    newLine.classList.add("task-line");

    if (e.shiftKey || currentLineText.startsWith("☐") || currentLineText.startsWith("☑")) {
      newLine.textContent = "☐ ";
    } else {
      newLine.innerHTML = "<br>";
    }

    range.collapse(false);
    range.insertNode(newLine);

    const newRange = document.createRange();
    newRange.setStart(newLine, 1);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
});

// 🖱️ Toggle checkbox state and reorder completed tasks
taskEditor.addEventListener("click", (e) => {
  const clickedLine = e.target.closest(".task-line");
  if (!clickedLine) return;

  const text = clickedLine.textContent.trim();

  if (text.startsWith("☐")) {
    clickedLine.textContent = text.replace("☐", "☑");
    clickedLine.classList.add("completed");
  } else if (text.startsWith("☑")) {
    clickedLine.textContent = text.replace("☑", "☐");
    clickedLine.classList.remove("completed");
  }

  // Reorder: unchecked on top, checked at bottom
  const lines = Array.from(taskEditor.children);
  const unchecked = [];
  const checked = [];

  lines.forEach((line) => {
    const txt = line.textContent.trim();
    if (txt.startsWith("☑")) {
      line.classList.add("completed");
      checked.push(line);
    } else {
      line.classList.remove("completed");
      unchecked.push(line);
    }
  });

  taskEditor.innerHTML = "";
  [...unchecked, ...checked].forEach((line) => taskEditor.appendChild(line));
});

// 🪟 Handle minimize and close buttons
document.getElementById("minimize-btn").addEventListener("click", () => {
  ipcRenderer.send("minimize-window");
});
document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-window");
});

// 💫 Blur effect when window is unfocused
window.addEventListener("blur", () => {
  document.body.classList.add("blur-bg");
});
window.addEventListener("focus", () => {
  document.body.classList.remove("blur-bg");
});

// ⏱️ TIMER SECTION ---------------------

let timerInterval;
let startTime;
let timerRunning = false;

// 🕓 Load previous timer values
const savedStart = localStorage.getItem("timerStart");
const savedElapsed = localStorage.getItem("timerElapsed");

// 🔁 Update timer display every second
function updateTimer() {
  const now = Date.now();
  const elapsed = new Date(now - startTime);
  const h = String(elapsed.getUTCHours()).padStart(2, "0");
  const m = String(elapsed.getUTCMinutes()).padStart(2, "0");
  const s = String(elapsed.getUTCSeconds()).padStart(2, "0");
  timerDisplay.textContent = `${h}:${m}:${s}`;
}

// 🔁 Resume timer if it was running
if (savedStart && savedElapsed) {
  const now = Date.now();
  startTime = now - parseInt(savedElapsed);
  timerRunning = true;
  timerInterval = setInterval(updateTimer, 1000);
  startBtn.textContent = "⏸";
}

// ▶️ Start or ⏸️ Pause timer on click
startBtn.addEventListener("click", () => {
  if (!timerRunning) {
    const now = Date.now();
    const previousElapsed = parseInt(localStorage.getItem("timerElapsed")) || 0;
    startTime = now - previousElapsed;

    timerInterval = setInterval(updateTimer, 1000);
    timerRunning = true;
    startBtn.textContent = "⏸";

    localStorage.setItem("timerStart", startTime.toString());
  } else {
    // Pause the timer
    clearInterval(timerInterval);
    timerRunning = false;
    startBtn.textContent = "▶";

    const now = Date.now();
    const elapsed = now - startTime;
    localStorage.setItem("timerElapsed", elapsed.toString());
  }
});

// 💾 Save timer state before window closes
window.addEventListener("beforeunload", () => {
  if (timerRunning) {
    const now = Date.now();
    const elapsed = now - startTime;
    localStorage.setItem("timerElapsed", elapsed.toString());
    localStorage.setItem("timerStart", Date.now().toString());
  }
});

// 🔄 Reset timer to 00:00:00
resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerRunning = false;
  startBtn.textContent = "▶";
  timerDisplay.textContent = "00:00:00";

  localStorage.removeItem("timerStart");
  localStorage.removeItem("timerElapsed");
});

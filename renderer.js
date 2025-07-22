const { ipcRenderer } = require("electron");

const taskEditor = document.getElementById("task-container");
const fontSelector = document.getElementById("font-selector");

// Load font from localStorage
const savedFont = localStorage.getItem("selectedFont");
if (savedFont) {
  taskEditor.style.fontFamily = savedFont;
  fontSelector.value = savedFont;
}

fontSelector.addEventListener("change", (e) => {
  const font = e.target.value;
  taskEditor.style.fontFamily = font;
  localStorage.setItem("selectedFont", font);
});

// Handle checkboxes and Enter logic
taskEditor.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Get current line before cursor
    const container = range.startContainer;
    const parentDiv = container.nodeType === 3 ? container.parentElement : container;
    const currentLineText = parentDiv.textContent.trim();

    const newLine = document.createElement("div");
    newLine.classList.add("task-line");

    // Rule 1: Shift + Enter always inserts checkbox
    if (e.shiftKey) {
      newLine.textContent = "☐ ";
    }
    // Rule 2: If current line starts with checkbox, continue with ☐
    else if (currentLineText.startsWith("☐") || currentLineText.startsWith("☑")) {
      newLine.textContent = "☐ ";
    }
    // Rule 3: Otherwise just insert empty line
    else {
      newLine.innerHTML = "<br>";
    }

    // Insert new line
    range.collapse(false);
    range.insertNode(newLine);

    // Move cursor inside new line
    const newRange = document.createRange();
    newRange.setStart(newLine, 1);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
});
// Better checkbox toggling
taskEditor.addEventListener("click", (e) => {
  const clickedLine = e.target.closest(".task-line");
  if (!clickedLine) return;

  const originalText = clickedLine.textContent;

  if (originalText.trim().startsWith("☐")) {
    clickedLine.textContent = originalText.replace("☐", "☑");
    clickedLine.classList.add("completed");
  } else if (originalText.trim().startsWith("☑")) {
    clickedLine.textContent = originalText.replace("☑", "☐");
    clickedLine.classList.remove("completed");
  }

  // Re-append reordered
  const lines = Array.from(taskEditor.children);
  const unchecked = [];
  const checked = [];

  lines.forEach(line => {
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
  [...unchecked, ...checked].forEach(line => taskEditor.appendChild(line));
});

// Window buttons
document.getElementById("minimize-btn").addEventListener("click", () => {
  ipcRenderer.send("minimize-window");
});
document.getElementById("maximize-btn").addEventListener("click", () => {
  ipcRenderer.send("maximize-window");
});
document.getElementById("close-btn").addEventListener("click", () => {
  ipcRenderer.send("close-window");
});

// Blur background on window blur
window.addEventListener("blur", () => {
  document.body.classList.add("blur-bg");
});
window.addEventListener("focus", () => {
  document.body.classList.remove("blur-bg");
});

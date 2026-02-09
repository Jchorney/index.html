"use strict";

/*
  Big Idea Creator
  - 4 visible selectors (no spinning)
  - Output reflects ONLY what is selected
  - Continuous sentence
*/

// REPLACE the placeholder arrays later with your finalized reel lists.
const REELS = [
  // Reel 1
  ["—"],
  // Reel 2
  ["—"],
  // Reel 3
  ["—"],
  // Reel 4
  ["—"]
];

const state = {
  idx: [0, 0, 0, 0]
};

function clampIndex(r) {
  const n = REELS[r].length;
  if (n <= 0) {
    state.idx[r] = 0;
    return;
  }
  state.idx[r] = ((state.idx[r] % n) + n) % n;
}

function current(r) {
  const arr = REELS[r];
  if (!arr || arr.length === 0) return "";
  return arr[state.idx[r]] || "";
}

function buildSentence() {
  return [0,1,2,3]
    .map(current)
    .map(s => (s || "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function render() {
  document.querySelectorAll(".reel").forEach(el => {
    const r = Number(el.dataset.reel);
    clampIndex(r);
    el.querySelector(".reelValue").textContent = current(r) || "—";
  });

  const out = buildSentence();
  document.getElementById("result").textContent = out || "—";
}

function step(r, dir) {
  state.idx[r] += dir;
  clampIndex(r);
  render();
}

function attachHandlers() {
  document.querySelectorAll(".reel").forEach(el => {
    const r = Number(el.dataset.reel);

    el.querySelectorAll(".navBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        step(r, Number(btn.dataset.dir));
      });
    });

    el.querySelector(".reelValue").addEventListener("click", () => {
      step(r, 1);
    });

    el.addEventListener("wheel", e => {
      e.preventDefault();
      step(r, e.deltaY > 0 ? 1 : -1);
    }, { passive: false });
  });

  document.getElementById("copyBtn").addEventListener("click", async () => {
    const text = document.getElementById("result").textContent || "";
    const status = document.getElementById("copyStatus");

    if (!text || text === "—") {
      status.textContent = "Nothing to copy.";
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied.";
      setTimeout(() => status.textContent = "", 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      status.textContent = "Copied.";
      setTimeout(() => status.textContent = "", 1200);
    }
  });
}

function init() {
  attachHandlers();
  render();
}

init();

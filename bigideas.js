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
  ["—","revealing",
  "exposing",
  "complicating",
  "challenging",
  "reinforcing",
  "undermining",
  "reframing",
  "interrogating",
  "emphasizing",
  "mirroring",
  "contrasting",
  "amplifying",
  "suppressing",
  "responding to",
  "responding with",
  "reacting to",
  "struggling with",
  "coping with",
  "conforming to",
  "rebelling against",
  "submitting to",
  "negotiating with",
  "navigating through",
  "choosing between",
  "sacrificing",
  "prioritizing"],
  // Reel 2
  ["—","identity",
  "power",
  "control",
  "freedom",
  "belonging",
  "responsibility",
  "morality",
  "justice",
  "authority",
  "independence",
  "conformity",
  "resistance",
  "empathy",
  "trust",
  "ambition",
  "fear",
  "change",
  "sacrifice",
  "fear of",
  "desire for",
  "pressure to",
  "responsibility for",
  "loyalty to",
  "dependence on",
  "belief in",
  "conflict between",
  "tension between"],
  // Reel 3
  ["—","suggests",
  "implies",
  "reveals",
  "demonstrates",
  "shows",
  "highlights",
  "emphasizes",
  "reinforces",
  "challenges",
  "complicates",
  "questions",
  "critiques",
  "exposes",
  "warns",
  "affirms",
  "undermines",
  "reframes",
  "destabilizes",
  "calls into question"],
  // Reel 4
  ["—","trust",
  "identity",
  "belonging",
  "power",
  "freedom",
  "responsibility",
  "morality",
  "empathy",
  "authority",
  "independence",
  "the cost of",
  "the consequences of",
  "the limits of",
  "the value of",
  "the importance of",
  "the complexity of",
  "the risks of",
  "the impact of",
  "the dangers of",
  "the tension between",
  "the balance between",
  "our understanding of",
  "assumptions about",
  "expectations surrounding"]
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

function resetAll() {
  state.idx = [0, 0, 0, 0];
  render();
}

function init() {
  attachHandlers();

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAll);
  }

  render();
}
}

init();

(() => {
  "use strict";
  const root = document.querySelector("[data-shared-bgm]");
  if (!root || window.sharedBgm) return;
  const tracks = {lofi:"study-lofi.mp3", classical:"classical-6.mp3"};
  const scriptUrl = document.currentScript.src;
  const key = "timePracticeBgm", volumeKey = "timePracticeBgmVolume";
  const audio = new Audio();
  audio.loop = true;
  audio.preload = "metadata";
  let selection = "off", playing = false;
  try {
    const saved = localStorage.getItem(key);
    if (tracks[saved]) selection = saved;
  } catch (_) {}
  let volume = selection === "classical" ? .5 : .18;
  try {
    const saved = localStorage.getItem(volumeKey);
    if (saved !== null && Number.isFinite(Number(saved))) volume = Math.max(0,Math.min(1,Number(saved)));
  } catch (_) {}
  audio.volume = volume;
  if (tracks[selection]) audio.src = new URL("audio/" + tracks[selection], scriptUrl).href;
  root.innerHTML = '<span class="music-label">🎵 Music</span><button type="button" class="music-btn" data-track="off">Off</button><button type="button" class="music-btn" data-track="lofi">Study Lofi</button><button type="button" class="music-btn" data-track="classical">Classical</button><button type="button" class="music-btn" data-action="pause">Pause</button><label class="music-volume">Volume <input type="range" min="0" max="100" step="1" aria-label="Music volume"></label>';
  const slider = root.querySelector("input");
  slider.value = String(Math.round(volume * 100));
  function update() {
    root.querySelectorAll("[data-track]").forEach(button => {
      const active = selection === button.dataset.track;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const pause = root.querySelector("[data-action=pause]");
    pause.textContent = playing ? "Pause" : "Play";
    pause.setAttribute("aria-label", playing ? "Pause music" : "Play selected music");
  }
  function save() {
    try { localStorage.setItem(key, selection); localStorage.setItem(volumeKey, String(volume)); } catch (_) {}
  }
  function play() {
    if (!tracks[selection]) selection = "lofi";
    const source = new URL("audio/" + tracks[selection], scriptUrl).href;
    if (audio.src !== source) { audio.pause(); audio.src = source; }
    audio.volume = volume;
    playing = true; save(); update();
    audio.play().catch(() => { playing = false; update(); });
  }
  root.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || !root.contains(button)) return;
    if (button.dataset.action === "pause") {
      if (playing) { audio.pause(); playing = false; update(); } else play();
      return;
    }
    selection = button.dataset.track;
    if (selection === "off") { audio.pause(); playing = false; save(); update(); return; }
    play();
  });
  slider.addEventListener("input", () => { volume = Number(slider.value) / 100; audio.volume = volume; save(); });
  window.sharedBgm = {pause() { audio.pause(); playing = false; update(); }};
  update();
})();

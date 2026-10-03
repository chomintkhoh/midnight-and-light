(() => {
  "use strict";
  const root = document.querySelector("[data-shared-bgm]");
  if (!root || window.sharedBgm) return;
  const tracks = {lofi:"study-lofi.mp3", classical:"classical-6.mp3"};
  const scriptUrl = document.currentScript.src;
  const key = "timePracticeBgm", volumeKey = "timePracticeBgmVolume";
  /* 换页不中断：离开页面时记下「正在播、播到第几秒」，下一页接着播 */
  const stateKey = "timePracticeBgmState";
  const audio = new Audio();
  audio.loop = true;
  audio.preload = "metadata";
  let selection = "off", playing = false, playRequest = 0;
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
    const request = ++playRequest;
    if (!tracks[selection]) selection = "lofi";
    const source = new URL("audio/" + tracks[selection], scriptUrl).href;
    if (audio.src !== source) { audio.pause(); audio.src = source; }
    audio.volume = volume;
    playing = true; save(); update();
    audio.play().catch(() => {
      if (request !== playRequest) return;
      playing = false; update();
    });
  }
  function pause() {
    ++playRequest;
    audio.pause(); playing = false; update(); keepState();
  }
  function keepState() {
    try { localStorage.setItem(stateKey, JSON.stringify({playing, track:selection, t:audio.currentTime || 0, at:Date.now()})); } catch (_) {}
  }
  addEventListener("pagehide", keepState);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") keepState(); });
  /* 上一页还在播 → 从同一个位置接着播（30 分钟内） */
  function resume() {
    let st = null;
    try { st = JSON.parse(localStorage.getItem(stateKey) || "null"); } catch (_) {}
    if (!st || !st.playing || !tracks[st.track] || Date.now() - st.at > 30 * 60 * 1000) return;
    selection = st.track;
    const source = new URL("audio/" + tracks[selection], scriptUrl).href;
    audio.src = source; audio.preload = "auto"; audio.volume = volume;
    const seek = () => { const d = audio.duration; if (d && isFinite(d)) audio.currentTime = (st.t + (Date.now() - st.at) / 1000) % d; };
    if (audio.readyState >= 1) seek(); else audio.addEventListener("loadedmetadata", seek, {once:true});
    const request = ++playRequest;
    playing = true; update();
    audio.play().catch(() => {
      if (request !== playRequest) return;
      /* 浏览器不让自动播放 → 学生一碰画面就接着播 */
      playing = false; update();
      const go = () => { if (!playing && selection !== "off" && request === playRequest) play(); };
      document.addEventListener("pointerdown", go, {once:true, capture:true});
      document.addEventListener("keydown", go, {once:true, capture:true});
    });
  }
  root.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || !root.contains(button)) return;
    if (button.dataset.action === "pause") {
      if (playing) pause(); else play();
      return;
    }
    selection = button.dataset.track;
    if (selection === "off") { pause(); save(); return; }
    play();
  });
  slider.addEventListener("input", () => { volume = Number(slider.value) / 100; audio.volume = volume; save(); });
  window.sharedBgm = {pause};
  update();
  resume();
})();

// Tiny synthesized sound effects (Web Audio, no files). Off until the visitor turns them on.
let ctx = null;
let enabled = false;

try {
  enabled = localStorage.getItem("sfx") === "on";
} catch {
  enabled = false;
}

const audio = () => {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

export const sfxEnabled = () => enabled;

export const setSfxEnabled = (on) => {
  enabled = on;
  try {
    localStorage.setItem("sfx", on ? "on" : "off");
  } catch {
    /* storage unavailable: keep the in-memory setting */
  }
  if (on) audio();
};

const tone = (freq, start, dur, { type = "sine", gain = 0.08, to } = {}) => {
  const a = audio();
  if (!a) return;
  const t0 = a.currentTime + start;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
};

const noise = (dur, { from = 400, to = 1800, gain = 0.05 } = {}) => {
  const a = audio();
  if (!a) return;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(from, a.currentTime);
  f.frequency.exponentialRampToValueAtTime(to, a.currentTime + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, a.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, a.currentTime + dur * 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start();
};

export const sfx = {
  /** soft airy swoosh: the guide moving */
  whoosh: () => enabled && noise(0.45, { from: 300, to: 1400, gain: 0.04 }),
  /** two-note chime: landing / greeting */
  chime: () => {
    if (!enabled) return;
    tone(660, 0, 0.5, { gain: 0.06 });
    tone(990, 0.09, 0.6, { gain: 0.05 });
  },
  /** quick bubbly pop: a message appears */
  pop: () => enabled && tone(520, 0, 0.12, { type: "triangle", gain: 0.07, to: 880 }),
};

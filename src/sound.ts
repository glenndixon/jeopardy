// Tiny UI sounds synthesized with the Web Audio API, so there are no audio
// files to load.

let context: AudioContext | undefined;

/** Created on first use, which is always a click, as browsers require. */
function getContext(): AudioContext {
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

interface Blip {
  frequency: number;
  type: OscillatorType;
  /** Seconds after now at which the blip starts. */
  delay?: number;
  duration: number;
  volume: number;
}

function blip({ frequency, type, delay = 0, duration, volume }: Blip) {
  const ctx = getContext();
  const start = ctx.currentTime + delay;
  const end = start + duration;

  const oscillator = ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;

  // Quick attack and exponential decay so the blip doesn't click.
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(end);
}

/** A soft, low tick for selecting a player. */
export function playSelectSound() {
  blip({ frequency: 440, type: "sine", duration: 0.07, volume: 0.12 });
}

/** A brighter two-note rising chime for awarding money. */
export function playAwardSound() {
  blip({ frequency: 880, type: "triangle", duration: 0.09, volume: 0.12 });
  blip({
    frequency: 1320,
    type: "triangle",
    delay: 0.06,
    duration: 0.14,
    volume: 0.12,
  });
}

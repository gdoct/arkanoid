/**
 * Analog synth-style sound effects using the Web Audio API.
 * All sounds are synthesized procedurally — no audio files needed.
 */

export class AudioEngine {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private osc(
    type: OscillatorType,
    freq: number,
    startTime: number,
    duration: number,
    gain: number,
    freqEnv?: { targetFreq: number; timeConstant: number },
    gainEnv?: { attack: number; decay: number },
  ): void {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    if (freqEnv) {
      osc.frequency.setTargetAtTime(freqEnv.targetFreq, startTime, freqEnv.timeConstant);
    }

    const attack = gainEnv?.attack ?? 0.002;
    const decay = gainEnv?.decay ?? duration;
    env.gain.setValueAtTime(0, startTime);
    env.gain.linearRampToValueAtTime(gain, startTime + attack);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);

    osc.connect(env);
    env.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + attack + decay + 0.01);
  }

  /** Ball hits a brick — short punchy blip */
  brickHit(): void {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    this.osc('square', 660, t, 0.06, 0.18, { targetFreq: 440, timeConstant: 0.03 });
    this.osc('sine', 330, t, 0.06, 0.08);
  }

  /** Ball hits the paddle — low thud with a slight pitch drop */
  paddleHit(): void {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    this.osc('sine', 280, t, 0.12, 0.25, { targetFreq: 140, timeConstant: 0.04 });
    this.osc('triangle', 560, t, 0.05, 0.10);
  }

  /** Ball bounces off a side wall — crisp tick */
  wallBounce(): void {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    this.osc('square', 900, t, 0.04, 0.10, { targetFreq: 700, timeConstant: 0.02 });
  }

  /** Extra ball spawns — ascending arpeggio */
  extraBall(): void {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const notes = [330, 440, 550, 660, 880];
    notes.forEach((freq, i) => {
      this.osc('sawtooth', freq, t + i * 0.055, 0.08, 0.14,
        { targetFreq: freq * 1.05, timeConstant: 0.04 });
    });
  }

  /** Ball leaves the playfield — descending sweep */
  ballLost(): void {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    this.osc('sine', 440, t, 0.30, 0.20, { targetFreq: 110, timeConstant: 0.12 });
    this.osc('triangle', 220, t, 0.30, 0.12, { targetFreq: 80, timeConstant: 0.15 });
  }

  /** All balls gone, lose a life — slow descending three-note phrase */
  turnOver(): void {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const phrase = [
      { freq: 440, start: 0.00 },
      { freq: 330, start: 0.18 },
      { freq: 220, start: 0.36 },
    ];
    for (const { freq, start } of phrase) {
      this.osc('sawtooth', freq, t + start, 0.14, 0.18,
        { targetFreq: freq * 0.85, timeConstant: 0.08 },
        { attack: 0.005, decay: 0.13 });
    }
  }
}

export const audioEngine = new AudioEngine();

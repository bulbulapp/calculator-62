/**
 * Web Audio API synthesizer for tactile calculator keypress feedback
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy initialize audio context on user action
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playClick(type: 'number' | 'operator' | 'action' | 'accent' | 'clear' = 'number') {
    if (!this.enabled) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      switch (type) {
        case 'number':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.start(now);
          osc.stop(now + 0.03);
          break;

        case 'operator':
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(450, now + 0.05);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;

        case 'accent': // Equals key
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.04); // E5
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
          break;

        case 'clear':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);
          gain.gain.setValueAtTime(0.09, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
          break;

        case 'action':
        default:
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
      }
    } catch {
      // Ignore audio context errors gracefully
    }
  }
}

export const soundFx = new SoundEffects();

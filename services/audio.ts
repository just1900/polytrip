import { ThemeType } from '../types';

class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  
  // BGM Sequencing
  private isPlayingBGM: boolean = false;
  private nextNoteTime: number = 0;
  private currentNoteIndex: number = 0;
  private timerID: any = null;
  private currentTheme: ThemeType = 'INTERSTELLAR';

  // --- Tunes ---

  // 1. Space: Slow, Ambient, Whole toneish
  private tuneInterstellar = [
    { f: 196.00, d: 2.0 }, { f: 220.00, d: 2.0 }, { f: 246.94, d: 2.0 }, { f: 293.66, d: 2.0 }, // G3, A3, B3, D4
    { f: 196.00, d: 2.0 }, { f: 293.66, d: 2.0 }, { f: 392.00, d: 4.0 }, // G3, D4, G4
    { f: 329.63, d: 1.0 }, { f: 293.66, d: 1.0 }, { f: 246.94, d: 1.0 }, { f: 220.00, d: 1.0 }, // E4 D4 B3 A3
  ];

  // 2. Cyberpunk: Fast arpeggios, Minor scale
  private tuneCyberpunk = [
    { f: 220.00, d: 0.25 }, { f: 261.63, d: 0.25 }, { f: 329.63, d: 0.25 }, { f: 440.00, d: 0.25 }, // Am Arp
    { f: 220.00, d: 0.25 }, { f: 261.63, d: 0.25 }, { f: 329.63, d: 0.25 }, { f: 440.00, d: 0.25 },
    { f: 196.00, d: 0.25 }, { f: 246.94, d: 0.25 }, { f: 293.66, d: 0.25 }, { f: 392.00, d: 0.25 }, // G Major Arp
    { f: 174.61, d: 0.25 }, { f: 220.00, d: 0.25 }, { f: 261.63, d: 0.25 }, { f: 349.23, d: 0.25 }, // F Major Arp
  ];

  // 3. Candy: Bouncy, Major, High pitch (Alphabet song / Twinkle style)
  private tuneCandy = [
    { f: 523.25, d: 0.5 }, { f: 523.25, d: 0.5 }, { f: 783.99, d: 0.5 }, { f: 783.99, d: 0.5 }, // C C G G
    { f: 880.00, d: 0.5 }, { f: 880.00, d: 0.5 }, { f: 783.99, d: 1.0 }, // A A G
    { f: 698.46, d: 0.5 }, { f: 698.46, d: 0.5 }, { f: 659.25, d: 0.5 }, { f: 659.25, d: 0.5 }, // F F E E
    { f: 587.33, d: 0.5 }, { f: 587.33, d: 0.5 }, { f: 523.25, d: 1.0 }, // D D C
  ];

  // 4. Ocean: Pentatonic, Flowing, Waltz time (3/4 feel)
  private tuneOcean = [
    { f: 261.63, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 392.00, d: 0.5 }, // C E G
    { f: 523.25, d: 1.5 }, // C5
    { f: 392.00, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 261.63, d: 0.5 }, // G E C
    { f: 196.00, d: 1.5 }, // G3
    { f: 220.00, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 329.63, d: 0.5 }, // A C E
    { f: 392.00, d: 1.5 }, // G
  ];

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
  }

  public startThemeBGM(theme: ThemeType) {
      this.currentTheme = theme;
      // Reset if already playing to switch track
      if (this.isPlayingBGM) {
          this.stopBGM();
      }
      this.playBGM();
  }

  public playBGM() {
    this.initCtx();
    if (this.isPlayingBGM) return;
    
    this.isPlayingBGM = true;
    this.currentNoteIndex = 0;
    this.nextNoteTime = this.ctx!.currentTime + 0.1;
    this.scheduler();
  }

  public stopBGM() {
    this.isPlayingBGM = false;
    if (this.timerID) clearTimeout(this.timerID);
  }

  private getCurrentTune() {
      switch (this.currentTheme) {
          case 'CYBERPUNK': return this.tuneCyberpunk;
          case 'CANDY': return this.tuneCandy;
          case 'OCEAN': return this.tuneOcean;
          case 'INTERSTELLAR':
          default: return this.tuneInterstellar;
      }
  }

  private scheduler() {
    if (!this.isPlayingBGM || !this.ctx) return;
    
    const tune = this.getCurrentTune();

    // Schedule ahead
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
        this.playNote(tune[this.currentNoteIndex]);
        this.advanceNote(tune);
    }
    this.timerID = setTimeout(() => this.scheduler(), 25);
  }

  private advanceNote(tune: any[]) {
      this.nextNoteTime += tune[this.currentNoteIndex].d * 0.6; // Speed mult
      this.currentNoteIndex++;
      if (this.currentNoteIndex >= tune.length) {
          this.currentNoteIndex = 0;
          this.nextNoteTime += 0.5; // Loop pause
      }
  }

  private playNote(note: {f: number, d: number}) {
      if (this.isMuted || !this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      const now = this.nextNoteTime;
      const duration = note.d * 0.6;

      // Theme Specific Sound Design
      if (this.currentTheme === 'CYBERPUNK') {
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (this.currentTheme === 'CANDY') {
          osc.type = 'triangle'; // Flute-like
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
          gain.gain.linearRampToValueAtTime(0, now + duration);
      } else if (this.currentTheme === 'OCEAN') {
          osc.type = 'sine';
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.2, now + duration / 2);
          gain.gain.linearRampToValueAtTime(0, now + duration);
      } else {
          // Space
          osc.type = 'sine';
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
          gain.gain.linearRampToValueAtTime(0, now + duration);
      }
      
      osc.frequency.value = note.f;
      
      osc.start(now);
      osc.stop(now + duration);
  }

  public playSFX(type: 'roll' | 'step' | 'boost' | 'penalty' | 'freeze' | 'win' | 'plane') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;

    switch (type) {
      case 'roll':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case 'step':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'boost':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'penalty':
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case 'freeze':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.3, now);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'plane':
        const osc2 = this.ctx.createOscillator();
        osc2.connect(gain);
        osc.type = 'sawtooth';
        osc2.type = 'square';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 2.5);
        osc2.frequency.setValueAtTime(60, now);
        osc2.frequency.exponentialRampToValueAtTime(300, now + 2.5);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.5); 
        gain.gain.setValueAtTime(0.3, now + 2.0);
        gain.gain.linearRampToValueAtTime(0, now + 3.0); 
        osc.start(now);
        osc.stop(now + 3.0);
        osc2.start(now);
        osc2.stop(now + 3.0);
        break;
      case 'win':
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
             const o = this.ctx!.createOscillator();
             const g = this.ctx!.createGain();
             o.connect(g);
             g.connect(this.ctx!.destination);
             o.frequency.value = f;
             o.start(now + i * 0.1);
             g.gain.setValueAtTime(0.2, now + i * 0.1);
             g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
             o.stop(now + i * 0.1 + 0.5);
        });
        break;
    }
  }
}

export const audioManager = new AudioService();
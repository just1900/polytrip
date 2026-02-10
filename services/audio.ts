class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  
  // BGM Sequencing
  private isPlayingBGM: boolean = false;
  private nextNoteTime: number = 0;
  private currentNoteIndex: number = 0;
  private timerID: any = null;

  // "Merrily We Roll Along" (Mary Had a Little Lamb)
  // E D C D E E E, D D D, E G G ...
  // Freqs: C4=261.63, D4=293.66, E4=329.63, G4=392.00
  private tune = [
    { f: 329.63, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.4 }, // Ma-ry had a
    { f: 329.63, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 329.63, d: 0.8 }, // lit-tle lamb
    { f: 293.66, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 293.66, d: 0.8 }, // lit-tle lamb
    { f: 329.63, d: 0.4 }, { f: 392.00, d: 0.4 }, { f: 392.00, d: 0.8 }, // lit-tle lamb
    // Repeat with ending
    { f: 329.63, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.4 },
    { f: 329.63, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 329.63, d: 0.4 },
    { f: 293.66, d: 0.4 }, { f: 293.66, d: 0.4 }, { f: 329.63, d: 0.4 }, { f: 293.66, d: 0.4 },
    { f: 261.63, d: 1.2 }
  ];

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    // Immediate silence handled by playNote checks or gain updates if we tracked active nodes
    // For simplicity in this loop, the next note will just be silenced or 0 volume
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

  private scheduler() {
    if (!this.isPlayingBGM || !this.ctx) return;
    
    // Schedule ahead
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
        this.playNote(this.tune[this.currentNoteIndex]);
        this.advanceNote();
    }
    this.timerID = setTimeout(() => this.scheduler(), 25);
  }

  private advanceNote() {
      this.nextNoteTime += this.tune[this.currentNoteIndex].d;
      this.currentNoteIndex++;
      if (this.currentNoteIndex === this.tune.length) {
          this.currentNoteIndex = 0;
          this.nextNoteTime += 0.5; // Small pause between loops
      }
  }

  private playNote(note: {f: number, d: number}) {
      if (this.isMuted || !this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = note.f;
      
      // Envelope
      const now = this.nextNoteTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain.gain.setValueAtTime(0.1, now + note.d - 0.05);
      gain.gain.linearRampToValueAtTime(0, now + note.d);
      
      osc.start(now);
      osc.stop(now + note.d);
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
        // Jet engine swoosh using Lowpass Noise simulation via multiple oscillators
        // Since we can't easily create Noise buffer in this simple class without loading,
        // we simulate it with chaotic oscillators
        const osc2 = this.ctx.createOscillator();
        osc2.connect(gain);
        
        osc.type = 'sawtooth';
        osc2.type = 'square';
        
        // Low rumble rising in pitch
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 2.5);
        
        osc2.frequency.setValueAtTime(60, now);
        osc2.frequency.exponentialRampToValueAtTime(300, now + 2.5);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.5); // Fade in
        gain.gain.setValueAtTime(0.3, now + 2.0);
        gain.gain.linearRampToValueAtTime(0, now + 3.0); // Fade out

        osc.start(now);
        osc.stop(now + 3.0);
        osc2.start(now);
        osc2.stop(now + 3.0);
        break;
      case 'win':
        // Arpeggio
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
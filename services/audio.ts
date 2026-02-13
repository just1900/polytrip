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

  // 5. Arctic: High pitch, crystal-like, slow intervals
  private tuneArctic = [
    { f: 523.25, d: 0.5 }, { f: 0, d: 0.5 }, { f: 783.99, d: 0.5 }, { f: 0, d: 0.5 }, // C5 pause G5 pause
    { f: 1046.50, d: 1.0 }, { f: 0, d: 0.5 }, // C6
    { f: 783.99, d: 0.5 }, { f: 659.25, d: 0.5 }, { f: 587.33, d: 1.0 }, // G5 E5 D5
    { f: 0, d: 1.0 },
    { f: 587.33, d: 0.5 }, { f: 659.25, d: 0.5 }, { f: 783.99, d: 1.0 }, // D5 E5 G5
  ];

  // 6. Jungle: Rhythmic, lower percussion simulation (using low freqs), tribal feel
  private tuneJungle = [
    { f: 110.00, d: 0.25 }, { f: 110.00, d: 0.25 }, { f: 164.81, d: 0.5 }, // A2 A2 E3
    { f: 110.00, d: 0.5 }, { f: 196.00, d: 0.5 }, // A2 G3
    { f: 110.00, d: 0.25 }, { f: 110.00, d: 0.25 }, { f: 164.81, d: 0.5 }, 
    { f: 220.00, d: 0.5 }, { f: 196.00, d: 0.5 }, // A3 G3
  ];

  // 7. Soccer: Fanfare, Energetic, Major arpeggios (Trumpet style)
  private tuneSoccer = [
    { f: 392.00, d: 0.33 }, { f: 523.25, d: 0.33 }, { f: 659.25, d: 0.33 }, // G C E (Triplet)
    { f: 783.99, d: 1.0 }, // G5
    { f: 659.25, d: 0.5 }, { f: 783.99, d: 0.5 }, // E G
    { f: 1046.50, d: 1.5 }, // C6
    { f: 783.99, d: 0.5 }, // G
    { f: 523.25, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 261.63, d: 1.0 }, // C G C
  ];

  // 8. Magma: Heavy, low, intense intervals
  private tuneMagma = [
    { f: 110.00, d: 1.0 }, { f: 103.83, d: 0.5 }, { f: 110.00, d: 0.5 }, // A2 G#2 A2
    { f: 130.81, d: 1.0 }, { f: 110.00, d: 1.0 }, // C3 A2
    { f: 82.41, d: 2.0 }, // E2
    { f: 110.00, d: 0.5 }, { f: 123.47, d: 0.5 }, { f: 130.81, d: 0.5 }, { f: 146.83, d: 0.5 },
  ];

  // 9. Ancient: Pentatonic Chinese-style scale
  private tuneAncient = [
    { f: 329.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 440.00, d: 1.0 }, // E G A
    { f: 587.33, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 392.00, d: 1.0 }, // D A G
    { f: 329.63, d: 0.5 }, { f: 293.66, d: 0.5 }, { f: 329.63, d: 1.0 }, // E D E
    { f: 196.00, d: 2.0 }, // G3
  ];

  // 10. Desert: Blues/Rock style riff
  private tuneDesert = [
    { f: 146.83, d: 0.5 }, { f: 164.81, d: 0.5 }, { f: 196.00, d: 0.5 }, // D E G
    { f: 220.00, d: 0.25 }, { f: 196.00, d: 0.25 }, { f: 185.00, d: 0.25 }, { f: 174.61, d: 0.25 }, // Chromatic slide
    { f: 146.83, d: 1.0 }, // D
    { f: 0, d: 0.5 },
    { f: 146.83, d: 0.25 }, { f: 146.83, d: 0.25 }, { f: 293.66, d: 1.0 }, // Octave jump
  ];

  // 11. Heaven: High, pure sine waves, ethereal
  private tuneHeaven = [
    { f: 523.25, d: 1.0 }, { f: 659.25, d: 1.0 }, { f: 783.99, d: 1.0 }, { f: 1046.50, d: 1.0 }, // C E G C
    { f: 880.00, d: 1.0 }, { f: 783.99, d: 1.0 }, 
    { f: 698.46, d: 1.0 }, { f: 659.25, d: 1.0 }, 
  ];

  // 12. Park: Light Jazz/Swing
  private tunePark = [
    { f: 261.63, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 440.00, d: 0.5 }, // Walk up
    { f: 392.00, d: 0.25 }, { f: 440.00, d: 0.25 }, { f: 392.00, d: 0.5 },
    { f: 293.66, d: 0.5 }, { f: 349.23, d: 0.5 }, 
    { f: 261.63, d: 1.0 },
  ];

  // 13. Garden: Playful, Staccato, Woodwind-ish
  private tuneGarden = [
    { f: 392.00, d: 0.25 }, { f: 0, d: 0.25 }, { f: 329.63, d: 0.25 }, { f: 0, d: 0.25 }, // G E
    { f: 261.63, d: 0.25 }, { f: 0, d: 0.25 }, { f: 329.63, d: 0.25 }, { f: 0, d: 0.25 }, // C E
    { f: 392.00, d: 0.25 }, { f: 329.63, d: 0.25 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 0.25 }, // G E G A
    { f: 392.00, d: 0.5 }, { f: 329.63, d: 0.5 }, // G E
  ];

  // 14. Kindergarten: Nursery Rhyme (Twinkle Twinkle / ABC style)
  private tuneKindergarten = [
    { f: 261.63, d: 0.5 }, { f: 261.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 392.00, d: 0.5 }, // C C G G
    { f: 440.00, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 392.00, d: 1.0 }, // A A G
    { f: 349.23, d: 0.5 }, { f: 349.23, d: 0.5 }, { f: 329.63, d: 0.5 }, { f: 329.63, d: 0.5 }, // F F E E
    { f: 293.66, d: 0.5 }, { f: 293.66, d: 0.5 }, { f: 261.63, d: 1.0 }, // D D C
  ];

  // 15. Kitchen: Bossa Nova style (Major 7ths), Relaxed but bouncy
  // Dmaj7: D(293) F#(370) A(440) C#(554)
  // Gmaj7: G(392) B(493) D(587) F#(740)
  private tuneKitchen = [
    { f: 293.66, d: 0.5 }, { f: 440.00, d: 0.5 }, { f: 554.37, d: 0.5 }, { f: 370.00, d: 0.5 }, // Dmaj7 arp
    { f: 392.00, d: 0.5 }, { f: 493.88, d: 0.5 }, { f: 587.33, d: 0.5 }, { f: 739.99, d: 0.5 }, // Gmaj7 arp
    { f: 554.37, d: 0.25 }, { f: 440.00, d: 0.25 }, { f: 370.00, d: 0.5 }, // C# A F#
    { f: 293.66, d: 1.5 }, // D
  ];

  // 16. Balcony: Lazy Lofi Guitar, slow, repetitive, warm
  // Cmaj9: C E G B D
  // Fmaj7: F A C E
  private tuneBalcony = [
    { f: 261.63, d: 1.0 }, { f: 329.63, d: 0.5 }, { f: 493.88, d: 0.5 }, { f: 587.33, d: 2.0 }, // C E B D
    { f: 349.23, d: 1.0 }, { f: 440.00, d: 0.5 }, { f: 523.25, d: 0.5 }, { f: 659.25, d: 2.0 }, // F A C E
    { f: 329.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 329.63, d: 1.0 }, // E G E
  ];

  // 17. Amusement Park: Electro Swing / Upbeat Carnival
  // Swing rhythm (Long Short), Pentatonic + Chromatic
  // C Major: C D E G A
  private tuneAmusement = [
    { f: 523.25, d: 0.6 }, { f: 392.00, d: 0.2 }, { f: 329.63, d: 0.6 }, { f: 392.00, d: 0.2 }, // C G E G (Swing)
    { f: 440.00, d: 0.6 }, { f: 392.00, d: 0.2 }, { f: 329.63, d: 0.4 }, { f: 293.66, d: 0.4 }, // A G E D
    { f: 261.63, d: 0.6 }, { f: 293.66, d: 0.2 }, { f: 329.63, d: 0.6 }, { f: 392.00, d: 0.2 }, // C D E G
    { f: 523.25, d: 0.4 }, { f: 587.33, d: 0.4 }, { f: 659.25, d: 0.4 }, { f: 783.99, d: 0.4 }, // C D E G (Run up)
  ];

  // 18. Family: Soft, Lullaby-like, Acoustic Guitar/Piano feel
  // C Major simple melody
  private tuneFamily = [
    { f: 261.63, d: 1.0 }, { f: 329.63, d: 1.0 }, { f: 392.00, d: 1.0 }, { f: 523.25, d: 2.0 }, // C E G C
    { f: 440.00, d: 1.0 }, { f: 392.00, d: 1.0 }, { f: 329.63, d: 1.0 }, { f: 293.66, d: 1.0 }, // A G E D
    { f: 261.63, d: 2.0 }, { f: 0, d: 0.5 },
    { f: 329.63, d: 0.5 }, { f: 392.00, d: 0.5 }, { f: 261.63, d: 1.0 }, // E G C
  ];

  // 19. Market: Busy, Fast, Staccato (Accordion/Polka feel)
  private tuneMarket = [
    { f: 392.00, d: 0.25 }, { f: 523.25, d: 0.25 }, { f: 659.25, d: 0.25 }, { f: 783.99, d: 0.25 }, // G C E G
    { f: 392.00, d: 0.5 }, { f: 392.00, d: 0.5 }, // G G
    { f: 349.23, d: 0.25 }, { f: 440.00, d: 0.25 }, { f: 587.33, d: 0.25 }, { f: 698.46, d: 0.25 }, // F A D F
    { f: 349.23, d: 0.5 }, { f: 349.23, d: 0.5 }, // F F
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
          case 'ARCTIC': return this.tuneArctic;
          case 'JUNGLE': return this.tuneJungle;
          case 'SOCCER': return this.tuneSoccer;
          case 'MAGMA': return this.tuneMagma;
          case 'ANCIENT': return this.tuneAncient;
          case 'DESERT': return this.tuneDesert;
          case 'HEAVEN': return this.tuneHeaven;
          case 'PARK': return this.tunePark;
          case 'GARDEN': return this.tuneGarden;
          case 'KINDERGARTEN': return this.tuneKindergarten;
          case 'KITCHEN': return this.tuneKitchen;
          case 'BALCONY': return this.tuneBalcony;
          case 'AMUSEMENT_PARK': return this.tuneAmusement;
          case 'FAMILY': return this.tuneFamily;
          case 'MARKET': return this.tuneMarket;
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
      } else if (this.currentTheme === 'ARCTIC') {
          osc.type = 'sine'; // Pure tone
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.05); // Quick attack
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Bell-like decay
      } else if (this.currentTheme === 'JUNGLE') {
          osc.type = 'square'; // Wood-like / drum-like
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15); // Short percussive hits
      } else if (this.currentTheme === 'SOCCER') {
          osc.type = 'sawtooth'; // Brass-like
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
          gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.8);
          gain.gain.linearRampToValueAtTime(0, now + duration);
      } else if (this.currentTheme === 'MAGMA') {
          osc.type = 'sawtooth'; // Heavy
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0.05, now + duration);
          // Low pass filter simulation via gain drop
      } else if (this.currentTheme === 'ANCIENT') {
          osc.type = 'triangle'; // Plucked string
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (this.currentTheme === 'DESERT') {
          osc.type = 'square'; // Distorted guitar-ish
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0, now + duration);
      } else if (this.currentTheme === 'HEAVEN') {
          osc.type = 'sine'; // Organ/Harp
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + duration * 0.5);
          gain.gain.linearRampToValueAtTime(0, now + duration);
      } else if (this.currentTheme === 'PARK') {
          osc.type = 'triangle'; // Piano-ish
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (this.currentTheme === 'GARDEN') {
          osc.type = 'square'; // Low fi 8bit style
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1); 
      } else if (this.currentTheme === 'KINDERGARTEN') {
          osc.type = 'triangle'; // Xylophone
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.01); 
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (this.currentTheme === 'KITCHEN') {
          osc.type = 'triangle'; // Electric Piano (Rhodes-ish)
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.02); // Soft attack
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Warm decay
      } else if (this.currentTheme === 'BALCONY') {
          osc.type = 'triangle'; // Acoustic Guitar pluck
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.01); // Sharp attack
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration); // Pluck decay
      } else if (this.currentTheme === 'AMUSEMENT_PARK') {
          osc.type = 'sawtooth'; // Brass / Synth Lead
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.05); // Punchy attack
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration); 
      } else if (this.currentTheme === 'FAMILY') {
          osc.type = 'triangle'; // Very soft acoustic
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      } else if (this.currentTheme === 'MARKET') {
          osc.type = 'square'; // Accordion-ish
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
          gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.8);
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

  public playSFX(type: 'roll' | 'step' | 'boost' | 'penalty' | 'freeze' | 'win') {
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
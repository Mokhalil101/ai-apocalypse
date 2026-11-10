// AI APOCALYPSE — Procedural Web Audio API Synthesizer & Soundtrack
// 100% Self-Contained, Zero External MP3 Dependencies, GitHub Pages Ready
// Powered by GDG Assiut

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;

    this.masterVolume = 0.8;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.5;

    this.isMuted = false;
    this.isPlayingMusic = false;
    this.musicOscillators = [];
    this.musicInterval = null;
    this.currentTrack = "ambient"; // 'ambient' or 'boss'
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.setVolumes(this.masterVolume, this.sfxVolume, this.musicVolume);

      // Start atmospheric background music loop
      this.startAmbientMusic();
    } catch (e) {
      console.warn("[AudioSystem] Web Audio API not supported:", e);
    }
  }

  unlockAudio() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setVolumes(master, sfx, music) {
    this.masterVolume = master;
    this.sfxVolume = sfx;
    this.musicVolume = music;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  playSfx(type) {
    if (!this.ctx || this.isMuted) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const t = this.ctx.currentTime;

    switch (type) {
      case "laser_blaster": {
        // Futuristic blue blaster: fast pitch drop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
      }

      case "laser_pulse": {
        // Snappy rapid pulse rifle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.08);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.09);
        break;
      }

      case "laser_enemy": {
        // Red enemy laser
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(540, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.18);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.19);
        break;
      }

      case "laser_heavy": {
        // Heavy Plasma Mortar
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.35);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.36);
        break;
      }

      case "emp": {
        // EMP shockwave resonance
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(450, t + 0.1);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.5);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.52);
        break;
      }

      case "shock": {
        // Arc shock crackle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.setValueAtTime(280, t + 0.05);
        osc.frequency.setValueAtTime(90, t + 0.12);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.23);
        break;
      }

      case "pickup": {
        // High harmonic pentatonic chime (C-E-G)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + idx * 0.05);
          gain.gain.setValueAtTime(0.2, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.05 + 0.2);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + idx * 0.05);
          osc.stop(t + idx * 0.05 + 0.22);
        });
        break;
      }

      case "heal": {
        // Gentle ascending chord
        const notes = [440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);
          gain.gain.setValueAtTime(0.25, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 0.37);
        });
        break;
      }

      case "charge": {
        // Charging plasma hum
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(660, t + 0.3);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.36);
        break;
      }

      case "alert": {
        // Red alert alternating siren
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(587, t + 0.15);
        osc.frequency.setValueAtTime(880, t + 0.3);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.46);
        break;
      }

      case "explosion": {
        // Noise buffer explosion simulation
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, t);
        filter.frequency.exponentialRampToValueAtTime(50, t + 0.4);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        break;
      }

      case "boss_explode": {
        // Massive rumble explosion
        const bufferSize = this.ctx.sampleRate * 0.8;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.exponentialRampToValueAtTime(30, t + 0.8);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.55, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        noise.start(t);
        break;
      }

      case "terminal_open": {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(880, t + 0.06);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
      }

      case "terminal_key": {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(1400, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.03);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
        break;
      }

      case "success": {
        // High ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t + idx * 0.07);
          gain.gain.setValueAtTime(0.25, t + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.07 + 0.3);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + idx * 0.07);
          osc.stop(t + idx * 0.07 + 0.32);
        });
        break;
      }

      case "fail": {
        // Descending low buzzer
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.setValueAtTime(160, t + 0.12);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.32);
        break;
      }

      case "fanfare": {
        // Majestic victory sequence
        const chords = [
          { f: 523.25, tOff: 0.0 },
          { f: 659.25, tOff: 0.1 },
          { f: 783.99, tOff: 0.2 },
          { f: 1046.50, tOff: 0.35 }
        ];
        chords.forEach(c => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(c.f, t + c.tOff);
          gain.gain.setValueAtTime(0.28, t + c.tOff);
          gain.gain.exponentialRampToValueAtTime(0.01, t + c.tOff + 0.6);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + c.tOff);
          osc.stop(t + c.tOff + 0.65);
        });
        break;
      }

      case "comms": {
        // Sci-fi radio chirp
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(950, t);
        osc.frequency.setValueAtTime(1450, t + 0.05);
        osc.frequency.setValueAtTime(1150, t + 0.1);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
      }
    }
  }

  startAmbientMusic() {
    if (!this.ctx || this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    // Periodic slow atmospheric synthesizer pattern
    const scale = [110, 130.81, 146.83, 164.81, 196.00]; // Dark minor pentatonic A2
    let step = 0;

    this.musicInterval = setInterval(() => {
      if (!this.ctx || this.isMuted || this.musicVolume <= 0) return;
      if (this.ctx.state === "suspended") return;

      const t = this.ctx.currentTime;
      const freq = scale[step % scale.length];
      step++;

      // Deep drone oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, t);
      filter.frequency.linearRampToValueAtTime(600, t + 1.5);
      filter.frequency.linearRampToValueAtTime(280, t + 3.0);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + 3.3);
    }, 2800);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isPlayingMusic = false;
  }
}

// Global instance
const AudioManager = new AudioSystem();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AudioSystem, AudioManager };
}
if (typeof window !== 'undefined') {
  window.AudioSystem = AudioSystem;
  window.AudioManager = AudioManager;
}

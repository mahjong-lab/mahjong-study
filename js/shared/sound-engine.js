/**
 * iOSマナーモード（消音モード🔕）＆アプリ内ブラウザ対応・共通サウンド＆発声エンジン
 * (js/shared/sound-engine.js)
 * 1) navigator.audioSession.type = 'playback' でiOS Safariの消音スイッチ制限を解除
 * 2) メモリ内16bit PCM WAV生成＋<audio playsinline>再生により全iOS環境で確実に打牌・和音再生
 * 3) WebKit特有の speechSynthesis.cancel() 直後無音バグを回避して「ポン・チー・カン・ツモ・ロン」発声
 */
const MahjongSound = {
  enabled: true,
  ctx: null,
  jaVoice: null,
  wavUrls: {},
  unlocked: false,

  ensurePlaybackSession() {
    try {
      if (typeof navigator !== 'undefined' && navigator.audioSession) {
        navigator.audioSession.type = 'playback';
      }
    } catch (e) {}
  },

  init() {
    this.ensurePlaybackSession();
    if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    this.loadVoice();
    this.prepareWavs();
  },

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.init();
    if (this.wavUrls.silent && typeof Audio !== 'undefined') {
      try {
        const a = new Audio(this.wavUrls.silent);
        a.setAttribute('playsinline', '');
        a.volume = 0.01;
        const p = a.play();
        if (p && p.catch) p.catch(() => {});
      } catch (e) {}
    }
  },

  loadVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        this.jaVoice =
          voices.find(v => v.lang === 'ja-JP' && /Kyoko|Otoya|Siri|Google|Haruka|Ichiro/i.test(v.name)) ||
          voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ja')) ||
          null;
      }
    } catch (e) {}
  },

  makeWavUri(durationSec, sampleFn) {
    const sr = 22050;
    const n = Math.max(1, Math.floor(sr * durationSec));
    const buf = new ArrayBuffer(44 + n * 2);
    const view = new DataView(buf);
    const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + n * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sr, true);
    view.setUint32(28, sr * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, n * 2, true);

    for (let i = 0; i < n; i++) {
      const t = i / sr;
      let v = sampleFn(t, i);
      if (v > 1) v = 1;
      else if (v < -1) v = -1;
      view.setInt16(44 + i * 2, Math.floor(v * 32767), true);
    }

    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
      return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    }
    return '';
  },

  hitSample(dt, power) {
    if (dt < 0 || dt > 0.08) return 0;
    const n = Math.sin(dt * 43758.5453 + Math.sin(dt * 18231.7) * 3.1);
    const click = n * Math.exp(-dt * 105) * 0.65 * power;
    const freq = 720 * Math.exp(-dt * 34) + 155;
    const body = Math.sin(2 * Math.PI * freq * dt) * Math.exp(-dt * 58) * 0.65 * power;
    return click + body;
  },

  noteSample(dt, freq, dur, amp) {
    if (dt < 0 || dt > dur) return 0;
    const env = Math.min(1, dt * 120) * Math.exp(-dt * (4.8 / dur));
    return (Math.sin(2 * Math.PI * freq * dt) * 0.75 + Math.sin(4 * Math.PI * freq * dt) * 0.25) * env * amp;
  },

  prepareWavs() {
    if (this.wavUrls.ready) return;
    this.wavUrls.ready = true;
    try {
      this.wavUrls.silent = this.makeWavUri(0.02, () => 0);
      this.wavUrls.clack = this.makeWavUri(0.09, (t) => this.hitSample(t, 0.9));
      this.wavUrls.pon = this.makeWavUri(0.42, (t) =>
        this.hitSample(t, 1.05) +
        this.hitSample(t - 0.055, 0.9) +
        this.noteSample(t - 0.04, 587.33, 0.28, 0.34) +
        this.noteSample(t - 0.10, 783.99, 0.30, 0.36)
      );
      this.wavUrls.chi = this.makeWavUri(0.45, (t) =>
        this.hitSample(t, 0.85) +
        this.hitSample(t - 0.065, 1.0) +
        this.noteSample(t - 0.04, 523.25, 0.24, 0.30) +
        this.noteSample(t - 0.10, 659.25, 0.24, 0.30) +
        this.noteSample(t - 0.16, 783.99, 0.28, 0.34)
      );
      this.wavUrls.kan = this.makeWavUri(0.50, (t) =>
        this.hitSample(t, 1.15) +
        this.hitSample(t - 0.05, 1.0) +
        this.hitSample(t - 0.10, 1.15) +
        this.noteSample(t - 0.05, 392.00, 0.32, 0.32) +
        this.noteSample(t - 0.11, 587.33, 0.32, 0.32) +
        this.noteSample(t - 0.17, 783.99, 0.32, 0.36)
      );
      this.wavUrls.tsumo = this.makeWavUri(0.55, (t) =>
        this.hitSample(t, 1.15) +
        this.noteSample(t - 0.03, 523.25, 0.25, 0.30) +
        this.noteSample(t - 0.09, 659.25, 0.25, 0.30) +
        this.noteSample(t - 0.15, 783.99, 0.25, 0.32) +
        this.noteSample(t - 0.21, 1046.50, 0.32, 0.36)
      );
      this.wavUrls.ron = this.makeWavUri(0.55, (t) =>
        this.hitSample(t, 1.2) +
        this.hitSample(t - 0.045, 0.85) +
        this.noteSample(t - 0.03, 440.00, 0.28, 0.32) +
        this.noteSample(t - 0.09, 554.37, 0.28, 0.32) +
        this.noteSample(t - 0.15, 659.25, 0.28, 0.32) +
        this.noteSample(t - 0.21, 880.00, 0.33, 0.38)
      );
      this.wavUrls.wrong = this.makeWavUri(0.28, (t) =>
        this.hitSample(t, 0.55) +
        this.noteSample(t - 0.02, 210, 0.22, 0.28) +
        this.noteSample(t - 0.09, 155, 0.18, 0.25)
      );
    } catch (e) {}
  },

  playWavKey(key) {
    if (!this.enabled) return;
    this.init();
    const url = this.wavUrls[key];
    if (url && typeof Audio !== 'undefined') {
      try {
        const a = new Audio(url);
        a.setAttribute('playsinline', '');
        a.volume = 0.95;
        const p = a.play();
        if (p && p.catch) p.catch(() => this.fallbackWebAudio(key));
        return;
      } catch (e) {}
    }
    this.fallbackWebAudio(key);
  },

  fallbackWebAudio(key) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(key === 'wrong' ? 200 : 580, now);
      osc.frequency.exponentialRampToValueAtTime(key === 'wrong' ? 140 : 220, now + 0.09);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  },

  clack() { this.playWavKey('clack'); },
  playTile() { this.playWavKey('clack'); },
  softBuzz() { this.playWavKey('wrong'); },
  playWrong() { this.playWavKey('wrong'); },

  getCallLabel(type) {
    const labels = { pon: 'ポン！', chi: 'チー！', kan: 'カン！', tsumo: 'ツモ！', ron: 'ロン！' };
    return labels[type] || 'ロン！';
  },

  resolveQuestionCall(q) {
    if (!q) return 'ron';
    if (q.callSound) return q.callSound;
    if (q.isNakiCheck) {
      const okOpt = (q.options || []).find(o => o.correct);
      if (okOpt && okOpt.text.includes('鳴いちゃダメ')) return 'tsumo';
      return (q.question && q.question.includes('チー')) ? 'chi' : 'pon';
    }
    if (q.isRon === false) return 'tsumo';
    return 'ron';
  },

  playCall(type = 'ron') {
    if (!this.enabled) return;
    this.init();
    const valid = ['pon', 'chi', 'kan', 'tsumo', 'ron'].includes(type) ? type : 'ron';

    this.playWavKey(valid);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const synth = window.speechSynthesis;
        if (synth.paused) synth.resume();
        if (!this.jaVoice) this.loadVoice();
        const callMap = {
          pon:   { text: 'ポン', rate: 1.25, pitch: 1.12 },
          chi:   { text: 'チー', rate: 1.22, pitch: 1.15 },
          kan:   { text: 'カン', rate: 1.22, pitch: 1.02 },
          tsumo: { text: 'ツモ', rate: 1.20, pitch: 1.12 },
          ron:   { text: 'ロン', rate: 1.18, pitch: 1.08 }
        };
        const cfg = callMap[valid];
        const utter = new SpeechSynthesisUtterance(cfg.text);
        utter.lang = 'ja-JP';
        if (this.jaVoice) utter.voice = this.jaVoice;
        utter.rate = cfg.rate;
        utter.pitch = cfg.pitch;
        utter.volume = 1.0;
        synth.speak(utter);
      } catch (e) {}
    }
  },

  playCorrect(q) {
    this.playCall(this.resolveQuestionCall(q));
  },

  toggle(btnId = 'soundToggleBtn') {
    this.enabled = !this.enabled;
    if (!this.enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    } else if (this.enabled) {
      this.playCall('pon');
    }
    const btn = typeof document !== 'undefined' ? document.getElementById(btnId) : null;
    if (btn) {
      btn.innerHTML = this.enabled
        ? '<i data-lucide="volume-2" class="w-5 h-5"></i>'
        : '<i data-lucide="volume-x" class="w-5 h-5 text-rose-300"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
};

const Sound = MahjongSound;
const SoundManager = MahjongSound;

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => MahjongSound.loadVoice();
  }
  document.addEventListener('pointerdown', () => MahjongSound.unlock(), { once: true, passive: true });
  document.addEventListener('touchstart', () => MahjongSound.unlock(), { once: true, passive: true });
}

/**
 * 麻雀サウンド＆音声モジュール (js/shared/sound-engine.js)
 * ※ 音声・効果音は完全無音（不要）に設定。
 * ※ 既存アプリコードおよびテスト互換性（APIシグネチャ）を保持しつつ、一切の音声出力を安全に停止。
 */
const MahjongSound = {
  enabled: false,
  ctx: null,
  audioBuffers: {},
  wavUrls: {},
  jaVoice: null,
  unlocked: false,

  ensurePlaybackSession() {},
  getAudioContext() { return null; },
  loadVoice() {},
  unlock() {},
  init() {},

  makeWavUri() { return ''; },
  playKey() {},
  fallbackOscillator() {},

  clack() {},
  playTile() {},
  softBuzz() {},
  playWrong() {},

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

  playCall() {},
  playCorrect() {},
  toggle() {}
};

const Sound = MahjongSound;
const SoundManager = MahjongSound;

/**
 * 実戦編『麻雀トレーニングボード』メインコントローラー (js/main-app.js)
 * 依存: tile-renderer.js, sound-engine.js, term-dict.js, data/main-questions.js
 */
const PRAISE_CORRECT = [
  'お見事！センス抜群です！👏',
  '完璧！すばらしい判断！✨',
  'さすが！もう見抜けてますね！🎉',
  'その調子！感覚掴めてます！🥰',
  '大正解！実戦でもバッチリ！🀄',
  'ナイス！すごく筋がいいです！💖',
  'すごい！迷わず選べてますね！💫',
  '大正解！バッチリです！🌟'
];

const PRAISE_WRONG = [
  'おしい！ここだけ押さえれば完璧です！🌱',
  '大丈夫！みんな最初につまずくポイントです💡',
  'ドンマイ！一度知ればもう次は間違えませんよ✨',
  '惜しい！次は絶対に見抜けます！😊'
];

function getPraiseTitle(isCorrect, streak = 0) {
  if (isCorrect) {
    if (streak >= 5) return `怒涛の${streak}問連続正解！天才かも！？👑✨`;
    if (streak === 4) return '4連続正解！完全にマスターしてます！🔥';
    if (streak === 3) return '3連勝！波に乗ってきましたね！🎉';
    if (streak === 2) return '2問連続正解！その調子です！✨';
    return PRAISE_CORRECT[Math.floor(Math.random() * PRAISE_CORRECT.length)];
  } else {
    return PRAISE_WRONG[Math.floor(Math.random() * PRAISE_WRONG.length)];
  }
}

const app = {
  currentCategory: 'yaku',
  currentQuestionIndex: 0,
  questions: [],
  score: 0,
  answered: false,
  hasRetried: false,
  lastWrongBtn: null,
  inputFormat: 'choice', // 'choice' (2〜3択) or 'chips' (役一覧から選ぶ)
  seenIds: {},
  modalTimer: null,
  stats: {
    totalCorrect: 0,
    streak: 0
  },

  init() {
    this.loadProgress();
    this.updateStatsUI();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  showHome() {
    this.closeResultModal(false);
    document.getElementById('homeView').classList.remove('hidden');
    document.getElementById('quizView').classList.add('hidden');
    document.getElementById('resultView').classList.add('hidden');
    this.closeCheatSheet();
  },

  pickUnseenQuestions(pool, count) {
    const unseen = shuffleArray(pool.filter(q => !this.seenIds[q.id]));
    let picked = unseen.slice(0, count);
    if (picked.length < count) {
      pool.forEach(q => { delete this.seenIds[q.id]; });
      const pickedSet = new Set(picked.map(q => q.id));
      const rest = shuffleArray(pool.filter(q => !pickedSet.has(q.id)));
      picked = [...picked, ...rest.slice(0, count - picked.length)];
    }
    picked.forEach(q => { this.seenIds[q.id] = true; });
    this.saveProgress();
    return shuffleArray(picked);
  },

  startQuiz(categoryKey) {
    this.closeResultModal(false);
    this.currentCategory = categoryKey;
    this.currentQuestionIndex = 0;
    this.score = 0;

    if (categoryKey === 'quick3') {
      const allPool = Object.values(QUIZ_DATA).flat();
      this.questions = this.pickUnseenQuestions(allPool, 3);
    } else {
      const pool = QUIZ_DATA[categoryKey] || QUIZ_DATA.yaku;
      this.questions = this.pickUnseenQuestions(pool, Math.min(pool.length, 5));
    }

    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('resultView').classList.add('hidden');
    document.getElementById('quizView').classList.remove('hidden');

    const catNames = {
      quick3: '今日の3問サクッとドリル',
      yaku: '牌を見て役を当てる',
      phase1: 'Phase 1: 鳴き判定',
      phase2: 'Phase 2: 飜数カウント',
      phase3: 'Phase 3: 子の点数マスター',
      phase4: 'Phase 4: 親・ツモ申告'
    };
    document.getElementById('quizCategoryBadge').textContent = catNames[categoryKey] || '麻雀レッスン';
    document.getElementById('totalQuestionsNum').textContent = this.questions.length;

    this.renderQuestion();
  },

  renderQuestion() {
    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
      this.modalTimer = null;
    }
    this.closeResultModal(false);

    const q = this.questions[this.currentQuestionIndex];
    if (!q) {
      this.showResult();
      return;
    }
    this.answered = false;

    document.getElementById('currentQuestionNum').textContent = this.currentQuestionIndex + 1;
    const pct = (this.currentQuestionIndex / this.questions.length) * 100;
    document.getElementById('quizProgressBar').style.width = `${pct}%`;

    document.getElementById('badgeRound').textContent = q.badgeRound || '東1局・東場';
    document.getElementById('badgePlayer').textContent = q.badgePlayer || '子（南家）';
    const agariBadge = document.getElementById('badgeAgariType');
    if (q.isNakiCheck) {
      agariBadge.textContent = '鳴き判定';
      agariBadge.onclick = (ev) => TermHelper.open('naki', ev);
    } else {
      agariBadge.textContent = q.isRon !== false ? 'ロンアガリ' : 'ツモアガリ';
      agariBadge.onclick = (ev) => TermHelper.open(q.isRon !== false ? 'ron' : 'tsumo', ev);
    }
    agariBadge.classList.add('cursor-pointer');

    const badgeDora = document.getElementById('badgeDora');
    const doraPreview = document.getElementById('doraTilePreview');
    if (q.isNakiCheck || !q.dora) {
      badgeDora.classList.add('hidden');
    } else {
      badgeDora.classList.remove('hidden');
      doraPreview.innerHTML = `<span class="mj-tile-back"></span><span class="mj-tile-back"></span>${TileRenderer.render(q.dora, { mini: true })}<span class="mj-tile-back"></span><span class="mj-tile-back"></span>`;
    }

    document.getElementById('questionText').innerHTML = TermHelper.linkify(q.question, 'dark');
    document.getElementById('questionSubtext').innerHTML = TermHelper.linkify(q.subtext || '※カンペを見ながらでOK！落ち着いて選ぼう。', 'dark');
    TermHelper.renderChipsBar('quizTermChips', [q.question, q.subtext, ...(q.options || []).map(o => o.text)]);

    const handBox = document.getElementById('tileHandContainer');
    handBox.innerHTML = '';

    if (q.hand && q.hand.length > 0) {
      q.hand.forEach(tile => {
        handBox.innerHTML += TileRenderer.render(tile);
      });
    }

    if (q.winTile) {
      handBox.innerHTML += '<div class="mj-agari-spacer"></div>';
      handBox.innerHTML += TileRenderer.render(q.winTile, {
        isAgari: true,
        isRon: q.isRon !== false,
        agariText: q.isRon !== false ? 'ロン！' : 'ツモ！'
      });
    }

    if (q.melds && q.melds.length > 0) {
      handBox.innerHTML += '<div class="w-px bg-emerald-500/60 h-6 mx-1 sm:mx-2 flex-shrink-0"></div>';
      q.melds.forEach((m, mIdx) => {
        m.forEach((tile, idx) => {
          const isSideways = (idx === 0);
          handBox.innerHTML += TileRenderer.render(tile, { isSideways });
        });
        if (mIdx + 1 < q.melds.length) {
          handBox.innerHTML += '<div class="w-0.5 sm:w-1.5 flex-shrink-0"></div>';
        }
      });
    }

    if (q.targetTile) {
      handBox.innerHTML += '<div class="mj-agari-spacer"></div>';
      handBox.innerHTML += TileRenderer.render(q.targetTile, {
        isAgari: true,
        agariText: '出た牌！'
      });
    }

    const captionEl = document.getElementById('tileHandCaption');
    if (captionEl) {
      captionEl.textContent = q.isNakiCheck
        ? '右端の離れた牌が相手から出た牌です'
        : '一番右の離れた牌が【アガリ牌】です';
    }

    const hintBox = document.getElementById('hintBox');
    hintBox.classList.add('hidden');
    document.getElementById('hintContent').innerHTML = TermHelper.linkify(q.hint || 'カンペを見て確認してみよう！', 'light');

    const peekBar = document.getElementById('peekActionBar');
    if (peekBar) peekBar.classList.add('hidden');

    const formatToggle = document.getElementById('formatToggleContainer');
    if (this.currentCategory === 'yaku') {
      formatToggle.classList.remove('hidden');
      this.updateFormatButtons();
    } else {
      formatToggle.classList.add('hidden');
    }

    const optContainer = document.getElementById('optionsContainer');
    optContainer.innerHTML = '';
    optContainer.classList.remove('pointer-events-none');

    if (this.inputFormat === 'chips' && this.currentCategory === 'yaku') {
      optContainer.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 my-2';
      const correctOpt = q.options.find(o => o.correct);

      YAKU_MASTER_CHIPS.forEach((chip) => {
        const btn = document.createElement('button');
        btn.className = 'p-3 rounded-xl bg-white hover:bg-emerald-50 active:scale-95 border-2 border-slate-200 hover:border-emerald-500 font-bold text-slate-800 text-xs sm:text-sm shadow-xs transition text-center';
        btn.textContent = chip.name;

        const isMatch = correctOpt && (
          correctOpt.text.includes(chip.match) || chip.name.includes(correctOpt.text)
        );
        btn.onclick = () => this.handleAnswer({ text: chip.name, correct: Boolean(isMatch) }, btn, q);
        optContainer.appendChild(btn);
      });
    } else {
      optContainer.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-2';
      const shuffledOpts = shuffleArray(q.options);
      shuffledOpts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'w-full px-4 py-3.5 text-left rounded-xl bg-white hover:bg-emerald-50 active:scale-98 border-2 border-slate-200 hover:border-emerald-500 font-bold text-slate-800 shadow-sm transition transform flex items-center justify-start gap-3';
        btn.innerHTML = `
          <span class="text-xs bg-slate-100 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center font-mono border border-slate-200 flex-shrink-0">${idx + 1}</span>
          <span class="text-sm sm:text-base flex-1 text-left leading-snug">${opt.text}</span>
          <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400 sm:hidden flex-shrink-0"></i>
        `;
        btn.onclick = () => this.handleAnswer(opt, btn, q);
        optContainer.appendChild(btn);
      });
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
    SoundManager.playTile();
  },

  toggleFormat(format) {
    this.inputFormat = format;
    this.updateFormatButtons();
    this.renderQuestion();
  },

  updateFormatButtons() {
    const btnChoice = document.getElementById('formatBtnChoice');
    const btnChips = document.getElementById('formatBtnChips');
    if (!btnChoice || !btnChips) return;

    if (this.inputFormat === 'choice') {
      btnChoice.className = 'px-2 py-1 rounded-md font-bold bg-white text-emerald-800 shadow-sm transition';
      btnChips.className = 'px-2 py-1 rounded-md font-bold text-slate-600 hover:text-slate-900 transition';
    } else {
      btnChoice.className = 'px-2 py-1 rounded-md font-bold text-slate-600 hover:text-slate-900 transition';
      btnChips.className = 'px-2 py-1 rounded-md font-bold bg-white text-emerald-800 shadow-sm transition';
    }
  },

  showHint() {
    const hintBox = document.getElementById('hintBox');
    hintBox.classList.toggle('hidden');
  },

  replayCurrentCall() {},

  openResultModal() {
    const peekBar = document.getElementById('peekActionBar');
    if (peekBar) peekBar.classList.add('hidden');
    const modal = document.getElementById('resultTermModal');
    if (modal) modal.classList.remove('hidden');
  },

  closeResultModal(showPeekBar = true) {
    const modal = document.getElementById('resultTermModal');
    if (modal) modal.classList.add('hidden');
    const peekBar = document.getElementById('peekActionBar');
    if (peekBar) {
      if (showPeekBar && this.answered) {
        peekBar.classList.remove('hidden');
      } else {
        peekBar.classList.add('hidden');
      }
    }
  },

  retryCurrentQuestion() {
    this.closeResultModal(false);
    this.answered = false;
    this.hasRetried = true;

    const optContainer = document.getElementById('optionsContainer');
    if (optContainer) optContainer.classList.remove('pointer-events-none');

    if (this.lastWrongBtn) {
      this.lastWrongBtn.classList.add('opacity-40', 'pointer-events-none', 'cursor-not-allowed');
    }
  },

  handleAnswer(selectedOpt, btnElement, q) {
    if (this.answered) return;
    this.answered = true;
    document.getElementById('optionsContainer').classList.add('pointer-events-none');

    const callType = SoundManager.resolveQuestionCall(q);
    const callLabel = SoundManager.getCallLabel(callType);

    if (selectedOpt.correct) {
      SoundManager.playCall(callType);
      this.score++;
      this.stats.totalCorrect++;
      this.stats.streak++;
      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
      btnElement.classList.remove('bg-white', 'border-slate-200');
      btnElement.classList.add('bg-emerald-100', 'border-emerald-600', 'text-emerald-900');
    } else {
      SoundManager.playWrong();
      this.stats.streak = 0;
      this.lastWrongBtn = btnElement;
      btnElement.classList.remove('bg-white', 'border-slate-200');
      btnElement.classList.add('bg-rose-50', 'border-rose-400', 'text-rose-900');
    }

    this.saveProgress();
    this.updateStatsUI();

    // 回答結果＋解説＋麻雀用語カードをポップアップモーダルに表示（問題画面の下部解答欄は不要）
    const mHeader = document.getElementById('modalHeaderBar');
    const mIcon = document.getElementById('modalStatusIcon');
    const mTitle = document.getElementById('modalStatusTitle');
    const mStamp = document.getElementById('modalCallStamp');
    const mCorrectBadge = document.getElementById('modalCorrectAnswer');
    const mExp = document.getElementById('modalExplanation');
    const mTermBox = document.getElementById('modalTermBox');
    const mWord = document.getElementById('modalTermWord');
    const mReading = document.getElementById('modalTermReading');
    const mTiles = document.getElementById('modalTermTiles');
    const mDesc = document.getElementById('modalTermDesc');
    const mTermSummary = document.getElementById('modalTermSummary');
    const mTermSummaryText = document.getElementById('modalTermSummaryText');
    const mNextBtn = document.getElementById('modalNextBtn');
    const mNextText = document.getElementById('modalNextBtnText');
    const mRetryBtn = document.getElementById('modalRetryBtn');
    const isLast = (this.currentQuestionIndex + 1 >= this.questions.length);

    if (selectedOpt.correct) {
      mHeader.className = 'px-4 py-3 flex items-center justify-between gap-3 bg-gradient-to-r from-emerald-700 to-teal-800 text-white';
      mIcon.textContent = '⭕';
      mTitle.textContent = this.hasRetried
        ? '💡 リベンジ大正解！見抜くセンス抜群です！✨'
        : getPraiseTitle(true, this.stats.streak);
      mStamp.textContent = `🀄 ${callLabel}`;
      mStamp.classList.remove('hidden');
      if (mCorrectBadge) mCorrectBadge.classList.add('hidden');

      if (mRetryBtn) mRetryBtn.classList.add('hidden');
      if (mNextBtn) {
        mNextBtn.className = 'w-full bg-gradient-to-r from-emerald-700 to-felt hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 px-5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base';
      }
      if (mNextText) {
        mNextText.textContent = isLast ? 'セッション結果を見る 🎉' : '次の問題へすすむ';
      }
    } else {
      mHeader.className = 'px-4 py-3 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      mIcon.textContent = '💡';
      mTitle.textContent = getPraiseTitle(false, 0);
      mStamp.classList.add('hidden');
      const okOpt = (q.options || []).find(o => o.correct);
      if (mCorrectBadge && okOpt) {
        mCorrectBadge.textContent = `✅ 正解：${okOpt.text}`;
        mCorrectBadge.classList.remove('hidden');
      }

      if (mRetryBtn) mRetryBtn.classList.remove('hidden');
      if (mNextBtn) {
        mNextBtn.className = 'w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition text-xs sm:text-sm flex items-center justify-center gap-1';
      }
      if (mNextText) {
        mNextText.textContent = isLast ? '解説を読んだので結果を見る' : '解説を読んだので次の問題へ';
      }
    }

    mExp.innerHTML = TermHelper.linkify(q.explanation || 'しっかり特徴を掴めていますね！', 'light');
    const termInfo = TermHelper.findBestTermForQuestion(q);
    if (termInfo && mTermBox) {
      mTermBox.classList.remove('hidden');
      mWord.textContent = termInfo.word;
      mReading.textContent = termInfo.reading;
      mDesc.textContent = termInfo.desc;
      mTiles.innerHTML = (termInfo.tiles || []).map(t => TileRenderer.render(t)).join('');

      if (termInfo.summary && mTermSummary && mTermSummaryText) {
        mTermSummaryText.textContent = termInfo.summary;
        mTermSummary.classList.remove('hidden');
      } else if (mTermSummary) {
        mTermSummary.classList.add('hidden');
      }
    } else if (mTermBox) {
      mTermBox.classList.add('hidden');
    }

    this.openResultModal();
  },

  nextQuestion() {
    this.closeResultModal(false);
    this.hasRetried = false;
    this.lastWrongBtn = null;
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResult();
    } else {
      this.renderQuestion();
    }
  },

  showResult() {
    this.closeResultModal(false);
    document.getElementById('quizView').classList.add('hidden');
    document.getElementById('resultView').classList.remove('hidden');

    const total = this.questions.length;
    document.getElementById('resultScore').textContent = this.score;
    document.getElementById('resultTotal').textContent = total;

    const accuracy = Math.round((this.score / total) * 100);
    document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
    document.getElementById('resultStreak').textContent = `${this.stats.streak}問連続 🔥`;

    if (typeof confetti === 'function') {
      if (accuracy === 100) {
        confetti({ particleCount: 80, spread: 100, origin: { x: 0.2, y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { x: 0.8, y: 0.6 } }), 180);
        setTimeout(() => confetti({ particleCount: 110, spread: 120, origin: { x: 0.5, y: 0.5 } }), 360);
      } else if (accuracy >= 80) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
    }

    const msgBox = document.getElementById('resultMessage');
    if (accuracy === 100) {
      msgBox.textContent = '💮 満点パーフェクト達成！全問正解お見事すぎます！牌感覚が完全に定着しています！✨';
    } else if (accuracy >= 60) {
      msgBox.textContent = 'ナイスファイト！「見ながら解く」を続ければ、実戦でも自信を持ってアガれます！👍';
    } else {
      msgBox.textContent = '1セッションお疲れ様でした！最初は間違えて当たり前。カンペを見ながら何度も遊んでみてくださいね！✨';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  restartCategory() {
    this.startQuiz(this.currentCategory);
  },

  openCheatSheet() {
    const modal = document.getElementById('cheatSheetModal');
    const sheet = document.getElementById('cheatSheetContent');
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      sheet.classList.remove('translate-y-full');
    }, 10);
  },

  closeCheatSheet() {
    const modal = document.getElementById('cheatSheetModal');
    const sheet = document.getElementById('cheatSheetContent');
    sheet.classList.add('translate-y-full');
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  },

  switchTab(tabId) {
    ['tabNaki', 'tabYaku', 'tabChild', 'tabParent'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');

    const btnMap = {
      tabNaki: 'tabBtnNaki',
      tabYaku: 'tabBtnYaku',
      tabChild: 'tabBtnChild',
      tabParent: 'tabBtnParent'
    };

    Object.values(btnMap).forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.className = 'px-3.5 py-2.5 border-b-2 border-transparent text-slate-600 hover:text-slate-800 whitespace-nowrap flex items-center gap-1';
      }
    });

    const activeBtn = document.getElementById(btnMap[tabId]);
    if (activeBtn) {
      activeBtn.className = 'px-3.5 py-2.5 border-b-2 border-emerald-700 text-emerald-800 bg-white whitespace-nowrap flex items-center gap-1';
    }
  },

  toggleSound() {},

  saveProgress() {
    try {
      localStorage.setItem('MAHJONG_STATS', JSON.stringify(this.stats));
      localStorage.setItem('MAHJONG_MAIN_SEEN_Q', JSON.stringify(this.seenIds));
    } catch (e) {}
  },

  loadProgress() {
    try {
      const raw = localStorage.getItem('MAHJONG_STATS');
      if (raw) this.stats = JSON.parse(raw);
      const seenRaw = localStorage.getItem('MAHJONG_MAIN_SEEN_Q');
      if (seenRaw) this.seenIds = JSON.parse(seenRaw);
    } catch (e) {}
  },

  updateStatsUI() {
    const correctEl = document.getElementById('statTotalCorrect');
    const streakEl = document.getElementById('statStreak');
    if (correctEl) correctEl.textContent = this.stats.totalCorrect || 0;
    if (streakEl) streakEl.textContent = this.stats.streak || 0;

    const lvlBadge = document.getElementById('userLevelBadge');
    if (lvlBadge) {
      const count = this.stats.totalCorrect || 0;
      if (count >= 30) {
        lvlBadge.textContent = '雀士ランク: 免許皆伝マスター 🀄';
      } else if (count >= 15) {
        lvlBadge.textContent = '雀士ランク: 点数マスター Lv.2 ✨';
      } else if (count >= 5) {
        lvlBadge.textContent = '雀士ランク: 初級雀士 Lv.1 🌿';
      } else {
        lvlBadge.textContent = '雀士ランク: 入門・初級 🐣';
      }
    }
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => app.init());
}

/**
 * 超入門編『麻雀ファーストステップ』メインコントローラー (js/beginner-app.js)
 * 依存: tile-renderer.js, sound-engine.js, term-dict.js, data/beginner-questions.js
 */
const PRAISE_CORRECT = [
  'お見事！センス抜群です！👏',
  '完璧！すばらしい判断！✨',
  'さすが！もう見抜けてますね！🎉',
  'その調子！どんどん感覚掴めてます！🥰',
  '大正解！実戦でもバッチリ使えますよ！🀄',
  'ナイス！めちゃくちゃ筋がいいです！💖',
  'すごい！もう迷わず選べてますね！💫',
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
  currentStageKey: 'stage1',
  questions: [],
  qIndex: 0,
  score: 0,
  streak: 0,
  answered: false,
  scaffoldOn: false, // デフォルトは補助輪OFF（実戦並び）
  clearedStages: {},
  seenIds: {},
  sessionSize: 7,
  modalTimer: null,

  init() {
    this.loadState();
    this.updateDynamicCounts();
    this.renderStageCards();
    this.populateGuideGlossary();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  getTotalPoolCount() {
    return Object.values(STAGE_QUESTIONS).reduce((sum, list) => sum + list.length, 0);
  },

  updateDynamicCounts() {
    const total = this.getTotalPoolCount();
    const randBtn = document.getElementById('random5BtnLabel');
    if (randBtn) randBtn.textContent = `🎲 全${total}問からランダム5問特訓`;
    const secLabel = document.getElementById('stagesSectionLabel');
    if (secLabel) secLabel.textContent = `6つのステップ（全${total}問・どこからでも遊べます）`;
  },

  populateGuideGlossary() {
    const box = document.getElementById('guideGlossaryList');
    if (!box) return;
    const seen = new Set();
    const items = [];
    Object.values(STAGE_QUESTIONS).forEach(list => {
      list.forEach(q => {
        if (q.term && !seen.has(q.term.word)) {
          seen.add(q.term.word);
          items.push(q.term);
        }
      });
    });
    box.innerHTML = items.map(t => `
      <div class="bg-white p-2.5 rounded-lg border border-indigo-100">
        <div class="font-bold text-indigo-900">${t.word} <span class="text-[10px] text-teal-700 font-normal">（${t.reading}）</span></div>
        <div class="text-[11px] text-slate-600 mt-0.5 leading-snug">${t.desc}</div>
      </div>
    `).join('');
  },

  loadState() {
    try {
      const raw = localStorage.getItem('MAHJONG_BEGINNER_CLEARED');
      if (raw) this.clearedStages = JSON.parse(raw);
      const seenRaw = localStorage.getItem('MAHJONG_BEGINNER_SEEN_Q');
      if (seenRaw) this.seenIds = JSON.parse(seenRaw);
    } catch (e) {}
  },

  saveState() {
    try {
      localStorage.setItem('MAHJONG_BEGINNER_CLEARED', JSON.stringify(this.clearedStages));
      localStorage.setItem('MAHJONG_BEGINNER_SEEN_Q', JSON.stringify(this.seenIds));
    } catch (e) {}
  },

  // 未出題の問題を優先しつつ毎回ランダムな順序で出題
  pickSessionQuestions(pool, count) {
    const unseen = shuffleArray(pool.filter(q => !this.seenIds[q.id]));
    let picked = unseen.slice(0, count);
    if (picked.length < count) {
      pool.forEach(q => { delete this.seenIds[q.id]; });
      const pickedSet = new Set(picked.map(q => q.id));
      const rest = shuffleArray(pool.filter(q => !pickedSet.has(q.id)));
      picked = [...picked, ...rest.slice(0, count - picked.length)];
    }
    picked.forEach(q => { this.seenIds[q.id] = true; });
    this.saveState();
    return shuffleArray(picked);
  },

  rerollStage() {
    this.startStage(this.currentStageKey || 'stage1');
  },

  renderStageCards() {
    const box = document.getElementById('stageCardsContainer');
    if (!box) return;
    box.innerHTML = '';

    let clearedCount = 0;
    STAGES_META.forEach((st) => {
      const isCleared = Boolean(this.clearedStages[st.key]);
      if (isCleared) clearedCount++;
      const poolLen = (STAGE_QUESTIONS[st.key] || []).length;

      const card = document.createElement('div');
      card.className = `bg-white rounded-xl p-4 shadow-sm hover:shadow-md border-2 ${isCleared ? 'border-teal-500/70' : 'border-slate-200/90'} hover:border-teal-600 transition cursor-pointer flex flex-col justify-between group`;
      card.onclick = () => this.startStage(st.key);

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900">${st.num}</span>
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">${st.badge}</span>
              ${isCleared ? '<span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">💮 クリア済</span>' : ''}
            </div>
          </div>
          <h4 class="font-bold text-slate-800 group-hover:text-teal-700 text-base mb-1 flex items-center gap-1.5">
            <span class="text-lg">${st.icon}</span>
            <span>${st.title}</span>
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed">${st.desc}</p>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-bold">
          <span>🎲 毎回ちがう${Math.min(this.sessionSize, poolLen)}問（全${poolLen}種収録）</span>
          <i data-lucide="chevron-right" class="w-4 h-4 transform group-hover:translate-x-1 transition"></i>
        </div>
      `;
      box.appendChild(card);
    });

    const badge = document.getElementById('progressBadge');
    if (badge) badge.textContent = `クリア済み: ${clearedCount} / ${STAGES_META.length} ステージ`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  showHome() {
    this.closeResultModal(false);
    document.getElementById('homeView').classList.remove('hidden');
    document.getElementById('playView').classList.add('hidden');
    document.getElementById('clearView').classList.add('hidden');
    this.renderStageCards();
  },

  startStage(stageKey) {
    this.closeResultModal(false);
    this.currentStageKey = stageKey;
    if (stageKey === 'random5') {
      const allPool = Object.values(STAGE_QUESTIONS).flat();
      this.questions = this.pickSessionQuestions(allPool, 5);
    } else {
      const pool = STAGE_QUESTIONS[stageKey] || STAGE_QUESTIONS.stage1;
      this.questions = this.pickSessionQuestions(pool, Math.min(this.sessionSize, pool.length));
    }
    this.qIndex = 0;
    this.score = 0;
    this.streak = 0;

    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('clearView').classList.add('hidden');
    document.getElementById('playView').classList.remove('hidden');

    const meta = STAGES_META.find(s => s.key === stageKey);
    document.getElementById('stageBadge').textContent = meta
      ? `${meta.num}: ${meta.title}`
      : '🎲 ランダム5問特訓';
    document.getElementById('qTotal').textContent = this.questions.length;

    this.renderQuestion();
  },

  renderQuestion() {
    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
      this.modalTimer = null;
    }
    this.closeResultModal(false);

    const q = this.questions[this.qIndex];
    if (!q) {
      this.showStageClear();
      return;
    }
    this.answered = false;
    if (q.type === 'scaffold-wait') {
      this.scaffoldOn = Boolean(q.defaultScaffold);
    }

    document.getElementById('qCurrent').textContent = this.qIndex + 1;
    document.getElementById('playProgressBar').style.width = `${(this.qIndex / this.questions.length) * 100}%`;

    document.getElementById('modeInstructionBadge').textContent = q.modeLabel || 'パズル';
    document.getElementById('playQuestion').innerHTML = TermHelper.linkify(q.question, 'dark');
    document.getElementById('playSubtext').innerHTML = TermHelper.linkify(q.subtext || '', 'dark');
    TermHelper.renderChipsBar('questionTermChips', [
      q.question,
      q.subtext,
      ...(q.options || []).map(o => o.text),
      q.term && q.term.word
    ]);

    const peekBar = document.getElementById('peekActionBar');
    if (peekBar) peekBar.classList.add('hidden');
    document.getElementById('discardedPreview').classList.add('hidden');

    const riverArea = document.getElementById('riverArea');
    const riverTiles = document.getElementById('riverTiles');
    if (q.river && q.river.length > 0) {
      riverArea.classList.remove('hidden');
      riverTiles.innerHTML = q.river.map(r =>
        TileRenderer.render(r.tile, { highlight: r.highlight, badge: r.highlight ? '捨てた牌' : '' })
      ).join('');
    } else {
      riverArea.classList.add('hidden');
    }

    const scaffoldBar = document.getElementById('scaffoldBar');
    if (q.type === 'scaffold-wait') {
      scaffoldBar.classList.remove('hidden');
      this.updateScaffoldBtnUI();
    } else {
      scaffoldBar.classList.add('hidden');
    }

    this.renderBoardAndAnswers(q);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    Sound.clack();
  },

  updateScaffoldBtnUI() {
    const btn = document.getElementById('scaffoldToggleBtn');
    if (!btn) return;
    if (this.scaffoldOn) {
      btn.className = 'text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-900 transition shadow';
      btn.textContent = '🚲 補助輪 ON（ブロック区切り中・タップでOFF）';
    } else {
      btn.className = 'text-xs font-bold px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/35 transition';
      btn.textContent = '🚲 補助輪 OFF（タップで区切り表示！）';
    }
  },

  toggleScaffold() {
    const q = this.questions[this.qIndex];
    if (!q || q.type !== 'scaffold-wait') return;
    this.scaffoldOn = !this.scaffoldOn;
    this.updateScaffoldBtnUI();
    this.renderScaffoldHand(q);
    Sound.clack();
  },

  renderScaffoldHand(q) {
    const row = document.getElementById('boardTilesRow');
    const cap = document.getElementById('boardHelperCaption');
    row.innerHTML = '';

    if (this.scaffoldOn) {
      row.className = 'flex items-center justify-center flex-wrap gap-1 py-1 w-full';
      q.blocks.forEach(b => {
        const div = document.createElement('div');
        div.className = `scaffold-block ${b.isWait ? 'scaffold-block-wait' : ''}`;
        const tilesHtml = b.tiles.map(t => TileRenderer.render(t)).join('');
        div.innerHTML = `
          <div class="flex items-center gap-0.5">${tilesHtml}</div>
          <span class="text-[10px] font-bold mt-1 ${b.isWait ? 'text-amber-300' : 'text-teal-200/80'}">${b.label}</span>
        `;
        row.appendChild(div);
      });
      cap.textContent = '💡 黄色い枠のパーツに注目！';
    } else {
      row.className = 'flex items-center justify-center flex-nowrap gap-[2px] sm:gap-1 py-2 w-max mx-auto';
      const flat = [];
      q.blocks.forEach(b => flat.push(...b.tiles));
      const sorted = sortTiles(flat);
      row.innerHTML = sorted.map(t => TileRenderer.render(t)).join('');
      cap.textContent = '実戦と同じ13枚並び（迷ったら上の『🚲 補助輪』ボタンを押してみよう！）';
    }
  },

  renderBoardAndAnswers(q) {
    const boardStage = document.getElementById('boardStageArea');
    const row = document.getElementById('boardTilesRow');
    const cap = document.getElementById('boardHelperCaption');
    const ans = document.getElementById('answerArea');

    row.innerHTML = '';
    ans.innerHTML = '';
    ans.classList.remove('hidden', 'pointer-events-none');
    boardStage.classList.remove('hidden');
    row.className = 'flex items-center justify-center gap-1.5 sm:gap-2 flex-nowrap py-1 w-max mx-auto';

    // 1) tile-choice: 大きな牌ボタンから選択（ドラ表示がある時だけ盤面を表示）
    if (q.type === 'tile-choice') {
      if (q.doraIndicator) {
        row.innerHTML = `<span class="mj-tile-back-lg"></span><span class="mj-tile-back-lg"></span>${TileRenderer.render(q.doraIndicator, { large: true, badge: '表示牌' })}<span class="mj-tile-back-lg"></span><span class="mj-tile-back-lg"></span>`;
        cap.textContent = q.boardNote || '';
      } else {
        boardStage.classList.add('hidden');
      }

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-3 gap-3 my-1';
      shuffleArray(q.tileOptions).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-500 rounded-2xl p-4 sm:p-5 shadow-sm transition transform active:scale-95 flex items-center justify-center';
        btn.innerHTML = TileRenderer.render(opt.tile, { large: true });
        btn.onclick = () => this.submitChoice(opt.correct, btn, q, 0);
        grid.appendChild(btn);
      });
      ans.appendChild(grid);
      return;
    }

    // 2) slot-fill: [2p] [3p] [ ? ] 穴埋めパズル
    if (q.type === 'slot-fill') {
      row.innerHTML = q.slots.map(s => {
        if (s === '?') return '<div id="activeEmptySlot" class="mj-slot-empty">？</div>';
        return TileRenderer.render(s, { large: true });
      }).join('');
      cap.textContent = '［ ？ ］にはまる牌を下の候補からタップ！';

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-3 gap-3 my-1';
      shuffleArray(q.tileOptions).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-500 rounded-2xl p-3.5 sm:p-4 shadow-sm transition transform active:scale-95 flex items-center justify-center';
        btn.innerHTML = TileRenderer.render(opt.tile, { large: true });
        btn.onclick = () => {
          if (this.answered) return;
          if (opt.correct) {
            const slotEl = document.getElementById('activeEmptySlot');
            if (slotEl) {
              slotEl.outerHTML = `<div class="animate-pop-in inline-block">${TileRenderer.render(opt.tile, { large: true, badge: '完成!' })}</div>`;
            }
          }
          this.submitChoice(opt.correct, btn, q, 80);
        };
        grid.appendChild(btn);
      });
      ans.appendChild(grid);
      return;
    }

    // 3) tap-hand / discard-8: 盤面の手牌を直接タップ（下部の余分な解答欄は非表示）
    if (q.type === 'tap-hand' || q.type === 'discard-8') {
      const useMedium = q.hand.length >= 6;
      row.className = `flex items-center justify-center ${useMedium ? 'gap-1 sm:gap-2' : 'gap-1.5 sm:gap-2'} flex-nowrap py-1 w-max mx-auto`;
      q.hand.forEach((tile, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'inline-block';
        wrap.innerHTML = TileRenderer.render(tile, {
          large: !useMedium,
          medium: useMedium,
          interactive: true
        });
        wrap.onclick = () => this.handleHandTileTap(tile, idx, wrap, q);
        row.appendChild(wrap);
      });
      cap.textContent = q.caption || '👆 いらない牌を1枚直接タップして捨てよう！';
      ans.classList.add('hidden');
      return;
    }

    // 4) text-choice: ボードに参考牌＋下に2〜3択ボタン
    if (q.type === 'text-choice') {
      const tiles = q.boardTiles || [];
      if (tiles.length === 0) {
        boardStage.classList.add('hidden');
      } else {
        const useMedium = tiles.length >= 6;
        row.className = `flex items-center justify-center ${useMedium ? 'gap-1 sm:gap-2' : 'gap-1.5 sm:gap-2'} flex-nowrap py-1 w-max mx-auto`;
        row.innerHTML = tiles.map(t => TileRenderer.render(t, { large: !useMedium, medium: useMedium })).join('');
        cap.textContent = q.caption || '';
      }
      this.renderTextOptions(q, ans);
      return;
    }

    // 5) scaffold-wait: 補助輪つき13枚＋下に選択肢
    if (q.type === 'scaffold-wait') {
      this.renderScaffoldHand(q);
      this.renderTextOptions(q, ans);
      return;
    }
  },

  renderTextOptions(q, container) {
    const grid = document.createElement('div');
    grid.className = `grid grid-cols-1 ${q.options.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-2.5 my-1`;
    shuffleArray(q.options).forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'w-full px-4 py-3.5 rounded-xl bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-500 font-bold text-slate-800 shadow-sm transition text-left flex items-center justify-start gap-3';
      btn.innerHTML = `
        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs flex items-center justify-center font-mono border border-slate-200 flex-shrink-0">${i + 1}</span>
        <span class="text-sm sm:text-base flex-1 text-left leading-snug">${opt.text}</span>
      `;
      btn.onclick = () => this.submitChoice(opt.correct, btn, q, 80);
      grid.appendChild(btn);
    });
    container.appendChild(grid);
  },

  handleHandTileTap(tile, idx, tileWrapperEl, q) {
    if (this.answered) return;
    const isCorrect = q.correctTiles.includes(tile);

    if (isCorrect && q.type === 'discard-8') {
      tileWrapperEl.classList.add('opacity-25', 'scale-75');
      const prev = document.getElementById('discardedPreview');
      prev.classList.remove('hidden');
      prev.innerHTML = `✨ ナイス打牌！テンパイ完成（<strong>${q.waitDesc}</strong>）`;
    } else if (!isCorrect) {
      tileWrapperEl.classList.add('ring-4', 'ring-rose-400', 'rounded-lg');
    } else {
      tileWrapperEl.classList.add('ring-4', 'ring-emerald-400', 'rounded-lg');
    }

    this.submitChoice(isCorrect, null, q, 260);
  },

  getCorrectAnswerLabel(q) {
    if (!q) return '';
    if (q.options) {
      const ok = q.options.find(o => o.correct);
      return ok ? ok.text : '';
    }
    if (q.tileOptions) {
      const ok = q.tileOptions.find(o => o.correct);
      return ok ? TileRenderer.getTileNameJa(ok.tile) : '';
    }
    if (q.correctTiles && q.correctTiles.length > 0) {
      return q.correctTiles.map(t => TileRenderer.getTileNameJa(t)).join(' / ');
    }
    return '';
  },

  replayCurrentCall() {
    const q = this.questions[this.qIndex];
    Sound.playCall((q && q.callSound) ? q.callSound : 'ron');
  },

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

  submitChoice(isCorrect, btnEl, q, popupDelayMs = 80) {
    if (this.answered) return;
    this.answered = true;

    const callType = q.callSound || 'ron';
    const callLabel = Sound.getCallLabel(callType);

    if (isCorrect) {
      this.score++;
      this.streak = (this.streak || 0) + 1;
      Sound.playCall(callType);
      if (typeof confetti === 'function') {
        setTimeout(() => {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.72 } });
        }, 50);
      }
    } else {
      this.streak = 0;
      Sound.softBuzz();
    }

    const ans = document.getElementById('answerArea');
    ans.classList.add('pointer-events-none');

    if (btnEl) {
      btnEl.classList.remove('bg-white', 'border-slate-200');
      if (isCorrect) {
        btnEl.classList.add('bg-emerald-100', 'border-emerald-600', 'text-emerald-950');
      } else {
        btnEl.classList.add('bg-rose-50', 'border-rose-400', 'text-rose-950');
      }
    }

    // 回答結果＋解説＋麻雀用語カードをポップアップモーダルへ集約
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
    const mReplayBtn = document.getElementById('modalReplayVoiceBtn');
    const mNextText = document.getElementById('modalNextBtnText');

    if (isCorrect) {
      mHeader.className = 'px-4 py-3.5 flex items-center justify-between gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white';
      mIcon.textContent = '⭕';
      mTitle.textContent = getPraiseTitle(true, this.streak);
      mStamp.textContent = `🀄 ${callLabel}`;
      mStamp.classList.remove('hidden');
      if (mCorrectBadge) mCorrectBadge.classList.add('hidden');
    } else {
      mHeader.className = 'px-4 py-3.5 flex items-center justify-between gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      mIcon.textContent = '💡';
      mTitle.textContent = getPraiseTitle(false, 0);
      mStamp.classList.add('hidden');
      const corrLabel = this.getCorrectAnswerLabel(q);
      if (mCorrectBadge && corrLabel) {
        mCorrectBadge.textContent = `✅ 正解：${corrLabel}`;
        mCorrectBadge.classList.remove('hidden');
      }
    }

    mExp.innerHTML = TermHelper.linkify(q.explanation, 'light');
    const termInfo = q.term || TermHelper.findBestTermForQuestion(q);
    if (termInfo && mTermBox) {
      mTermBox.classList.remove('hidden');
      mWord.textContent = termInfo.word;
      mReading.textContent = termInfo.reading;
      mDesc.textContent = termInfo.desc;
      mTiles.innerHTML = (termInfo.tiles || []).map(t => TileRenderer.render(t)).join('');
    } else if (mTermBox) {
      mTermBox.classList.add('hidden');
    }

    if (mReplayBtn) {
      mReplayBtn.innerHTML = `<span>🔊 「${callLabel}」を聞く</span>`;
    }
    const isLast = (this.qIndex + 1 >= this.questions.length);
    if (mNextText) {
      mNextText.textContent = isLast ? 'ステージ結果を見る 🎉' : '次の問題へすすむ';
    }

    if (popupDelayMs > 0) {
      this.modalTimer = setTimeout(() => {
        this.openResultModal();
      }, popupDelayMs);
    } else {
      this.openResultModal();
    }
  },

  nextQuestion() {
    this.closeResultModal(false);
    this.qIndex++;
    if (this.qIndex >= this.questions.length) {
      this.showStageClear();
    } else {
      this.renderQuestion();
    }
  },

  showStageClear() {
    this.closeResultModal(false);
    document.getElementById('playView').classList.add('hidden');
    document.getElementById('clearView').classList.remove('hidden');

    if (this.currentStageKey !== 'random5') {
      this.clearedStages[this.currentStageKey] = true;
      this.saveState();
    }

    const total = this.questions.length;
    const acc = Math.round((this.score / total) * 100);
    const allCount = this.getTotalPoolCount();

    const currentIdx = STAGES_META.findIndex(s => s.key === this.currentStageKey);
    const currentMeta = currentIdx >= 0 ? STAGES_META[currentIdx] : null;
    const nextMeta = (currentIdx >= 0 && STAGES_META[currentIdx + 1]) ? STAGES_META[currentIdx + 1] : null;

    document.getElementById('clearStageLabel').textContent = currentMeta ? `${currentMeta.num} クリア！` : 'ランダム5問 完了！';
    document.getElementById('clearTitle').textContent = currentMeta ? `${currentMeta.icon} ${currentMeta.title} 完了！` : '🎲 ランダム5問特訓 完了！';
    document.getElementById('clearScore').textContent = this.score;
    document.getElementById('clearTotal').textContent = total;
    document.getElementById('clearAccuracy').textContent = `${acc}%`;

    if (typeof confetti === 'function') {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    }

    const msgEl = document.getElementById('clearMessage');
    const actEl = document.getElementById('clearActions');
    actEl.innerHTML = '';

    let praiseSummary = '';
    if (acc === 100) {
      praiseSummary = '🏆 パーフェクト達成！プロ級のセンスです！✨';
    } else if (acc >= 80) {
      praiseSummary = '🎉 すごい正解率！麻雀の勘がめちゃくちゃ鋭いです！';
    } else if (acc >= 50) {
      praiseSummary = '✨ ナイスファイト！着実に基礎が身についてきていますよ！';
    } else {
      praiseSummary = '🌱 おつかれさまでした！何度も遊ぶうちに自然と見抜けるようになりますよ😊';
    }

    if (this.currentStageKey === 'random5') {
      msgEl.innerHTML = `<span class="block text-teal-800 font-bold mb-1">${praiseSummary}</span>何度でも違う組み合わせで麻雀用語と形を楽しく復習できます！`;
      actEl.innerHTML = `
        <button onclick="app.startStage('random5')" class="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm sm:text-base">
          <span>🎲 別のランダム5問に挑戦！</span>
        </button>
        <button onclick="app.showHome()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs sm:text-sm">
          ステージ一覧にもどる
        </button>
      `;
    } else if (nextMeta) {
      msgEl.innerHTML = `<span class="block text-teal-800 font-bold mb-1">${praiseSummary}</span>次は「${nextMeta.num}：${nextMeta.title}」に進んでみましょう！`;
      actEl.innerHTML = `
        <button onclick="app.startStage('${nextMeta.key}')" class="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm sm:text-base">
          <span>次の ${nextMeta.num} へ進む</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>
        <button onclick="app.startStage('${currentMeta.key}')" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs sm:text-sm">
          🔄 別の問題パターンでこのステージを遊ぶ！
        </button>
        <button onclick="app.showHome()" class="w-full text-slate-500 hover:text-slate-700 font-medium py-2 text-xs">
          ステージ一覧にもどる
        </button>
      `;
    } else {
      msgEl.innerHTML = `<span class="block text-teal-800 font-bold mb-1">${praiseSummary}</span>全6ステージ（全${allCount}問）クリアおめでとうございます！！これで手牌の形・鳴き・用語はバッチリです。次は『麻雀トレーニングボード』で役と点数にチャレンジ！`;
      actEl.innerHTML = `
        <a id="clearLinkMain" href="./index.html" class="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm sm:text-base">
          <span>🎓 『麻雀トレーニングボード』へ進む！</span>
          <i data-lucide="external-link" class="w-4 h-4"></i>
        </a>
        <button onclick="app.startStage('random5')" class="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-3 rounded-xl shadow transition text-xs sm:text-sm">
          🎲 全${allCount}問ランダム特訓で遊ぶ
        </button>
        <button onclick="app.showHome()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition text-xs sm:text-sm">
          ステージ一覧にもどる
        </button>
      `;
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  openGuide() {
    document.getElementById('guideModal').classList.remove('hidden');
  },
  closeGuide() {
    document.getElementById('guideModal').classList.add('hidden');
  },

  toggleSound() {
    Sound.toggle('soundToggleBtn');
  }
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => app.init());
}

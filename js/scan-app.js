/**
 * 麻雀手牌カメラ点数スキャナー - コントローラー (js/scan-app.js)
 * 依存: TileRenderer (js/shared/tile-renderer.js)
 */

const SAMPLE_DEMO_RESULT = {
  isValidAgari: true,
  handTiles: ['2m', '3m', '4m', '5p', '6p', '7p', '2s', '3s', '4s', '6s', '7s', '8s', '5m'],
  winTile: '5m',
  melds: [],
  doraIndicator: '4m',
  doraTiles: ['5m'],
  han: 4,
  fu: 30,
  scoreTitle: '満貫',
  yakuList: [
    { name: '立直（リーチ）', han: 1 },
    { name: '断么九（タンヤオ）', han: 1 },
    { name: '平和（ピンフ）', han: 1 },
    { name: 'ドラ', han: 1 }
  ],
  scores: {
    childRon: 8000,
    childTsumo: '2000・4000',
    parentRon: 12000,
    parentTsumo: '4000オール'
  },
  speechGuide: {
    childRon: 'ロン！ 8000点です！',
    childTsumo: 'ツモ！ 2000・4000（ニセン・ヨンセン）です！',
    parentRon: 'ロン！ 12000点です！',
    parentTsumo: 'ツモ！ 4000オールです！'
  },
  advice: 'リーチ・タンヤオ・ピンフ・ドラ1で美しい満貫！落ち着いて相手に申告しましょう✨'
};

const scanApp = {
  gasUrl: '',
  currentResult: null,
  activePlayerType: 'child', // 'child' | 'parent'
  activeWinType: 'ron',      // 'ron' | 'tsumo'

  init() {
    this.loadSettings();
    this.bindEvents();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  loadSettings() {
    try {
      const saved = localStorage.getItem('MAHJONG_SCAN_GAS_URL');
      if (saved) {
        this.gasUrl = saved.trim();
        const input = document.getElementById('gasUrlInput');
        if (input) input.value = this.gasUrl;
      }
    } catch (e) {}
    this.updateGasStatusUI();
  },

  saveSettings() {
    const input = document.getElementById('gasUrlInput');
    if (!input) return;
    const url = input.value.trim();
    this.gasUrl = url;
    try {
      localStorage.setItem('MAHJONG_SCAN_GAS_URL', url);
    } catch (e) {}
    this.updateGasStatusUI();
    this.closeSettingsModal();
    this.showToast('✅ GAS URLを保存しました！');
  },

  updateGasStatusUI() {
    const badge = document.getElementById('gasStatusBadge');
    if (!badge) return;
    if (this.gasUrl && this.gasUrl.startsWith('https://script.google.com/')) {
      badge.className = 'inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span>GAS接続中（AIカメラ有効）</span>';
    } else {
      badge.className = 'inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full cursor-pointer';
      badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-500"></span><span>お試し体験モード（タップでGAS設定）</span>';
      badge.onclick = () => this.openSettingsModal();
    }
  },

  bindEvents() {
    const fileInput = document.getElementById('cameraFileInput');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }
  },

  triggerCamera() {
    const input = document.getElementById('cameraFileInput');
    if (input) input.click();
  },

  handleFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    this.showLoading(true);

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('capturedPreviewImg');
      if (previewImg) {
        previewImg.src = e.target.result;
        previewImg.classList.remove('hidden');
      }

      // Canvasで長辺1200pxに自動圧縮
      this.compressImage(e.target.result, 1200, 0.82, (compressedBase64) => {
        this.sendToScanner(compressedBase64);
      });
    };
    reader.readAsDataURL(file);

    // 次回同じファイルを選んでも change が発火するようにクリア
    event.target.value = '';
  },

  compressImage(base64Data, maxDimension, quality, callback) {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(compressedDataUrl);
    };
    img.src = base64Data;
  },

  sendToScanner(base64Image) {
    // GAS URL が未設定の場合はサンプルデモを表示して親切に案内
    if (!this.gasUrl || !this.gasUrl.startsWith('https://script.google.com/')) {
      setTimeout(() => {
        this.showLoading(false);
        this.renderResult(SAMPLE_DEMO_RESULT);
        this.showDemoNotice();
      }, 1200);
      return;
    }

    fetch(this.gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // GASのCORSプレフライト回避用
      },
      body: JSON.stringify({ image: base64Image })
    })
      .then((res) => res.json())
      .then((data) => {
        this.showLoading(false);
        if (data.error) {
          alert('解析エラー: ' + data.error);
          return;
        }
        if (data.isValidAgari === false) {
          alert(data.errorMessage || '手牌が14枚揃っていないか、不鮮明なようです。');
          return;
        }
        this.renderResult(data);
      })
      .catch((err) => {
        this.showLoading(false);
        alert('通信に失敗しました。GASのデプロイ設定（アクセスできるユーザー: 全員）をご確認ください。\n詳細: ' + err.message);
      });
  },

  loadDemoSample() {
    this.showLoading(true);
    setTimeout(() => {
      this.showLoading(false);
      this.renderResult(SAMPLE_DEMO_RESULT);
    }, 600);
  },

  showLoading(isLoading) {
    const loadingEl = document.getElementById('scannerLoadingArea');
    const resultEl = document.getElementById('scannerResultArea');
    const uploadPrompt = document.getElementById('scannerUploadPrompt');

    if (isLoading) {
      if (loadingEl) loadingEl.classList.remove('hidden');
      if (resultEl) resultEl.classList.add('hidden');
      if (uploadPrompt) uploadPrompt.classList.add('opacity-40', 'pointer-events-none');
    } else {
      if (loadingEl) loadingEl.classList.add('hidden');
      if (uploadPrompt) uploadPrompt.classList.remove('opacity-40', 'pointer-events-none');
    }
  },

  renderResult(data = this.currentResult) {
    if (!data) return;
    this.currentResult = data;
    const resultArea = document.getElementById('scannerResultArea');
    if (!resultArea) return;
    resultArea.classList.remove('hidden');

    // 牌姿レンダリング
    const handBox = document.getElementById('scannedHandTiles');
    if (handBox) {
      handBox.innerHTML = '';
      (data.handTiles || []).forEach((tile, idx) => {
        const span = document.createElement('span');
        span.className = 'cursor-pointer hover:opacity-80 transition inline-block';
        span.title = 'タップして牌を修正';
        span.onclick = () => this.openTilePicker(idx, false);
        span.innerHTML = TileRenderer.render(tile);
        handBox.appendChild(span);
      });

      if (data.winTile) {
        const spacer = document.createElement('div');
        spacer.className = 'mj-agari-spacer';
        handBox.appendChild(spacer);

        const winSpan = document.createElement('span');
        winSpan.className = 'cursor-pointer hover:opacity-80 transition inline-block';
        winSpan.title = 'アガリ牌（タップして修正）';
        winSpan.onclick = () => this.openTilePicker(0, true);
        winSpan.innerHTML = TileRenderer.render(data.winTile, {
          isAgari: true,
          agariText: 'アガリ牌'
        });
        handBox.appendChild(winSpan);
      }
    }

    // 役一覧レンダリング
    const yakuListEl = document.getElementById('scannedYakuList');
    if (yakuListEl) {
      yakuListEl.innerHTML = '';
      (data.yakuList || []).forEach((y) => {
        const badge = document.createElement('div');
        badge.className = 'flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-emerald-200 text-xs shadow-2xs';
        badge.innerHTML = `
          <span class="font-bold text-slate-800">${y.name}</span>
          <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">${y.han}飜</span>
        `;
        yakuListEl.appendChild(badge);
      });
    }

    // 基本情報バッジ
    const hanFuEl = document.getElementById('scannedHanFuBadge');
    if (hanFuEl) {
      hanFuEl.textContent = `${data.han}飜 ${data.fu}符`;
    }
    const scoreTitleEl = document.getElementById('scannedScoreTitleBadge');
    if (scoreTitleEl) {
      scoreTitleEl.textContent = data.scoreTitle || (data.han >= 5 ? '満貫クラス' : '');
      scoreTitleEl.className = data.scoreTitle ? 'font-bold text-xs bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-2xs' : 'hidden';
    }

    // アドバイス
    const adviceEl = document.getElementById('scannedAdvice');
    if (adviceEl) {
      adviceEl.textContent = data.advice || '落ち着いて相手に申告しましょう！';
    }

    // 点数カード更新
    this.updateScoreDisplay();

    // スムーズスクロール
    if (typeof resultArea.scrollIntoView === 'function') {
      resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  setPlayerType(type) {
    this.activePlayerType = type;
    this.updateScoreDisplay();
  },

  setWinType(type) {
    this.activeWinType = type;
    this.updateScoreDisplay();
  },

  updateScoreDisplay() {
    if (!this.currentResult || !this.currentResult.scores) return;
    const scores = this.currentResult.scores;
    const speech = this.currentResult.speechGuide || {};

    // タブボタンスタイル更新
    const btnChild = document.getElementById('playerTabChild');
    const btnParent = document.getElementById('playerTabParent');
    if (btnChild && btnParent) {
      if (this.activePlayerType === 'child') {
        btnChild.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg bg-white text-emerald-900 shadow-sm transition';
        btnParent.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg text-slate-600 hover:text-slate-900 transition';
      } else {
        btnChild.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg text-slate-600 hover:text-slate-900 transition';
        btnParent.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg bg-white text-emerald-900 shadow-sm transition';
      }
    }

    const btnRon = document.getElementById('winTabRon');
    const btnTsumo = document.getElementById('winTabTsumo');
    if (btnRon && btnTsumo) {
      if (this.activeWinType === 'ron') {
        btnRon.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg bg-white text-emerald-900 shadow-sm transition';
        btnTsumo.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg text-slate-600 hover:text-slate-900 transition';
      } else {
        btnRon.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg text-slate-600 hover:text-slate-900 transition';
        btnTsumo.className = 'flex-1 py-2 font-bold text-xs sm:text-sm rounded-lg bg-white text-emerald-900 shadow-sm transition';
      }
    }

    // 点数数値 & コール文面
    const scoreValEl = document.getElementById('scannedScoreValue');
    const speechEl = document.getElementById('scannedSpeechCall');
    const paymentDetailEl = document.getElementById('scannedPaymentDetail');

    let scoreText = '';
    let callText = '';
    let detailText = '';

    if (this.activePlayerType === 'child') {
      if (this.activeWinType === 'ron') {
        scoreText = `${Number(scores.childRon).toLocaleString()} 点`;
        callText = speech.childRon || `ロン！ ${scores.childRon}点です！`;
        detailText = '相手（放銃した人）が全額を支払います';
      } else {
        scoreText = `${scores.childTsumo} 点`;
        callText = speech.childTsumo || `ツモ！ ${scores.childTsumo}です！`;
        detailText = '親と子が分けて支払います（大きい数字が親の支払い）';
      }
    } else {
      if (this.activeWinType === 'ron') {
        scoreText = `${Number(scores.parentRon).toLocaleString()} 点`;
        callText = speech.parentRon || `ロン！ ${scores.parentRon}点です！`;
        detailText = '親の1.5倍！相手（放銃した人）が全額を支払います';
      } else {
        scoreText = `${scores.parentTsumo} 点`;
        callText = speech.parentTsumo || `ツモ！ ${scores.parentTsumo}です！`;
        detailText = '子3人全員から均等にもらいます';
      }
    }

    if (scoreValEl) scoreValEl.textContent = scoreText;
    if (speechEl) speechEl.textContent = callText;
    if (paymentDetailEl) paymentDetailEl.textContent = detailText;
  },

  // 牌修正ピッカーモーダル
  openTilePicker(index, isWinTile = false) {
    this.pickerTargetIndex = index;
    this.pickerIsWinTile = isWinTile;
    const modal = document.getElementById('tilePickerModal');
    if (!modal) return;
    this.renderPickerTiles();
    modal.classList.remove('hidden');
  },

  closeTilePicker() {
    const modal = document.getElementById('tilePickerModal');
    if (modal) modal.classList.add('hidden');
  },

  renderPickerTiles() {
    const container = document.getElementById('pickerTilesGrid');
    if (!container) return;
    container.innerHTML = '';

    const allTiles = [
      '1m','2m','3m','4m','5m','6m','7m','8m','9m','0m',
      '1p','2p','3p','4p','5p','6p','7p','8p','9p','0p',
      '1s','2s','3s','4s','5s','6s','7s','8s','9s','0s',
      '1z','2z','3z','4z','5z','6z','7z'
    ];

    allTiles.forEach((tile) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hover:scale-105 active:scale-95 transition flex items-center justify-center';
      btn.innerHTML = TileRenderer.render(tile, { mini: true });
      btn.onclick = () => this.applyTilePickerChoice(tile);
      container.appendChild(btn);
    });
  },

  applyTilePickerChoice(tile) {
    if (!this.currentResult) return;
    if (this.pickerIsWinTile) {
      this.currentResult.winTile = tile;
    } else {
      this.currentResult.handTiles[this.pickerTargetIndex] = tile;
    }
    this.closeTilePicker();
    this.renderResult(this.currentResult);
    this.showToast('牌を修正しました');
  },

  // 設定モーダル
  openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('hidden');
  },

  closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.add('hidden');
  },

  showDemoNotice() {
    const notice = document.getElementById('demoModeNotice');
    if (notice) notice.classList.remove('hidden');
  },

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl z-50 animate-pop-in pointer-events-none backdrop-blur-sm';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2200);
  }
};

if (typeof window !== 'undefined') {
  window.scanApp = scanApp;
  window.SAMPLE_DEMO_RESULT = SAMPLE_DEMO_RESULT;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => scanApp.init());
}

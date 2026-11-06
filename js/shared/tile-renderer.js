/**
 * 日本式SVG麻雀牌レンダラー＆牌配列ユーティリティ (js/shared/tile-renderer.js)
 * 対象牌コード:
 *   萬子: '1m'〜'9m', 赤5萬: '0m' or '5mr'
 *   筒子: '1p'〜'9p', 赤5筒: '0p' or '5pr'
 *   索子: '1s'〜'9s', 赤5索: '0s' or '5sr'
 *   字牌: '1z'(東), '2z'(南), '3z'(西), '4z'(北), '5z'(白), '6z'(發), '7z'(中)
 */
const TileRenderer = {
  width: 44,
  height: 62,

  render(tileCode, options = {}) {
    const isLarge = Boolean(options.large);
    const isMedium = Boolean(options.medium);
    const isMini = Boolean(options.mini);
    const isSideways = Boolean(options.isSideways);
    const interactive = Boolean(options.interactive);
    const highlight = Boolean(options.highlight);
    const isAgari = Boolean(options.isAgari);
    const badgeText = options.badge || (isAgari ? (options.agariText || (options.isRon ? 'ロン！' : 'ツモ！')) : '');

    let cls = 'mj-tile';
    if (isLarge) cls += ' mj-tile-lg';
    else if (isMedium) cls += ' mj-tile-md';
    else if (isMini) cls += ' mj-tile-xs';
    if (isSideways) cls += ' mj-tile-sideways';
    if (interactive) cls += ' mj-tile-interactive';
    if (highlight) cls += ' ring-2 ring-rose-500';

    const graphic = this.getTileGraphic(tileCode);
    const clickAttr = options.onClickAttr ? ` onclick="${options.onClickAttr}"` : '';

    return `
      <div class="${cls}" title="${this.getTileNameJa(tileCode)}"${clickAttr}>
        <svg viewBox="0 0 44 62" class="w-full h-full block pointer-events-none">
          <rect x="1" y="1" width="42" height="57" rx="4" fill="#ffffff" />
          ${graphic}
        </svg>
        ${badgeText ? `<span class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full shadow border border-white whitespace-nowrap">${badgeText}</span>` : ''}
      </div>
    `;
  },

  getTileGraphic(code) {
    if (!code) return '';
    const num = code.charAt(0);
    const suit = code.charAt(1);
    const isRed = code.endsWith('r') || num === '0';

    if (suit === 'z') return this.getHonorGraphic(num);
    if (suit === 'm') return this.getManzuGraphic(num, isRed);
    if (suit === 'p') return this.getPinzuGraphic(num, isRed);
    if (suit === 's') return this.getSouzuGraphic(num, isRed);
    return '';
  },

  getManzuGraphic(num, isRed) {
    const kanjiMap = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '七', '8': '八', '9': '九', '0': '五' };
    const k = kanjiMap[num] || num;
    const color = isRed ? '#dc2626' : '#1e293b';
    return `
      <g>
        <text x="22" y="23.5" font-family="'Noto Sans JP', serif" font-weight="900" font-size="21" fill="${color}" text-anchor="middle" dominant-baseline="central">${k}</text>
        <text x="22" y="44" font-family="'Noto Sans JP', serif" font-weight="900" font-size="18" fill="#dc2626" text-anchor="middle" dominant-baseline="central">萬</text>
        ${isRed ? '<circle cx="36" cy="10" r="3" fill="#f59e0b" stroke="#ffffff" stroke-width="0.8" />' : ''}
      </g>
    `;
  },

  getPinzuGraphic(num, isRed) {
    const blue = '#1d4ed8', red = '#dc2626', green = '#15803d';
    if (num === '1') {
      return `
        <g transform="translate(22, 29.5)">
          <circle cx="0" cy="0" r="15.8" fill="${isRed ? red : green}" />
          <circle cx="0" cy="0" r="11.8" fill="#ffffff" />
          <circle cx="0" cy="0" r="7.8" fill="${red}" />
          <circle cx="0" cy="0" r="3.6" fill="#ffffff" />
          <circle cx="0" cy="0" r="1.8" fill="${red}" />
        </g>
      `;
    }
    const c = (cx, cy, col) => `
      <circle cx="${cx}" cy="${cy}" r="4.3" fill="${col}" />
      <circle cx="${cx}" cy="${cy}" r="2.0" fill="#ffffff" />
      <circle cx="${cx}" cy="${cy}" r="1.0" fill="${col}" />
    `;
    if (num === '2') return `<g>${c(22, 17, blue)}${c(22, 42, blue)}</g>`;
    if (num === '3') return `<g>${c(14, 15, blue)}${c(22, 29.5, red)}${c(30, 44, green)}</g>`;
    if (num === '4') return `<g>${c(14, 18, blue)}${c(30, 18, green)}${c(14, 41, green)}${c(30, 41, blue)}</g>`;
    if (num === '5' || num === '0') {
      const col = isRed ? red : blue;
      return `
        <g>
          ${c(14, 16, col)}${c(30, 16, green)}${c(22, 29.5, red)}${c(14, 43, green)}${c(30, 43, col)}
          ${isRed ? '<circle cx="36" cy="10" r="3" fill="#f59e0b" stroke="#ffffff" stroke-width="0.8" />' : ''}
        </g>
      `;
    }
    if (num === '6') return `<g>${c(14, 15, green)}${c(30, 15, green)}${c(14, 29.5, red)}${c(30, 29.5, red)}${c(14, 44, red)}${c(30, 44, red)}</g>`;
    if (num === '7') return `<g>${c(12, 14, green)}${c(22, 18, green)}${c(32, 22, green)}${c(14, 34, red)}${c(30, 34, red)}${c(14, 46, red)}${c(30, 46, red)}</g>`;
    if (num === '8') return `<g>${c(14, 13.5, blue)}${c(30, 13.5, blue)}${c(14, 24, blue)}${c(30, 24, blue)}${c(14, 34.5, blue)}${c(30, 34.5, blue)}${c(14, 45, blue)}${c(30, 45, blue)}</g>`;
    if (num === '9') return `<g>${c(13, 15, blue)}${c(22, 15, blue)}${c(31, 15, blue)}${c(13, 29.5, red)}${c(22, 29.5, red)}${c(31, 29.5, red)}${c(13, 44, green)}${c(22, 44, green)}${c(31, 44, green)}</g>`;
    return '';
  },

  getSouzuGraphic(num, isRed) {
    const green = '#15803d', red = '#dc2626', blue = '#1d4ed8';
    if (num === '1') {
      return `
        <g>
          <circle cx="22" cy="17" r="5" fill="${green}" />
          <polygon points="14,17 18,15 18,19" fill="#f59e0b" />
          <circle cx="21" cy="16" r="1.3" fill="#ffffff" />
          <path d="M 22 22 C 13 24, 12 36, 17 44 L 27 44 C 32 36, 31 24, 22 22 Z" fill="${green}" />
          <path d="M 19 27 C 17 32, 18 38, 22 41 C 26 38, 27 32, 25 27 Z" fill="${red}" />
          <rect x="16" y="45" width="12" height="4" rx="1.5" fill="${green}" />
        </g>
      `;
    }
    const b = (x, y, h, col) => `
      <g transform="translate(${x}, ${y})">
        <rect x="-2.2" y="0" width="4.4" height="${h}" rx="1.5" fill="${col}" />
        <circle cx="0" cy="${h / 2}" r="1.4" fill="#ffffff" />
      </g>
    `;
    if (num === '2') return `<g>${b(22, 13, 14, green)}${b(22, 33, 14, green)}</g>`;
    if (num === '3') return `<g>${b(22, 13, 12, green)}${b(14, 34, 13, green)}${b(30, 34, 13, green)}</g>`;
    if (num === '4') return `<g>${b(14, 14, 13, green)}${b(30, 14, 13, green)}${b(14, 33, 13, green)}${b(30, 33, 13, green)}</g>`;
    if (num === '5' || num === '0') {
      const col = isRed ? red : green;
      return `
        <g>
          ${b(13, 14, 12, col)}${b(31, 14, 12, col)}${b(22, 24, 12, red)}${b(13, 34, 12, col)}${b(31, 34, 12, col)}
          ${isRed ? '<circle cx="36" cy="10" r="3" fill="#f59e0b" stroke="#ffffff" stroke-width="0.8" />' : ''}
        </g>
      `;
    }
    if (num === '6') return `<g>${b(13, 14, 12, green)}${b(22, 14, 12, green)}${b(31, 14, 12, green)}${b(13, 34, 12, green)}${b(22, 34, 12, green)}${b(31, 34, 12, green)}</g>`;
    if (num === '7') return `<g>${b(22, 11, 11, red)}${b(13, 25, 11, green)}${b(31, 25, 11, green)}${b(13, 39, 11, green)}${b(22, 39, 11, green)}${b(31, 39, 11, green)}</g>`;
    if (num === '8') return `<g>${b(14, 12, 10, green)}${b(30, 12, 10, green)}${b(18, 24, 10, green)}${b(26, 24, 10, green)}${b(18, 35, 10, green)}${b(26, 35, 10, green)}${b(14, 46, 10, green)}${b(30, 46, 10, green)}</g>`;
    if (num === '9') return `<g>${b(13, 13, 10, green)}${b(22, 13, 10, red)}${b(31, 13, 10, blue)}${b(13, 26, 10, green)}${b(22, 26, 10, red)}${b(31, 26, 10, blue)}${b(13, 39, 10, green)}${b(22, 39, 10, red)}${b(31, 39, 10, blue)}</g>`;
    return '';
  },

  getHonorGraphic(num) {
    const honorData = {
      '1': { text: '東', color: '#1e293b' },
      '2': { text: '南', color: '#1e293b' },
      '3': { text: '西', color: '#1e293b' },
      '4': { text: '北', color: '#1e293b' },
      '5': { isHaku: true },
      '6': { text: '發', color: '#15803d' },
      '7': { text: '中', color: '#dc2626' }
    };
    const h = honorData[num];
    if (!h) return '';
    if (h.isHaku) {
      return '<rect x="7" y="9" width="30" height="41" rx="3" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />';
    }
    return `<text x="22" y="31.5" font-family="'Noto Sans JP', serif" font-weight="900" font-size="27" fill="${h.color}" text-anchor="middle" dominant-baseline="central">${h.text}</text>`;
  },

  getTileNameJa(code) {
    if (!code) return '';
    const num = code.charAt(0);
    const suit = code.charAt(1);
    const isRed = code.endsWith('r') || num === '0';
    const n = num === '0' ? '5' : num;

    const numKana = {
      '1': 'イー',
      '2': 'リャン',
      '3': 'サン',
      '4': 'スー',
      '5': 'ウー',
      '6': 'ロー',
      '7': 'チー',
      '8': 'パー',
      '9': 'キュー'
    };

    const kanjiNums = {
      '1': '一',
      '2': '二',
      '3': '三',
      '4': '四',
      '5': '五',
      '6': '六',
      '7': '七',
      '8': '八',
      '9': '九'
    };

    if (suit === 'm') {
      const kana = isRed ? '赤ウーマン' : (numKana[n] || n) + 'マン';
      const paren = isRed ? '赤五萬' : (kanjiNums[n] || n) + '萬';
      return `${kana}（${paren}）`;
    }
    if (suit === 'p') {
      const kana = isRed ? '赤ウーピン' : (numKana[n] || n) + 'ピン';
      const paren = isRed ? '赤5筒' : `${n}筒`;
      return `${kana}（${paren}）`;
    }
    if (suit === 's') {
      const kana = isRed ? '赤ウーソー' : (numKana[n] || n) + 'ソー';
      const paren = isRed ? '赤5索' : `${n}索`;
      return `${kana}（${paren}）`;
    }
    if (suit === 'z') {
      const zMap = {
        '1': '東（トン）',
        '2': '南（ナン）',
        '3': '西（シャー）',
        '4': '北（ペー）',
        '5': '白（ハク）',
        '6': '發（ハツ）',
        '7': '中（チュン）'
      };
      return zMap[n] || code;
    }
    return code;
  },

  getNextDoraCode(ind) {
    if (!ind || ind.length < 2) return '';
    const rawN = ind.charAt(0) === '0' ? 5 : Number(ind.charAt(0));
    const s = ind.charAt(1);
    if (s === 'm' || s === 'p' || s === 's') {
      const nextN = rawN >= 9 ? 1 : rawN + 1;
      return nextN + s;
    }
    if (s === 'z') {
      if (rawN >= 1 && rawN <= 4) return (rawN === 4 ? 1 : rawN + 1) + 'z';
      if (rawN >= 5 && rawN <= 7) return (rawN === 7 ? 5 : rawN + 1) + 'z';
    }
    return '';
  }
};

function sortTiles(tiles) {
  const suitOrder = { m: 1, p: 2, s: 3, z: 4 };
  return [...tiles].sort((a, b) => {
    const sa = suitOrder[a.charAt(1)] || 9;
    const sb = suitOrder[b.charAt(1)] || 9;
    if (sa !== sb) return sa - sb;
    const na = a.charAt(0) === '0' ? 5.5 : Number(a.charAt(0));
    const nb = b.charAt(0) === '0' ? 5.5 : Number(b.charAt(0));
    return na - nb;
  });
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

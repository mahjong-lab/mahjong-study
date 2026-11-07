/**
 * SNS / LINE シェアヘルパー (js/shared/share-helper.js)
 * LINEで送る・Xでポスト・結果テキストコピー
 */
const ShareHelper = {
  shareToLine({ text, url }) {
    const targetUrl = url || window.location.href.split('?')[0];
    const fullText = `${text}\n${targetUrl}`;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(fullText)}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  },

  shareToX({ text, url, hashtags = ['麻雀ファーストステップ', '麻雀初心者'] }) {
    const targetUrl = url || window.location.href.split('?')[0];
    let xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(targetUrl)}`;
    if (hashtags && hashtags.length > 0) {
      xUrl += `&hashtags=${encodeURIComponent(hashtags.join(','))}`;
    }
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  },

  copyResult({ text, url, btnElement }) {
    const targetUrl = url || window.location.href.split('?')[0];
    const fullText = `${text}\n${targetUrl}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        this.showCopyFeedback(btnElement);
      }).catch(() => {
        this.fallbackCopy(fullText, btnElement);
      });
    } else {
      this.fallbackCopy(fullText, btnElement);
    }
  },

  fallbackCopy(text, btnElement) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      this.showCopyFeedback(btnElement);
    } catch (e) {}
    document.body.removeChild(ta);
  },

  showCopyFeedback(btnElement) {
    if (!btnElement) return;
    const origHtml = btnElement.innerHTML;
    btnElement.innerHTML = '<span>✅ コピーしました！✨</span>';
    btnElement.classList.add('bg-emerald-100', 'text-emerald-800', 'border-emerald-300');
    setTimeout(() => {
      btnElement.innerHTML = origHtml;
      btnElement.classList.remove('bg-emerald-100', 'text-emerald-800', 'border-emerald-300');
    }, 2000);
  }
};

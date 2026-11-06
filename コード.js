/**
 * 麻雀トレーニングボード - Google Apps Script
 *
 * 特徴:
 * 1. 挫折知らずのスモールステップ学習（1セッション3〜5問）
 * 2. 牌姿グラフィックによる直感認識
 * 3. 常設カンニングペーパー（チートシート）
 * 4. 進捗・レベル自動保存（LocalStorage + GASプロパティ/シート連携対応）
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  
  // パラメータがあればテンプレートに渡す
  template.mode = (e && e.parameter && e.parameter.mode) ? e.parameter.mode : 'all';

  return template.evaluate()
    .setTitle('麻雀トレーニングボード 🀄')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ユーザーの進捗データを取得（サーバー同期用）
 */
function getUserProgress() {
  try {
    var userProps = PropertiesService.getUserProperties();
    var data = userProps.getProperty('MAHJONG_PROGRESS');
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Progress fetch error:', err);
    return null;
  }
}

/**
 * ユーザーの進捗データを保存（サーバー同期用）
 */
function saveUserProgress(progressJson) {
  try {
    var userProps = PropertiesService.getUserProperties();
    userProps.setProperty('MAHJONG_PROGRESS', typeof progressJson === 'string' ? progressJson : JSON.stringify(progressJson));
    return { success: true, timestamp: new Date().toISOString() };
  } catch (err) {
    console.error('Progress save error:', err);
    return { success: false, error: err.toString() };
  }
}

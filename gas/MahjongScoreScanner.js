/**
 * 麻雀手牌カメラ点数スキャナー - Google Apps Script (GAS) バックエンド
 *
 * 【導入手順 (3分で完了)】
 * 1. Google Drive (または script.google.com) で「新しいプロジェクト」を作成。
 * 2. このコードをそのまま「コード.gs」に貼り付ける。
 * 3. Google AI Studio (https://aistudio.google.com/) で無料の Gemini APIキーを発行。
 * 4. GASの画面左側 ⚙「プロジェクトの設定」>「スクリプト プロパティ」を開き、
 *    - プロパティ: GEMINI_API_KEY
 *    - 値: (あなたのAPIキー)
 *    を追加して保存。
 * 5. 画面右上の「デプロイ」>「新しいデプロイ」をクリック:
 *    - 種類の選択: 「ウェブアプリ」
 *    - 次のユーザーとして実行: 「自分」
 *    - アクセスできるユーザー: 「全員 (Anyone)」※超重要！
 * 6. 発行された「ウェブアプリ URL」をコピーし、Webアプリ (scan.html) の設定欄に貼り付ければ完了！
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ error: '画像データが届いていません。' }, 400);
    }

    const requestData = JSON.parse(e.postData.contents);
    const base64Data = requestData.image; // Base64データ（data:image/jpeg;base64,... または生base64）
    const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      return createJsonResponse({
        error: 'GASのスクリプトプロパティに GEMINI_API_KEY が設定されていません。'
      }, 500);
    }

    // 牌コード定義: 
    // 萬子: 1m-9m, 筒子: 1p-9p, 索子: 1s-9s, 字牌: 1z(東), 2z(南), 3z(西), 4z(北), 5z(白), 6z(發), 7z(中)
    // 赤ドラ: 0m(赤5m), 0p(赤5p), 0s(赤5s)
    const prompt = `
あなたはプロの麻雀審判・点数計算エキスパートです。
提供された画像に写っている麻雀の手牌（14枚、または鳴き牌を含めたアガリ形）を視覚的に正確に認識し、役の判定・飜数・符・点数を計算してください。

【牌コード仕様】
- マンズ: 1m, 2m, 3m, 4m, 5m, 6m, 7m, 8m, 9m (赤5萬は 0m)
- ピンズ: 1p, 2p, 3p, 4p, 5p, 6p, 7p, 8p, 9p (赤5筒は 0p)
- ソーズ: 1s, 2s, 3s, 4s, 5s, 6s, 7s, 8s, 9s (赤5索は 0s)
- 字牌: 1z(東), 2z(南), 3z(西), 4z(北), 5z(白), 6z(發), 7z(中)

【出力形式】
必ず以下のJSON形式のみを返してください（Markdownのバッククォート \`\`\`json も含めて構いません）：
{
  "isValidAgari": true, // アガリ形が成立しているかどうか
  "handTiles": ["1m", "2m", "3m", ...], // 門前の手牌（13枚またはアガリ牌除いた手牌）
  "winTile": "4m", // アガリ牌（右端の牌または判別できる牌）
  "melds": [["1s", "2s", "3s"]], // 鳴いている副露ブロック（鳴きがない場合は空配列 []）
  "doraIndicator": "9p", // もしドラ表示牌やドラが写っていれば牌コード、なければ null
  "doraTiles": ["1p"], // ドラそのものの牌コード配列
  "han": 4, // 合計飜数
  "fu": 30, // 符（わからない・満貫以上なら 30 または適切な符）
  "scoreTitle": "満貫", // 満貫, 跳満, 倍満, 三倍満, 役満, または空文字
  "yakuList": [
    { "name": "立直", "han": 1 },
    { "name": "断么九", "han": 1 },
    { "name": "平和", "han": 1 },
    { "name": "ドラ", "han": 1 }
  ],
  "scores": {
    "childRon": 7700, // 子のロンアガリ点数（例: 7700 または 8000）
    "childTsumo": "2000・4000", // 子のツモアガリ点数（親の支払い・子の支払い）
    "parentRon": 11600, // 親のロンアガリ点数（例: 11600 または 12000）
    "parentTsumo": "3900オール" // 親のツモアガリ点数
  },
  "speechGuide": {
    "childRon": "ロン！ 7700点です！",
    "childTsumo": "ツモ！ 2000・4000（ニセン・ヨンセン）です！",
    "parentRon": "ロン！ 11600点です！",
    "parentTsumo": "ツモ！ 3900オールです！"
  },
  "advice": "タンヤオ・ピンフ・ドラで安定の満貫クラス！落ち着いてコールしましょう。"
}

※もし手牌が不鮮明、または牌が不足している場合は:
{
  "isValidAgari": false,
  "errorMessage": "牌が一部見えにくいか、14枚揃っていないようです。明るい場所で手牌を整えてもう一度撮影してください。"
}
`;

    // Gemini 2.0 Flash (高速・高精度・マルチモーダル対応)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: cleanBase64
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        response_mime_type: 'application/json'
      }
    };

    const response = UrlFetchApp.fetch(geminiUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (statusCode !== 200) {
      return createJsonResponse({
        error: `Gemini API エラー (${statusCode}): ${responseText}`
      }, statusCode);
    }

    const geminiResult = JSON.parse(responseText);
    const candidate = geminiResult.candidates && geminiResult.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      return createJsonResponse({ error: 'Geminiから解析結果が返りませんでした。' }, 500);
    }

    const rawText = candidate.content.parts[0].text;
    const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const finalResult = JSON.parse(cleanJsonStr);

    return createJsonResponse(finalResult, 200);

  } catch (err) {
    return createJsonResponse({ error: 'GAS実行時例外: ' + err.message }, 500);
  }
}

// GETリクエストで導通確認（ブラウザでURL直接開いた時にOKを返す）
function doGet(e) {
  return createJsonResponse({
    status: 'ok',
    message: '麻雀手牌カメラ点数スキャナー GAS API は正常に稼働しています。POSTで画像を送信してください。'
  }, 200);
}

function createJsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

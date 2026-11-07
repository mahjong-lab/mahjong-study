/**
 * 超入門編『麻雀ファーストステップ』問題データ定義 (js/data/beginner-questions.js)
 *
 * 【問題を追加する方法】
 * 下の STAGE_QUESTIONS の対象ステージ配列（stage1〜stage6）にオブジェクトを1つ追加するだけで、
 * 画面上の問題数表示やランダム出題プールに自動反映されます！
 *
 * 利用可能な問題タイプ (type):
 *  - "tile-choice"   : 大きな牌ボタンから選ぶ（tileOptions: [{ tile: '1s', correct: true }, ...]）
 *                      ※ doraIndicator: '4m' を付けると王牌5枚めくり表示になります
 *  - "slot-fill"     : 穴埋めパズル（slots: ['2p', '3p', '?'], tileOptions: [...]）
 *  - "tap-hand"      : 並んだ牌を直接タップ（hand: [...], correctTiles: ['9m']）
 *  - "discard-8"     : 8枚ミニ麻雀・1枚捨ててテンパイ（hand: [8枚], correctTiles: ['9p'], waitDesc: '...'）
 *  - "scaffold-wait" : 13枚待ち当て・補助輪対応（defaultScaffold: false, blocks: [...], options: [...]）
 *  - "text-choice"   : 参考牌＋2〜3択ボタン（boardTiles: [...], options: [{ text: '...', correct: true }, ...]）
 */

const STAGES_META = [
  {
    key: "stage1",
    num: "ステップ 1",
    icon: "🐣",
    title: "牌の絵柄と「端っこ」仕分け",
    badge: "まずは3秒！",
    desc: "鳥の牌＝1索？赤ドラって何？後でタンヤオが一瞬で見抜ける目を養います。"
  },
  {
    key: "stage2",
    num: "ステップ 2",
    icon: "🧩",
    title: "3枚ブロック＆アタマパズル",
    badge: "穴埋めパズル",
    desc: "空欄［？］に牌をはめて「階段（順子）」と「同じ牌3枚（刻子）」を完成させよう！"
  },
  {
    key: "stage3",
    num: "ステップ 3",
    icon: "🗑️",
    title: "1枚ポイッ！「8枚ミニ麻雀」",
    badge: "手牌をタップ！",
    desc: "14枚ではなく半分の8枚だけ！仲間はずれの不要牌を1枚タップして捨てよう。"
  },
  {
    key: "stage4",
    num: "ステップ 4",
    icon: "🚲",
    title: "13枚「待ち牌」あて（補助輪つき）",
    badge: "補助輪ON/OFF",
    desc: "まずは補助輪OFFの実戦並びで挑戦！迷ったらワンタップで補助輪をONにできます。"
  },
  {
    key: "stage5",
    num: "ステップ 5",
    icon: "🛡️",
    title: "実戦の約束「3大武器とフリテン」",
    badge: "ルール攻略",
    desc: "「揃ったのにロンが出ない！」をゼロにする重要ルールを体感でマスター！"
  },
  {
    key: "stage6",
    num: "ステップ 6",
    icon: "⚡",
    title: "合体！「ポン・チー・カン入門」",
    badge: "新ステージ！",
    desc: "相手の捨て牌をもらってブロック完成！鳴きのルールと優先順位を楽しく習得。"
  }
];

const STAGE_QUESTIONS = {
  // ==========================================================================
  // Stage 1: 牌の絵柄と「端っこ」仕分け（現在 22 問）
  // ==========================================================================
  stage1: [
    {
      id: "s1-1",
      type: "tile-choice",
      callSound: "tsumo",
      modeLabel: "牌えらび",
      question: "この中で数字の「イーソー（1索 / 鳥）」はどれ？",
      subtext: "麻雀で1つだけ「鳥のイラスト」になっている有名な牌です！",
      boardNote: "下の3枚の牌からタップして選ぼう！",
      tileOptions: [
        { tile: "1s", correct: true },
        { tile: "5z", correct: false },
        { tile: "7z", correct: false }
      ],
      explanation: "大正解！鳥の絵は字牌ではなく「ソーズ（索子）の1」です。これさえ知っていればもう迷いません！",
      term: {
        word: "イーソー（1索）",
        reading: "イーソー",
        tiles: ["1s"],
        desc: "竹の数牌（索子）の「1」のこと。麻雀牌の中でこれ1種類だけ鳥（孔雀・鳳凰）のイラストで描かれています。"
      }
    },
    {
      id: "s1-2",
      type: "tile-choice",
      callSound: "chi",
      modeLabel: "牌えらび",
      question: "マンズ（萬子）は漢数字で書かれています。「ウーマン（五萬）」はどれ？",
      subtext: "上の漢字を読むだけでOK！",
      boardNote: "下の3枚から「ウーマン（五萬）」を選ぼう！",
      tileOptions: [
        { tile: "5m", correct: true },
        { tile: "4m", correct: false },
        { tile: "7m", correct: false }
      ],
      explanation: "バッチリ！「五」に「萬」でウーマン（五萬）です。",
      term: {
        word: "マンズ（萬子）",
        reading: "マンズ",
        tiles: ["1m", "5m", "9m"],
        desc: "漢数字の「一〜九」に「萬」と書かれた数牌グループ。1〜9までの9種類あります。"
      }
    },
    {
      id: "s1-3",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "牌えらび",
      question: "丸い模様の「ピンズ（筒子）」で、数字の『イーピン（1筒）』はどれ？",
      subtext: "丸の数に注目！1個だけ特大サイズで描かれています。",
      boardNote: "「イーピン（1筒）」をタップ！",
      tileOptions: [
        { tile: "1p", correct: true },
        { tile: "4p", correct: false },
        { tile: "8p", correct: false }
      ],
      explanation: "正解！大きな丸がドンと1つ描かれているのが「イーピン（1筒）」です！",
      term: {
        word: "ピンズ（筒子）",
        reading: "ピンズ",
        tiles: ["1p", "3p", "5p"],
        desc: "丸い模様の数で「1〜9」を表す数牌グループ。丸の数をそのまま数えれば数字が分かります！"
      }
    },
    {
      id: "s1-4",
      type: "tile-choice",
      callSound: "ron",
      modeLabel: "牌えらび",
      question: "竹の模様の「ソーズ（索子）」で、一番大きい端っこの『キューソー（9索）』はどれ？",
      subtext: "3本×3段で竹が9本並んでいるカラフルな牌です！",
      boardNote: "「キューソー（9索）」をタップ！",
      tileOptions: [
        { tile: "9s", correct: true },
        { tile: "6s", correct: false },
        { tile: "2s", correct: false }
      ],
      explanation: "大正解！緑・赤・青で3本ずつ計9本並んでいるのが「キューソー（9索）」です。",
      term: {
        word: "ソーズ（索子）",
        reading: "ソーズ",
        tiles: ["1s", "5s", "9s"],
        desc: "竹の本数で「1〜9」を表す数牌グループ。1索だけは鳥の絵柄、2〜9索は竹の本数で表します。"
      }
    },
    {
      id: "s1-5",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "牌えらび",
      question: "3枚集めるだけで役になるラッキー牌「白・發・中」。この中で『白（ハク）』はどれ？",
      subtext: "日本の麻雀では、文字が何も彫られていない真っ白な牌です！",
      boardNote: "「白（ハク）」をタップしよう！",
      tileOptions: [
        { tile: "5z", correct: true },
        { tile: "1p", correct: false },
        { tile: "2z", correct: false }
      ],
      explanation: "正解！真っ白でツヤツヤな牌が「白（ハク）」です。3枚集めればポンしてもアガれます！",
      term: {
        word: "サンゲンパイ（三元牌）",
        reading: "サンゲンパイ",
        tiles: ["5z", "6z", "7z"],
        desc: "「白（ハク）・發（ハツ）・中（チュン）」の3種類の字牌。どれでも3枚揃えれば無条件で1飜（役牌）がつきます！"
      }
    },
    {
      id: "s1-6",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "牌えらび",
      question: "数字ではないので階段（1-2-3）が作れない『ジハイ（字牌）』はどれ？",
      subtext: "方角（東南西北）や白發中がジハイ（字牌）です。",
      boardNote: "「ジハイ（字牌）」を1枚選ぼう！",
      tileOptions: [
        { tile: "1z", correct: true },
        { tile: "1m", correct: false },
        { tile: "9p", correct: false }
      ],
      explanation: "ナイス！「東（トン）」はジハイです。ジハイは同じ牌を2枚（アタマ）か3枚集める使い方しかできません。",
      term: {
        word: "ジハイ（字牌）",
        reading: "ジハイ",
        tiles: ["1z", "2z", "6z", "7z"],
        desc: "東南西北と白發中の計7種類。数字ではないため階段（順子）は作れず、同じ牌を重ねて使います。"
      }
    },
    {
      id: "s1-7",
      type: "tile-choice",
      callSound: "kan",
      modeLabel: "ラッキー牌！",
      question: "アガったときに持っているだけで点数がアップする特別な『赤ウーピン（赤5筒）』はどれ？",
      subtext: "普通のウーピン（5筒）と形は同じですが、全体が赤く塗られています！",
      boardNote: "「赤ウーピン（赤5筒）」をタップしよう！",
      tileOptions: [
        { tile: "0p", correct: true },
        { tile: "5p", correct: false },
        { tile: "3p", correct: false }
      ],
      explanation: "バッチリ！真っ赤な「赤ウーピン（赤5筒）」は赤ドラと呼ばれ、通常の5筒とまったく同じように使えて点数もアップするお得牌です！",
      term: {
        word: "アカウーピン（赤5筒）",
        reading: "アカウーピン",
        tiles: ["0m", "0p", "0s"],
        desc: "五萬・5筒・5索に1枚ずつ入っている赤い5の牌。持っているだけでアガリ点が1段階アップします！"
      }
    },
    {
      id: "s1-8",
      type: "tile-choice",
      callSound: "chi",
      modeLabel: "牌えらび",
      question: "端っこ（1・9）でも字牌でもない、『真ん中の数字（2〜8）』はどれ？",
      subtext: "ヒント：鳥の絵が「何の数字」だったか思い出して！",
      boardNote: "2〜8の牌をタップ！",
      tileOptions: [
        { tile: "4p", correct: true },
        { tile: "1s", correct: false },
        { tile: "9m", correct: false }
      ],
      explanation: "大正解！丸が4つの「スーピン（4筒）」が真ん中の牌です（鳥はイーソー（1索）なので端っこの牌！）。2〜8だけ集めると「タンヤオ」になります！",
      term: {
        word: "チュンチャンパイ（中張牌）",
        reading: "チュンチャンパイ",
        tiles: ["2m", "4p", "7s"],
        desc: "数牌のうち、端っこの1・9を除いた「2〜8」の真ん中の牌のこと。階段が作りやすく「タンヤオ」にも使えます！"
      }
    },
    {
      id: "s1-9",
      type: "tap-hand",
      callSound: "ron",
      modeLabel: "手牌をタップ！",
      question: "5枚の中に1枚だけ「端っこの牌（1または9）」が混ざっています。タップして見つけよう！",
      subtext: "上の並んでいる牌を直接指でタップしてください！",
      hand: ["2m", "3m", "6p", "1s", "7s"],
      correctTiles: ["1s"],
      caption: "👆 上の5枚の中から直接タップ！",
      explanation: "お見事！！鳥のイラストは「イーソー（1索）」なので端っこの牌ですね。これが見抜ければタンヤオ作りはもう完璧です！",
      term: {
        word: "ヤオチューハイ（么九牌）",
        reading: "ヤオチューパイ",
        tiles: ["1m", "9p", "1s", "7z"],
        desc: "数字の端っこである「1・9」と「字牌」をまとめた総称。タンヤオを作るときはこの牌をすべて手牌から外します。"
      }
    },
    {
      id: "s1-10",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "牌えらび",
      question: "この中でサンゲンパイ（三元牌）の「發（ハツ / 緑の文字牌）」はどれ？",
      subtext: "3枚集めるだけで役がつく、緑色の頼もしい字牌です！",
      boardNote: "緑色の漢字に注目！",
      tileOptions: [
        { tile: "6z", correct: true },
        { tile: "8s", correct: false },
        { tile: "7z", correct: false }
      ],
      explanation: "大正解！緑色の漢字は「發（ハツ）」です。白・發・中の3兄弟は、ポンしても1飜つく初心者の強い味方です！",
      term: {
        word: "ハツ（發）",
        reading: "ハツ",
        tiles: ["6z", "6z", "6z"],
        desc: "三元牌（白・發・中）の1つ。緑色の漢字が目印で、3枚揃えれば無条件で1飜の役になります！"
      }
    },
    {
      id: "s1-11",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "牌えらび",
      question: "この中でサンゲンパイの「中（チュン / 赤い文字牌）」はどれ？",
      subtext: "「ちゅん」と読みます！マンズ（萬子）の漢数字と間違えないように注意！",
      boardNote: "真ん中に線が入った赤い一文字！",
      tileOptions: [
        { tile: "7z", correct: true },
        { tile: "1m", correct: false },
        { tile: "0p", correct: false }
      ],
      explanation: "バッチリ！真っ赤な「中」はチュンと読みます。3枚集めればいつでも役牌（1飜）になります！",
      term: {
        word: "チュン（中）",
        reading: "チュン",
        tiles: ["7z", "7z", "7z"],
        desc: "三元牌（白・發・中）の1つ。「なか」ではなく「チュン」と読み、3枚集めれば1飜確定です！"
      }
    },
    {
      id: "s1-12",
      type: "tile-choice",
      callSound: "tsumo",
      modeLabel: "読み方クイズ！",
      question: "方角のジハイ（字牌）で「シャー」と読む牌はどれ？",
      subtext: "「トン・ナン・〇〇・ペー」の3番目に来る方角です！",
      boardNote: "東（トン）・南（ナン）の次を思い出そう！",
      tileOptions: [
        { tile: "3z", correct: true },
        { tile: "1z", correct: false },
        { tile: "4z", correct: false }
      ],
      explanation: "正解！「西」はシャーと読みます。東（トン）・南（ナン）・西（シャー）・北（ペー）の順で並びます！",
      term: {
        word: "フォンパイ（風牌 / 東南西北）",
        reading: "トン・ナン・シャー・ペー",
        tiles: ["1z", "2z", "3z", "4z"],
        desc: "方角を表す4種類の字牌。「ひがし・みなみ…」ではなく「トン・ナン・シャー・ペー」と呼びます！"
      }
    },
    {
      id: "s1-13",
      type: "tile-choice",
      callSound: "tsumo",
      modeLabel: "読み方クイズ！",
      question: "方角のジハイ（字牌）で「ペー」と読む牌はどれ？",
      subtext: "「トン・ナン・シャー・〇〇」の最後に来る4番目の方角です！",
      boardNote: "東・南・西の次の漢字を探そう！",
      tileOptions: [
        { tile: "4z", correct: true },
        { tile: "2z", correct: false },
        { tile: "3z", correct: false }
      ],
      explanation: "ナイス！「北」はペーと読みます。ドラ表示牌で「北」がめくれたときは、最初に戻って「東」がドラになります！",
      term: {
        word: "ペー（北）",
        reading: "ペー",
        tiles: ["4z"],
        desc: "風牌の4番目（東→南→西→北）。北家の人が3枚集めると自風の役がつきます！"
      }
    },
    {
      id: "s1-14",
      type: "tile-choice",
      callSound: "ron",
      modeLabel: "数字よみとり！",
      question: "緑の竹がM字のように並んだこの牌、ソーズの「パーソー（8索）」はどれ？",
      subtext: "チーソー（7索）・パーソー（8索）・キューソー（9索）は本数が多いので形で覚えると一瞬です！",
      boardNote: "上下に4本ずつ（計8本）並んでいる牌！",
      tileOptions: [
        { tile: "8s", correct: true },
        { tile: "6s", correct: false },
        { tile: "9s", correct: false }
      ],
      explanation: "お見事！斜めの竹が入った8本組が「パーソー（8索）」です。ローソー（6索）やキューソー（9索）と見分けられれば完璧！",
      term: {
        word: "パーソー（8索）",
        reading: "パーソー",
        tiles: ["8s"],
        desc: "竹が8本描かれた数牌。2〜8の内側なのでタンヤオにも使える便利な牌です！"
      }
    },
    {
      id: "s1-15",
      type: "tile-choice",
      callSound: "tsumo",
      modeLabel: "数字よみとり！",
      question: "赤い竹が上に1本乗っている「チーソー（7索）」はどれ？",
      subtext: "上に1本＋下に6本＝合計7本です！",
      boardNote: "一番上の赤い1本が目印！",
      tileOptions: [
        { tile: "7s", correct: true },
        { tile: "5s", correct: false },
        { tile: "3s", correct: false }
      ],
      explanation: "バッチリ！上に赤い竹が1本ちょこんと乗っているのが「7索（チーソー）」です！",
      term: {
        word: "チーソー（7索）",
        reading: "チーソー",
        tiles: ["7s"],
        desc: "上に赤1本＋下に緑6本で「7」を表す索子の牌。絵柄の特徴を掴めば数えなくても一目で分かります！"
      }
    },
    {
      id: "s1-16",
      type: "tile-choice",
      callSound: "ron",
      modeLabel: "グループ分け！",
      question: "この中で「マンズ（萬子）」のグループの牌はどれ？",
      subtext: "漢数字＋「萬」が書かれたグループです！",
      boardNote: "ピンズ（筒子）でもソーズ（索子）でもない数牌！",
      tileOptions: [
        { tile: "3m", correct: true },
        { tile: "3p", correct: false },
        { tile: "3s", correct: false }
      ],
      explanation: "大正解！「サンマン（三萬）」がマンズグループです。同じ「3」でも種類が違うと一緒に階段にはできません！",
      term: {
        word: "マンズ（萬子）",
        reading: "マンズ",
        tiles: ["1m", "3m", "9m"],
        desc: "漢数字と「萬」で1〜9を表す数牌グループ。一萬（イーマン）〜九萬（キューマン）まであります。"
      }
    },
    {
      id: "s1-17",
      type: "tile-choice",
      callSound: "tsumo",
      modeLabel: "グループ分け！",
      question: "この中で「ピンズ（筒子）」のグループの牌はどれ？",
      subtext: "丸いボール模様のグループです！",
      boardNote: "丸いボールの模様が描かれた牌を探そう！",
      tileOptions: [
        { tile: "4p", correct: true },
        { tile: "4m", correct: false },
        { tile: "4s", correct: false }
      ],
      explanation: "完璧！丸い模様はすべて「ピンズ（筒子）」グループです！",
      term: {
        word: "ピンズ（筒子）",
        reading: "ピンズ",
        tiles: ["2p", "4p", "8p"],
        desc: "丸の数で1〜9を表す一番見やすい数牌グループ。1筒（イーピン）〜9筒（キューピン）まであります。"
      }
    },
    {
      id: "s1-18",
      type: "tile-choice",
      callSound: "ron",
      modeLabel: "ボーナス牌！",
      question: "持っているだけでアガった時の点数がアップする「赤ウーマン（赤五萬）」はどれ？",
      subtext: "数字の5全体が赤く、右上にキラリと印がついています！",
      boardNote: "普通の黒いウーマン（五萬）と見比べてみよう！",
      tileOptions: [
        { tile: "0m", correct: true },
        { tile: "5m", correct: false },
        { tile: "7z", correct: false }
      ],
      explanation: "大正解！真っ赤な「赤ウーマン（赤五萬）」は、普通のウーマンと同じ数字の「5」として使えて、さらにアガると1飜ボーナスがつくお宝牌です！",
      term: {
        word: "アカウーマン（赤五萬）",
        reading: "アカウーマン",
        tiles: ["0m", "0p", "0s"],
        desc: "五萬・5筒・5索に1枚ずつ入っている赤いボーナス牌。見つけたら大事に使いましょう！"
      }
    },
    {
      id: "s1-19",
      type: "tap-hand",
      callSound: "ron",
      modeLabel: "手牌をタップ！",
      question: "5枚の中に1枚だけ「タンヤオの邪魔になる端っこ牌（1または9）」があります。タップして見つけよう！",
      subtext: "「2〜8」以外の数字が1枚混ざっています！",
      hand: ["3m", "9m", "4p", "6s", "2p"],
      correctTiles: ["9m"],
      caption: "👆 端っこの牌（1または9）をタップ！",
      explanation: "よく見つけました！「キューマン（九萬）」は端っこの9なのでタンヤオには使えません！",
      term: {
        word: "ロウトウハイ（老頭牌 / 1・9の数牌）",
        reading: "ロウトウハイ",
        tiles: ["1m", "9m", "1p", "9s"],
        desc: "数牌の両端である「1」と「9」の牌のこと。片側からしか階段を作れないため、2〜8より少し使いにくい牌です。"
      }
    },
    {
      id: "s1-20",
      type: "tap-hand",
      callSound: "tsumo",
      modeLabel: "手牌をタップ！",
      question: "5枚の中に1枚だけ数字ではない「ジハイ（字牌）」が混ざっています。タップして見つけよう！",
      subtext: "白い枠だけの牌も立派な字牌です！",
      hand: ["2m", "5p", "5z", "7s", "4s"],
      correctTiles: ["5z"],
      caption: "👆 数字ではない字牌をタップ！",
      explanation: "バッチリ！何もない真っ白な牌は「白（ハク）」という字牌なので、タンヤオには入れられません（3枚集めれば役牌になります！）。",
      term: {
        word: "ハク（白）",
        reading: "ハク",
        tiles: ["5z", "5z", "5z"],
        desc: "日本麻雀では模様がない真っ白な牌。3枚揃えればポンしても1飜の役牌になります！"
      }
    },
    {
      id: "s1-21",
      type: "tap-hand",
      callSound: "ron",
      modeLabel: "手牌をタップ！",
      question: "5枚の中に1枚だけピンズの「一番小さい数字（1）」が混ざっています！タップして見つけよう！",
      subtext: "大きな花丸のような牌は数字の「1」です！",
      hand: ["6m", "1p", "5p", "3s", "8s"],
      correctTiles: ["1p"],
      caption: "👆 ピンズの一番小さい数字（1）をタップ！",
      explanation: "正解！大きな丸1つの「イーピン（1筒）」は端っこの1なので、タンヤオを目指すときは最初に捨てる候補になります！",
      term: {
        word: "タンヤオの条件",
        reading: "2〜8の数牌のみ",
        tiles: ["2m", "5p", "8s"],
        desc: "手牌14枚すべてを「2〜8の数牌」だけで作ること。1筒・1索・9萬・字牌を全部切ればOKです！"
      }
    },
    {
      id: "s1-22",
      type: "text-choice",
      callSound: "tsumo",
      modeLabel: "数字のクイズ！",
      question: "麻雀の数牌（マンズ・ピンズ・ソーズ）に存在する数字は「何番から何番まで」？",
      subtext: "トランプは1〜13までありますが、麻雀は…？",
      boardTiles: ["1m", "5p", "9s"],
      caption: "一番小さい数字と一番大きい数字",
      options: [
        { text: "⭕ 「1」から「9」まで！（0や10はない）", correct: true },
        { text: "❌ 「0」から「10」まである", correct: false }
      ],
      explanation: "大正解！麻雀の数字は必ず「1〜9」だけです。0や10は存在しません！",
      term: {
        word: "パイの種類数（牌の分類）",
        reading: "全34種類・136枚",
        tiles: ["1m", "9p", "1z", "7z"],
        desc: "萬子9種＋筒子9種＋索子9種＋字牌7種＝合計34種類。各4枚ずつあるので全部で136枚使います！"
      }
    }
  ],

  // ==========================================================================
  // Stage 2: 3枚ブロック＆アタマパズル（現在 20 問）
  // ==========================================================================
  stage2: [
    {
      id: "s2-1",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "穴埋めパズル",
      question: "空欄［ ？ ］に牌をはめて、同じ種類の「数字の階段（3枚組）」を完成させよう！",
      subtext: "丸いボールのピンズ（筒子）が「2・3」と並んでいます。",
      slots: ["2p", "3p", "?"],
      tileOptions: [
        { tile: "4p", correct: true },
        { tile: "4s", correct: false },
        { tile: "8p", correct: false }
      ],
      explanation: "カチャッ！同じピンズ（筒子）で「2・3・4」の階段ブロックが完成しました！",
      term: {
        word: "シュンツ（順子 / 階段）",
        reading: "シュンツ",
        tiles: ["2p", "3p", "4p"],
        desc: "同じ種類の数牌を「2・3・4」のように連続する数字で3枚並べたブロックのこと。麻雀で一番よく作る基本パーツです！"
      }
    },
    {
      id: "s2-2",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "穴埋めパズル",
      question: "真ん中の空欄［ ？ ］に牌をはめて、マンズ（萬子）の階段を完成させよう！",
      subtext: "「ウーマン（五萬）」と「チーマン（七萬）」の間に入る牌は？",
      slots: ["5m", "?", "7m"],
      tileOptions: [
        { tile: "6m", correct: true },
        { tile: "6p", correct: false },
        { tile: "9m", correct: false }
      ],
      explanation: "バッチリ！「ウーマン・ローマン・チーマン（五・六・七萬）」で綺麗な3枚ブロックができました！",
      term: {
        word: "メンツ（面子 / 3枚組）",
        reading: "メンツ",
        tiles: ["5m", "6m", "7m"],
        desc: "アガリに必要な「3枚1組のブロック」のこと。面子を4つ（12枚）＋アタマ1つ（2枚）＝計14枚でアガリになります！"
      }
    },
    {
      id: "s2-3",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "穴埋めパズル",
      question: "ソーズ（索子）の階段を作ろう！［ ？ ］に入るのはどれ？",
      subtext: "「2・3」の前に繋がる、一番先頭の竹の牌を入れよう！",
      slots: ["?", "2s", "3s"],
      tileOptions: [
        { tile: "1s", correct: true },
        { tile: "4p", correct: false },
        { tile: "6z", correct: false }
      ],
      explanation: "完璧です！鳥の牌（イーソー / 1索）＋リャンソー＋サンソーで「1・2・3」の階段になります！",
      term: {
        word: "イーリャンサンのシュンツ（123の階段）",
        reading: "イー・リャン・サン",
        tiles: ["1s", "2s", "3s"],
        desc: "麻雀では数字の1・2・3を「イー・リャン・サン」と読みます。鳥の1索もちゃんと数字の1として繋がります！"
      }
    },
    {
      id: "s2-4",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "穴埋めパズル",
      question: "「チーピン・パーピン（7・8筒）」の後ろに繋がる牌を［ ？ ］にはめよう！",
      subtext: "※注意：「8・9・1」のように9から1へループはしません！",
      slots: ["7p", "8p", "?"],
      tileOptions: [
        { tile: "9p", correct: true },
        { tile: "1p", correct: false },
        { tile: "9m", correct: false }
      ],
      explanation: "正解！「チーピン・パーピン・キューピン（7・8・9筒）」で端っこの階段が完成！なお「8・9・1」とは繋がらないのも大事なポイントです。",
      term: {
        word: "シュウハイ（数牌の1〜9）",
        reading: "ループなしルール",
        tiles: ["7p", "8p", "9p"],
        desc: "階段（順子）は「1・2・3」から「7・8・9」まで。「8・9・1」や「9・1・2」のように端をまたいで繋げることはできません。"
      }
    },
    {
      id: "s2-5",
      type: "slot-fill",
      callSound: "pon",
      modeLabel: "穴埋めパズル",
      question: "ジハイ（字牌）は階段が作れません。［ ？ ］に牌をはめて3枚組を完成させよう！",
      subtext: "赤い「中」が2枚あります。",
      slots: ["7z", "7z", "?"],
      tileOptions: [
        { tile: "7z", correct: true },
        { tile: "5z", correct: false },
        { tile: "6z", correct: false }
      ],
      explanation: "正解！同じ牌を3枚揃えるブロック（刻子）です。しかも「中」3枚はそれだけで役になります！",
      term: {
        word: "コーツ（刻子 / 3枚同牌）",
        reading: "コーツ",
        tiles: ["7z", "7z", "7z"],
        desc: "まったく同じ牌を3枚集めたブロックのこと。階段（順子）と並び、3枚ブロックを作る2大パターンの1つです！"
      }
    },
    {
      id: "s2-6",
      type: "slot-fill",
      callSound: "pon",
      modeLabel: "穴埋めパズル",
      question: "緑の『發（ハツ）』を3枚揃えて、強力な役ブロックを完成させよう！",
      subtext: "真ん中の［ ？ ］に同じ牌をはめよう！",
      slots: ["6z", "?", "6z"],
      tileOptions: [
        { tile: "6z", correct: true },
        { tile: "6s", correct: false },
        { tile: "1z", correct: false }
      ],
      explanation: "バッチリ！「發」が3枚揃って役牌が完成しました！",
      term: {
        word: "ヤクハイ（役牌）",
        reading: "ヤクハイ",
        tiles: ["6z", "6z", "6z"],
        desc: "白・發・中や、場風・自風を3枚（刻子）にした役のこと。相手からポンして集めても確実にアガれます！"
      }
    },
    {
      id: "s2-7",
      type: "text-choice",
      callSound: "pon",
      modeLabel: "ひっかけ注意！",
      question: "『東・南・西』と方角を3種類1枚ずつ集めました。これは1組のブロックになる？",
      subtext: "初心者が一番やりがちな疑問です！",
      boardTiles: ["1z", "2z", "3z"],
      caption: "東・南・西 を1枚ずつ並べた形",
      options: [
        { text: "❌ ならない（字牌は同じ牌3枚じゃないとダメ）", correct: true },
        { text: "⭕ なる（階段と同じ扱いになる）", correct: false }
      ],
      explanation: "大正解！！「東・南・西」や「白・發・中」を1枚ずつ集めてもブロックにはなりません。字牌は必ず同じ牌を集めましょう！",
      term: {
        word: "フォンパイ（風牌）",
        reading: "フォンパイ / カゼハイ",
        tiles: ["1z", "2z", "3z", "4z"],
        desc: "「東（トン）・南（ナン）・西（シャー）・北（ペー）」の4種類の方角牌。順番に並べても階段にはなりません！"
      }
    },
    {
      id: "s2-8",
      type: "text-choice",
      callSound: "chi",
      modeLabel: "ひっかけ注意！",
      question: "『リャンマン・スーマン・ローマン（2・4・6萬）』と偶数を1つ飛ばしで3枚集めました。これはブロックになる？",
      subtext: "階段のルールを思い出してみよう！",
      boardTiles: ["2m", "4m", "6m"],
      caption: "2・4・6 と1つ飛ばしで並べた形",
      options: [
        { text: "❌ ならない（2・3・4のように連続していないとダメ）", correct: true },
        { text: "⭕ なる（規則正しく並んでいるからOK）", correct: false }
      ],
      explanation: "その通り！1つ飛ばしではブロックになりません。サンマン（三萬）やウーマン（五萬）を引いて連続する3枚にする必要があります。",
      term: {
        word: "レンバンの原則（連番）",
        reading: "シュンツの条件",
        tiles: ["2m", "3m", "4m"],
        desc: "階段（順子）として認められるのは、同じ種類で数字が1ずつ連続した3枚（例：2・3・4）だけです。"
      }
    },
    {
      id: "s2-9",
      type: "tap-hand",
      callSound: "tsumo",
      modeLabel: "アタマ探し",
      question: "「3枚ブロック1つ ＋ アタマ（2枚ペア）1つ」の計5枚です。アタマになっている牌をタップして！",
      subtext: "麻雀のアガリには、最後に必ず「同じ牌2枚のペア（アタマ）」が1組いります。",
      hand: ["3m", "4m", "5m", "8p", "8p"],
      correctTiles: ["8p"],
      caption: "👆 アタマ（2枚ペア）になっている牌をタップ！",
      explanation: "素晴らしい！「3・4・5萬（階段3枚）」と「パーピン（8筒）ペア（アタマ2枚）」がハッキリ分かれて見えていますね！",
      term: {
        word: "アタマ（雀頭 / ジャントウ）",
        reading: "ジャントウ",
        tiles: ["8p", "8p"],
        desc: "アガリ形に必ず1組必要な「同じ牌2枚のペア」のこと。実戦では親しみやすく「アタマ」と呼ばれます！"
      }
    },
    {
      id: "s2-10",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "3枚ブロック穴埋め",
      question: "鳥の牌は「イーソー（1索）」でしたね！［鳥（1索）］［ ？ ］［サンソー（3索）］の間にはまる牌は？",
      subtext: "1と3の間の竹の本数を選ぼう！",
      slots: ["1s", "?", "3s"],
      tileOptions: [
        { tile: "2s", correct: true },
        { tile: "4s", correct: false },
        { tile: "2p", correct: false }
      ],
      explanation: "完璧！鳥（イーソー / 1索）・リャンソー（2索）・サンソー（3索）で綺麗な1-2-3の階段（順子）が完成しました！",
      term: {
        word: "シュンツ（順子）",
        reading: "シュンツ",
        tiles: ["1s", "2s", "3s"],
        desc: "1索（鳥）も数字の1なので、「1索・2索・3索」で階段の3枚組が作れます！"
      }
    },
    {
      id: "s2-11",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "3枚ブロック穴埋め",
      question: "［ ？ ］［パーピン（8筒）］［キューピン（9筒）］の左にはめて、階段の3枚組を完成させよう！",
      subtext: "8・9の1つ前の丸の牌です！",
      slots: ["?", "8p", "9p"],
      tileOptions: [
        { tile: "7p", correct: true },
        { tile: "1p", correct: false },
        { tile: "7s", correct: false }
      ],
      explanation: "バッチリ！［チーピン・パーピン・キューピン（7・8・9筒）］で端っこの階段が完成しました！（※9の右側に1筒は繋がらないので7筒だけです！）",
      term: {
        word: "ペンチャン部分",
        reading: "端の階段",
        tiles: ["7p", "8p", "9p"],
        desc: "「8・9」を持っているときは、7が入ってはじめて［7・8・9］の3枚ブロックが完成します。"
      }
    },
    {
      id: "s2-12",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "赤ドラ合体パズル！",
      question: "ボーナス牌の［赤ウーピン（赤5筒）］と［ローピン（6筒）］があります！［ ？ ］にはめて階段を完成させよう！",
      subtext: "赤ウーピン（赤5筒）は普通の「ウーピン（5筒）」とまったく同じ数字の5として使えます！",
      slots: ["0p", "6p", "?"],
      tileOptions: [
        { tile: "7p", correct: true },
        { tile: "8p", correct: false },
        { tile: "7m", correct: false }
      ],
      explanation: "大正解！［赤ウーピン・ローピン・チーピン（赤5・6・7筒）］で1飜ボーナスつきの最強ブロックが完成しました！",
      term: {
        word: "アカドラ入りシュンツ",
        reading: "アカドラブロック",
        tiles: ["0p", "6p", "7p"],
        desc: "赤5牌は普通の「5」として階段にも3枚組にも使え、アガると1飜ボーナスがつきます！"
      }
    },
    {
      id: "s2-13",
      type: "slot-fill",
      callSound: "pon",
      modeLabel: "赤ドラ合体パズル！",
      question: "［赤ウーマン（赤五萬）］と普通の［ウーマン（五萬）］があります！あと1枚［ ？ ］をはめて「同じ数字3枚組（刻子）」にしよう！",
      subtext: "赤ウーマン（赤五萬）と普通のウーマン（五萬）は混ぜて3枚組にできるでしょうか？",
      slots: ["0m", "5m", "?"],
      tileOptions: [
        { tile: "5m", correct: true },
        { tile: "6m", correct: false },
        { tile: "5p", correct: false }
      ],
      explanation: "その通り！赤ウーマンも普通のウーマンも同じ「ウーマン（五萬）」なので、［赤5・黒5・黒5］でバッチリ3枚組（刻子）になります！",
      term: {
        word: "コーツ（刻子）",
        reading: "コーツ",
        tiles: ["0m", "5m", "5m"],
        desc: "同じ牌3枚のブロック。赤5と黒5は同じ牌として扱われるため、一緒にポンや刻子にできます！"
      }
    },
    {
      id: "s2-14",
      type: "slot-fill",
      callSound: "pon",
      modeLabel: "字牌の3枚組！",
      question: "真っ白なジハイ［白（ハク）］が2枚あります！［ ？ ］にはめて3枚ブロックを完成させよう！",
      subtext: "字牌はまったく同じ牌を3枚集めます！",
      slots: ["5z", "5z", "?"],
      tileOptions: [
        { tile: "5z", correct: true },
        { tile: "6z", correct: false },
        { tile: "1p", correct: false }
      ],
      explanation: "ナイス！［白・白・白］で1飜の役牌ブロックが完成しました！",
      term: {
        word: "サンゲンパイのコーツ（三元牌の刻子）",
        reading: "ヤクハイ確定",
        tiles: ["5z", "5z", "5z"],
        desc: "白・發・中のどれかを3枚1組にすると、それだけでアガる権利（1飜）が手に入ります！"
      }
    },
    {
      id: "s2-15",
      type: "slot-fill",
      callSound: "pon",
      modeLabel: "字牌の3枚組！",
      question: "［東］［東］［ ？ ］にはまる牌を選んで、3枚組を完成させよう！",
      subtext: "東場（トンバ）なら全員に役がつく大事なブロックです！",
      slots: ["1z", "1z", "?"],
      tileOptions: [
        { tile: "1z", correct: true },
        { tile: "2z", correct: false },
        { tile: "3z", correct: false }
      ],
      explanation: "バッチリ！字牌は「東・東・東」のように同じ文字を3枚集めます！",
      term: {
        word: "バカゼハイ（場風牌）",
        reading: "バカゼ",
        tiles: ["1z", "1z", "1z"],
        desc: "東場のときの「東」（南場なら「南」）のこと。3枚揃えると誰にでも1飜の役がつきます！"
      }
    },
    {
      id: "s2-16",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "3枚ブロック穴埋め",
      question: "マンズの階段！［ローマン（六萬）］［チーマン（七萬）］［ ？ ］の右にはまる牌はどれ？",
      subtext: "「六・七」の次に繋がる、階段の続きの漢数字を探そう！",
      slots: ["6m", "7m", "?"],
      tileOptions: [
        { tile: "8m", correct: true },
        { tile: "9m", correct: false },
        { tile: "8s", correct: false }
      ],
      explanation: "正解！［ローマン・チーマン・パーマン（六・七・八萬）］で綺麗な階段ブロック完成です！",
      term: {
        word: "メンツ（面子）",
        reading: "メンツ",
        tiles: ["6m", "7m", "8m"],
        desc: "3枚1組の完成ブロックのこと。順子（階段）でも刻子（同じ3枚）でも、4組集めればOKです！"
      }
    },
    {
      id: "s2-17",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "超頻出ひっかけ！",
      question: "『サンマン（三萬）・スーピン（4筒）・ウーソー（5索）』と、違う種類で「3・4・5」を集めました。これは階段ブロックになる？",
      subtext: "数字は3・4・5と並んでいますが、絵柄の種類に注目！",
      boardTiles: ["3m", "4p", "5s"],
      caption: "マンズの3・ピンズの4・ソーズの5",
      options: [
        { text: "❌ ならない！（同じ種類の牌で3・4・5じゃないとダメ）", correct: true },
        { text: "⭕ 数字が続いていれば種類が違ってもOK", correct: false }
      ],
      explanation: "超重要ポイント！階段（順子）は必ず「同じ種類（マンズならマンズだけ、ピンズならピンズだけ）」で揃える必要があります！",
      term: {
        word: "シュンツ（色の統一）",
        reading: "階段のルール",
        tiles: ["3p", "4p", "5p"],
        desc: "階段を作れるのは同じ種類の数牌同士だけ。萬子・筒子・索子を混ぜて1組の階段にすることはできません！"
      }
    },
    {
      id: "s2-18",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "ひっかけ注意！",
      question: "サンゲンパイ（三元牌）の『白・發・中』を1枚ずつ計3枚集めました！これで1つの3枚ブロックになる？",
      subtext: "なんだか強そうな組み合わせに見えますが…？",
      boardTiles: ["5z", "6z", "7z"],
      caption: "白・發・中を1枚ずつ並べた形",
      options: [
        { text: "❌ ならない！（字牌は『白・白・白』のように同じ牌3枚だけ）", correct: true },
        { text: "⭕ 3種類セットで1ブロックになる", correct: false }
      ],
      explanation: "よくぞ見抜きました！字牌は1枚ずつ集めてもブロックになりません。必ず同じ字牌を2枚（アタマ）か3枚（刻子）で使いましょう！",
      term: {
        word: "ジハイの使い方（字牌の原則）",
        reading: "同じ牌を重ねる",
        tiles: ["7z", "7z", "7z"],
        desc: "東南西北も白發中も、種類違いで繋げることはできません。必ず同じ文字を重ねて使います！"
      }
    },
    {
      id: "s2-19",
      type: "text-choice",
      callSound: "tsumo",
      modeLabel: "アタマ（ペア）のルール",
      question: "アガリに必要な「アタマ（2枚ペア）」は、手牌14枚の中にいくつ作るルール？",
      subtext: "基本のアガリ公式をおさらい！",
      boardTiles: ["8p", "8p"],
      caption: "同じ牌2枚のアタマ（雀頭）",
      options: [
        { text: "⭕ 必ず「1組だけ」作る！（3枚組×4つ ＋ アタマ×1組）", correct: true },
        { text: "❌ 2枚ペアばかり4組くらい混ぜても自由", correct: false }
      ],
      explanation: "完璧！基本のアガリ形はいつでも「3枚ブロック×4つ（12枚）＋ 2枚のアタマ×1つ（2枚）＝ 14枚」です！（※例外としてペア7組の七対子という特殊役だけあります）",
      term: {
        word: "アタマ（雀頭 / ジャントウ）",
        reading: "ジャントウ",
        tiles: ["8p", "8p"],
        desc: "14枚のアガリ形に1組だけ必要な2枚ペアのこと。数牌でも字牌でも、同じ牌2枚なら何でもアタマにできます！"
      }
    },
    {
      id: "s2-20",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "真ん中穴埋め！",
      question: "ソーズ（索子）の階段を作ろう！［スーソー（4索）］［ ？ ］［ローソー（6索）］の真ん中にはまる牌は？",
      subtext: "4と6の間の数字です（赤ドラでもOK！）",
      slots: ["4s", "?", "6s"],
      tileOptions: [
        { tile: "0s", correct: true },
        { tile: "7s", correct: false },
        { tile: "5p", correct: false }
      ],
      explanation: "ナイス！！「赤ウーソー（赤5索）」が真ん中にスポッと入って、ボーナス1飜つきの［4・5・6索］が完成しました！",
      term: {
        word: "アカウーソー（赤5索）",
        reading: "アカウーソー",
        tiles: ["4s", "0s", "6s"],
        desc: "赤い5索も普通の5索と同じく4索と6索の間に入れて階段を作れます！"
      }
    }
  ],

  // ==========================================================================
  // Stage 3: 1枚ポイッ！「8枚ミニ麻雀」（現在 18 問）
  // ==========================================================================
  stage3: [
    {
      id: "s3-1",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "仲間はずれの不要な牌を1枚タップして捨て、「あと1枚で完成」にしよう！",
      subtext: "ゴールは「3枚組×2つ ＋ アタマ2枚」です。くっつかないジハイ（字牌）が1枚あります！",
      hand: ["2m", "3m", "4m", "5p", "5p", "3s", "4s", "4z"],
      correctTiles: ["4z"],
      waitDesc: "リャンソー（2索） または ウーソー（5索） が来れば完成！",
      explanation: "ナイス打牌！ポツンと1枚だけ浮いていた「ペー（北）」を捨てれば、綺麗なテンパイ完成です！",
      term: {
        word: "コリツハイ（孤立牌）",
        reading: "コリツハイ",
        tiles: ["4z"],
        desc: "周りに繋がる牌がなく、1枚だけポツンと浮いている牌のこと。まずは孤立している字牌や端牌から捨てるのがセオリーです！"
      }
    },
    {
      id: "s3-2",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀",
      question: "どの牌を1枚捨てれば「あと1枚で完成」になる？（牌を直接タップ！）",
      subtext: "「發（ハツ）」は2枚ペア（アタマ）になっていますよ！",
      hand: ["1m", "2m", "3m", "9p", "2s", "3s", "6z", "6z"],
      correctTiles: ["9p"],
      waitDesc: "イーソー（1索） または スーソー（4索） が来れば完成！",
      explanation: "気持ちいい一打！1枚だけ仲間がいない「キューピン（9筒）」を捨てればテンパイ完成です！",
      term: {
        word: "テンパイ（聴牌）",
        reading: "テンパイ",
        tiles: ["2s", "3s"],
        desc: "「あと1枚、必要な牌が来ればアガリ完成！」という王手（リーチ一歩手前）の状態のことです。"
      }
    },
    {
      id: "s3-3",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "ピンズ（丸の牌）が4枚あります。余っている不要な1枚をタップして捨てよう！",
      subtext: "「リャン・サン・スーピン（2・3・4筒）」で3枚組ができていますね。",
      hand: ["2m", "2m", "2p", "3p", "4p", "9p", "5s", "6s"],
      correctTiles: ["9p"],
      waitDesc: "スーソー（4索） または チーソー（7索） が来れば完成！",
      explanation: "バッチリ！［234筒］から遠く離れた「キューピン（9筒）」が不要牌でした。手牌のブロックがもう見えていますね！",
      term: {
        word: "フヨウハイ（不要牌）",
        reading: "フヨウハイ",
        tiles: ["9p"],
        desc: "完成したブロックやペアから外れて使い道がない牌のこと。これを見つけて順番に捨てていくのが麻雀の基本です！"
      }
    },
    {
      id: "s3-4",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀",
      question: "いらない端っこの牌を1枚捨てて、綺麗なタンヤオの形にしよう！",
      subtext: "タンヤオは「2〜8」だけ！仲間はずれの「端っこ（1・9）」を探そう！",
      hand: ["4m", "5m", "6m", "3p", "4p", "1s", "8s", "8s"],
      correctTiles: ["1s"],
      waitDesc: "リャンピン（2筒） または ウーピン（5筒） が来れば完成！",
      explanation: "完璧！浮いていた「イーソー（1索 / 鳥）」を切ることで、すべて2〜8の牌になり「タンヤオ」も確定しました！",
      term: {
        word: "タンヤオ（断么九）",
        reading: "タンヤオ",
        tiles: ["4m", "5m", "6m"],
        desc: "1・9・字牌を1枚も使わず、「2〜8」の数牌だけで揃える超人気役。覚えやすくて鳴いてもアガれる万能役です！"
      }
    },
    {
      id: "s3-5",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "マンズが3枚ありますが、階段になっていません。どれを1枚捨てる？",
      subtext: "「サンマン・スーマン（三・四萬）」と「キューマン（九萬）」、どっちを残す？",
      hand: ["3m", "4m", "9m", "5p", "6p", "7p", "7z", "7z"],
      correctTiles: ["9m"],
      waitDesc: "リャンマン（二萬） または ウーマン（五萬） が来れば完成！",
      explanation: "その通り！くっついている「サンマン・スーマン（三・四萬）」を残し、離れた「キューマン（九萬）」を捨てれば両面待ちのテンパイです！",
      term: {
        word: "ターツ（塔子）",
        reading: "ターツ",
        tiles: ["3m", "4m"],
        desc: "「3・4」や「6・8」のように、あと1枚くっつけば3枚の階段（順子）になる2枚組パーツのこと。手牌の大事なタネです！"
      }
    },
    {
      id: "s3-6",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀",
      question: "ソーズ（緑の牌）が4枚あります。余っている1枚を見抜いて捨てよう！",
      subtext: "「ウー・ロー・チーソー（5・6・7索）」の階段を壊さないように注意！",
      hand: ["3m", "4m", "8p", "8p", "1s", "5s", "6s", "7s"],
      correctTiles: ["1s"],
      waitDesc: "二萬 または 五萬 が来れば完成！",
      explanation: "お見事！！［5・6・7索］の階段から外れている「イーソー（1索）」を切れました！",
      term: {
        word: "リーパイ（理牌）",
        reading: "リーパイ",
        tiles: ["5s", "6s", "7s"],
        desc: "手牌を種類・数字順に綺麗に並べ替えること。オンライン麻雀では自動でやってくれるのでブロック探しに集中できます！"
      }
    },
    {
      id: "s3-7",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "「リャンマン・スーマン（二・四萬）」は間（サンマン / 三萬）が入れば階段になります！不要な1枚をタップして捨てよう！",
      subtext: "1枚だけどこにも繋がっていない端っこの竹があります。",
      hand: ["2m", "4m", "3p", "4p", "5p", "9s", "5z", "5z"],
      correctTiles: ["9s"],
      waitDesc: "サンマン（三萬） が来れば完成！",
      explanation: "バッチリ！孤立していた「キューソー（9索）」を捨てて、［2・4萬］の間を待つテンパイになりました！",
      term: {
        word: "ダハイ（切る / 打牌）",
        reading: "ダハイ",
        tiles: ["9s"],
        desc: "自分の番に手牌から不要な牌を1枚選び、場（河）に捨てることを「打牌」または「牌を切る」と言います。"
      }
    },
    {
      id: "s3-8",
      type: "discard-8",
      callSound: "pon",
      modeLabel: "8枚ミニ麻雀",
      question: "ペアが「ローマン（六萬）」と「ローソー（6索）」の2組あります！いらないジハイ（字牌）を1枚捨てよう！",
      subtext: "ペアが2組ある形も立派なテンパイになります！",
      hand: ["6m", "6m", "2p", "3p", "4p", "6s", "6s", "3z"],
      correctTiles: ["3z"],
      waitDesc: "ローマン（六萬） または ローソー（6索） が来れば完成！",
      explanation: "ナイス判断！1枚浮いていた「シャー（西）」を切れば、ローマンかローソーのどちらかが3枚になった瞬間にアガリです！",
      term: {
        word: "トイツ（対子 / 2枚組）",
        reading: "トイツ",
        tiles: ["6m", "6m"],
        desc: "同じ牌が2枚揃った形のこと。アタマにもなるし、もう1枚引けば3枚組（刻子）にもポンにも使える便利な形です！"
      }
    },
    {
      id: "s3-9",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀・仕上げ",
      question: "ボーナス牌の「赤ウーピン（赤5筒）」があります！赤ウーピン・ローピン（赤5・6筒）のコンビを生かして、不要な1枚を捨てよう！",
      subtext: "ピンズが3枚（赤ウーピン・ローピン・キューピン）あります。どれがいらない？",
      hand: ["2m", "3m", "4m", "0p", "6p", "9p", "3s", "3s"],
      correctTiles: ["9p"],
      waitDesc: "スーピン（4筒） または チーピン（7筒） が来れば高得点完成！",
      explanation: "完璧な一打！赤ウーピンとローピンのコンビを残して「キューピン（9筒）」を切ることで、赤ドラ入りのタンヤオテンパイ完成です！",
      term: {
        word: "コウケイ（好形 / 良形）",
        reading: "コウケイ",
        tiles: ["0p", "6p"],
        desc: "「5・6」のように隣り合って両側（4と7）を待てる強い形のこと。赤ドラを含む好形は大チャンスです！"
      }
    },
    {
      id: "s3-10",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "1枚だけポツンと浮いているジハイをタップして捨て、テンパイにしよう！",
      subtext: "［一二三萬］と［44筒］と［67索］が見えています！",
      hand: ["1m", "2m", "3m", "4p", "4p", "6s", "7s", "2z"],
      correctTiles: ["2z"],
      waitDesc: "ウーソー（5索） または パーソー（8索） が来れば完成！",
      explanation: "スッキリ！1枚浮いていた「ナン（南）」を切れば、ウーソー・パーソー（5・8索）待ちの両面テンパイ完成です！",
      term: {
        word: "コリツハイ（孤立牌 / 浮き牌）",
        reading: "コリツハイ",
        tiles: ["2z"],
        desc: "周りに仲間がおらず1枚だけポツンと浮いている牌のこと。まずは孤立した字牌や端牌から切るのがセオリーです！"
      }
    },
    {
      id: "s3-11",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀",
      question: "ピンズが3枚（リャンピン・サンピン・キューピン）あります。不要な1枚をタップして捨てよう！",
      subtext: "［リャンピン・サンピン（2・3筒）］は隣同士でくっついていますね！",
      hand: ["5m", "6m", "7m", "2p", "3p", "9p", "6z", "6z"],
      correctTiles: ["9p"],
      waitDesc: "イーピン（1筒） または スーピン（4筒） が来れば完成！",
      explanation: "バッチリ！遠く離れた「キューピン（9筒）」を捨てれば、［2・3筒］の両面待ちになります！",
      term: {
        word: "リャンメンターツ（両面塔子）",
        reading: "リャンメンターツ",
        tiles: ["2p", "3p"],
        desc: "「2・3」のように隣り合った2枚組のこと。両側（1と4）の2種類を待てる一番優秀なパーツです！"
      }
    },
    {
      id: "s3-12",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "マンズが3枚（リャンマン・サンマン・キューマン）あります。不要な1枚を切ってテンパイにしよう！",
      subtext: "真っ白な牌2枚［白・白（ハク）］は大事なアタマです！",
      hand: ["2m", "3m", "9m", "3p", "4p", "5p", "5z", "5z"],
      correctTiles: ["9m"],
      waitDesc: "イーマン（一萬） または スーマン（四萬） が来れば完成！",
      explanation: "大正解！［白・白（ハク）］をアタマにして、離れた「キューマン（九萬）」を切ればイーマン・スーマン（一・四萬）待ちの完成です！",
      term: {
        word: "アタマ固定（雀頭固定）",
        reading: "アタマキープ",
        tiles: ["5z", "5z"],
        desc: "手牌に2枚ペア（対子）が1組だけのときは、それを大事なアタマとして壊さずキープするのがコツです！"
      }
    },
    {
      id: "s3-13",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀",
      question: "ピンズが［イーピン・ウーピン・ローピン（1・5・6筒）］の3枚あります。どれを1枚捨てる？",
      subtext: "くっついている2枚を残そう！",
      hand: ["7m", "8m", "9m", "1p", "5p", "6p", "3s", "3s"],
      correctTiles: ["1p"],
      waitDesc: "スーピン（4筒） または チーピン（7筒） が来れば完成！",
      explanation: "お見事！端っこで浮いていた「イーピン（1筒）」を切って、スーピン・チーピン（4・7筒）待ちのテンパイになりました！",
      term: {
        word: "ハイコウリツ（牌効率）",
        reading: "ハイコウリツ",
        tiles: ["5p", "6p"],
        desc: "一番アガリに近づきやすい（受け入れ枚数が多い）牌を残して不要牌を切る技術のことです！"
      }
    },
    {
      id: "s3-14",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "［サンソー・ウーソー（3・5索）］は1つ飛びですが、真ん中のスーソー（4索）が入れば階段になります！不要な1枚を捨てよう！",
      subtext: "1枚だけのジハイ（字牌）が混ざっています！",
      hand: ["2m", "2m", "4p", "5p", "6p", "3s", "5s", "4z"],
      correctTiles: ["4z"],
      waitDesc: "スーソー（4索） が来れば完成！",
      explanation: "正解！1枚浮いた「ペー（北）」を切れば、［3・5索］の間を待つカンチャン待ちテンパイです！",
      term: {
        word: "カンチャンターツ",
        reading: "1つ飛びの2枚",
        tiles: ["3s", "5s"],
        desc: "「3・5」のように真ん中1枚（4）が抜けた2枚組パーツのこと。孤立した字牌よりずっと価値があります！"
      }
    },
    {
      id: "s3-15",
      type: "discard-8",
      callSound: "pon",
      modeLabel: "8枚ミニ麻雀",
      question: "ペアが［サンマン（三萬）］と［チーピン（7筒）］の2組あります！不要な1枚を捨ててテンパイにしよう！",
      subtext: "全部2〜8の牌になればタンヤオも確定します！",
      hand: ["3m", "3m", "7p", "7p", "2s", "3s", "4s", "1z"],
      correctTiles: ["1z"],
      waitDesc: "サンマン（三萬） または チーピン（7筒） が来れば完成！",
      explanation: "完璧！浮いていた「トン（東）」を切ることで、タンヤオ確定のシャボ待ちテンパイになりました！",
      term: {
        word: "シャボ（双碰）の形",
        reading: "ペア2組のテンパイ",
        tiles: ["3m", "3m", "7p", "7p"],
        desc: "ペアが2組ある状態は、どちらがポン（またはツモ）で3枚になっても残りがアタマになる強いテンパイ形です！"
      }
    },
    {
      id: "s3-16",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀",
      question: "［赤ウーマン・ローマン・チーマン（赤5・6・7萬）］はもう3枚の階段になっています！余っている1枚を捨てよう！",
      subtext: "鳥のイラスト（1索）と［7索・8索］を見比べてみよう！",
      hand: ["0m", "6m", "7m", "2p", "2p", "1s", "7s", "8s"],
      correctTiles: ["1s"],
      waitDesc: "ローソー（6索） または キューソー（9索） が来れば完成！",
      explanation: "すごい！！赤ウーマンが「5」だと瞬時に見抜き、離れた「イーソー（1索 / 鳥）」を切れましたね！",
      term: {
        word: "アカドラの組み込み",
        reading: "赤5＋6＋7",
        tiles: ["0m", "6m", "7m"],
        desc: "赤5牌が手牌にあるときは、そこを中心に階段を作ると絶対に捨てずに済むので高得点が確定します！"
      }
    },
    {
      id: "s3-17",
      type: "discard-8",
      callSound: "tsumo",
      modeLabel: "8枚ミニ麻雀",
      question: "［イーピン・リャンピン（1・2筒）］はサンピン（3筒）が来れば階段になります！どこにも繋がらない1枚を捨てよう！",
      subtext: "右のほうにポツンと浮いた端っこの竹があります。",
      hand: ["2m", "3m", "4m", "1p", "2p", "9s", "7z", "7z"],
      correctTiles: ["9s"],
      waitDesc: "サンピン（3筒） が来れば完成！",
      explanation: "バッチリ！孤立していた「9索」を捨てて、3筒待ちのテンパイ完成です！",
      term: {
        word: "ペンチャンターツ",
        reading: "1・2や8・9の形",
        tiles: ["1p", "2p"],
        desc: "端っこの「1・2」（3待ち）や「8・9」（7待ち）の2枚組パーツのことです。"
      }
    },
    {
      id: "s3-18",
      type: "discard-8",
      callSound: "ron",
      modeLabel: "8枚ミニ麻雀",
      question: "マンズの［スーマン・赤ウーマン（四・赤五萬）］コンビを残して、不要な端っこ牌を1枚捨てよう！",
      subtext: "切れば2〜8だけのタンヤオ＋赤ドラ1になります！",
      hand: ["4m", "0m", "9m", "6p", "7p", "8p", "2s", "2s"],
      correctTiles: ["9m"],
      waitDesc: "サンマン（三萬） または ローマン（六萬） が来れば完成！",
      explanation: "お見事！！離れた「キューマン（九萬）」を切って、タンヤオ＋赤ドラの両面テンパイ完成です！",
      term: {
        word: "タンヤオ移行",
        reading: "端牌切り",
        tiles: ["4m", "0m"],
        desc: "不要な1・9・字牌を切り飛ばして2〜8だけにまとめると、鳴いてもリーチでもアガれる最強状態になります！"
      }
    }
  ],

  // ==========================================================================
  // Stage 4: 13枚「待ち牌」あて（補助輪つき）（現在 18 問）
  // ==========================================================================
  stage4: [
    {
      id: "s4-1",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "13枚の待ちあて",
      question: "いよいよ実戦と同じ13枚！ソーズの［サンソー・スーソー（3・4索）］に注目。あと何が来ればアガリ？",
      subtext: "※見づらければ、上の『🚲 補助輪』ボタンを押すとブロックが分かれて見えます！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["5p", "6p", "7p"], label: "完成" },
        { tiles: ["5z", "5z", "5z"], label: "完成" },
        { tiles: ["8p", "8p"], label: "アタマ" },
        { tiles: ["3s", "4s"], label: "リャン・ウーソー待ち", isWait: true }
      ],
      options: [
        { text: "リャンソー（2索） または ウーソー（5索）（両面待ち）", correct: true },
        { text: "サンソー（3索） または スーソー（4索）", correct: false },
        { text: "パーピン（8筒）", correct: false }
      ],
      explanation: "大正解！完成しているブロックを頭の中で消せば、「サンソー・スーソー（3・4索）に何を足すか」だけのシンプルなパズルです！",
      term: {
        word: "リャンメン待ち（両面待ち）",
        reading: "リャンメンマチ",
        tiles: ["3s", "4s"],
        desc: "「3・4」のように並んだ2枚の両側（2と5）のどちらでもアガれる待ち。待ちの枚数が一番多い王様の待ちです！"
      }
    },
    {
      id: "s4-2",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "13枚の待ちあて",
      question: "ピンズの［ローピン・パーピン（6・8筒）］の部分がまだ2枚です。あと何が来ればアガリ？",
      subtext: "間の数字が1つ抜けています！（迷ったら『🚲 補助輪』をONにしてみよう）",
      blocks: [
        { tiles: ["1m", "2m", "3m"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["7z", "7z", "7z"], label: "完成" },
        { tiles: ["9m", "9m"], label: "アタマ" },
        { tiles: ["6p", "8p"], label: "チーピン待ち", isWait: true }
      ],
      options: [
        { text: "チーピン（7筒） だけ（間を埋める待ち）", correct: true },
        { text: "ウーピン（5筒） または キューピン（9筒）", correct: false },
        { text: "キューマン（九萬）", correct: false }
      ],
      explanation: "バッチリ！間を埋める「チーピン（7筒）」がスポッと入れば［6・7・8筒］になってアガリです！",
      term: {
        word: "カンチャン待ち（嵌張待ち）",
        reading: "カンチャンマチ",
        tiles: ["6p", "8p"],
        desc: "「6・8」のように1つ飛んだ数字の間（7）が埋まるのを待つ形。「間（カン）にハマる」からカンチャン待ち！"
      }
    },
    {
      id: "s4-3",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "13枚の待ちあて",
      question: "3枚ブロックはもう4つ全部できています！ポツンと1枚残った［南］、何が来ればアガリ？",
      subtext: "まだ「アタマ（2枚ペア）」がありません！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["4p", "5p", "6p"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["6z", "6z", "6z"], label: "完成" },
        { tiles: ["2z"], label: "ナン待ち", isWait: true }
      ],
      options: [
        { text: "ナン（南 / もう1枚重ねてアタマにする）", correct: true },
        { text: "トン（東） または シャー（西）", correct: false },
        { text: "ハツ（發）", correct: false }
      ],
      explanation: "正解！もう1枚「南」が来ればアタマ（2枚ペア）が完成してアガリです！",
      term: {
        word: "タンキ待ち（単騎待ち）",
        reading: "タンキマチ",
        tiles: ["2z"],
        desc: "3枚組が4つ完成していて、最後のアタマ（雀頭）になる相方1枚だけを待っている形のことです。"
      }
    },
    {
      id: "s4-4",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "13枚の待ちあて",
      question: "ソーズの［パーソー・キューソー（8・9索）］に注目！あと何が来ればアガリ？",
      subtext: "9索のさらに外側（10索）は存在しませんよ！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["3p", "4p", "5p"], label: "完成" },
        { tiles: ["5z", "5z", "5z"], label: "完成" },
        { tiles: ["6m", "6m"], label: "アタマ" },
        { tiles: ["8s", "9s"], label: "チーソー待ち", isWait: true }
      ],
      options: [
        { text: "チーソー（7索） だけ（片側待ち）", correct: true },
        { text: "チーソー（7索） または イーソー（1索）", correct: false },
        { text: "ローマン（六萬）", correct: false }
      ],
      explanation: "大正解！「8・9索」と端っこを持っているときは、内側の「チーソー（7索）」だけの片側待ちになります！",
      term: {
        word: "ペンチャン待ち（辺張待ち）",
        reading: "ペンチャンマチ",
        tiles: ["8s", "9s"],
        desc: "「1・2」で3を待つ形や、「8・9」で7を待つ片側だけの待ち。「端っこ（辺）」で待つからペンチャン待ち！"
      }
    },
    {
      id: "s4-5",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "pon",
      modeLabel: "13枚の待ちあて",
      question: "「スーマン（四萬）」と「發（ハツ）」、2枚のペアが2組あります！あと何が来ればアガリ？",
      subtext: "片方が3枚ブロックになれば、もう片方がアタマになります！",
      blocks: [
        { tiles: ["1p", "2p", "3p"], label: "完成" },
        { tiles: ["5s", "6s", "7s"], label: "完成" },
        { tiles: ["1z", "1z", "1z"], label: "完成" },
        { tiles: ["4m", "4m"], label: "ペア①", isWait: true },
        { tiles: ["6z", "6z"], label: "ペア②", isWait: true }
      ],
      options: [
        { text: "スーマン（四萬） または ハツ（發）（どちらが来てもOK！）", correct: true },
        { text: "ハツ（發） だけ", correct: false },
        { text: "サンマン（三萬） または ウーマン（五萬）", correct: false }
      ],
      explanation: "バッチリ！2組のペアのうち、どちらが3枚になってもアガリになります！",
      term: {
        word: "シャボ待ち（双碰待ち）",
        reading: "シャボマチ / シャンポンマチ",
        tiles: ["4m", "4m", "6z", "6z"],
        desc: "2枚ペア（対子）が2組あり、どちらか片方が3枚組になれば完成する2種類の待ちのことです。"
      }
    },
    {
      id: "s4-6",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "13枚の待ちあて",
      question: "左端のマンズ［スーマン・ウーマン（四・五萬）］に注目！あと何が来ればアガリ？",
      subtext: "他のブロックが全部完成しているか確認してみよう！",
      blocks: [
        { tiles: ["5p", "6p", "7p"], label: "完成" },
        { tiles: ["3s", "4s", "5s"], label: "完成" },
        { tiles: ["5z", "5z", "5z"], label: "完成" },
        { tiles: ["9s", "9s"], label: "アタマ" },
        { tiles: ["4m", "5m"], label: "サン・ローマン待ち", isWait: true }
      ],
      options: [
        { text: "サンマン（三萬） または ローマン（六萬）", correct: true },
        { text: "スーマン（四萬） または ウーマン（五萬）", correct: false },
        { text: "キューソー（9索）", correct: false }
      ],
      explanation: "すごい！！補助輪なしでも完成ブロックを消して、残りの［スーマン・ウーマン（四・五萬）］が見えましたね！",
      term: {
        word: "5ブロック思考",
        reading: "ファイブブロック",
        tiles: ["4m", "5m"],
        desc: "13枚の手牌を「3枚組×4つ ＋ アタマ1つ ＝ 計5ブロック」に分けて見る考え方。上級者も全員これで手牌を見ています！"
      }
    },
    {
      id: "s4-7",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "13枚の待ちあて",
      question: "「キューマン（九萬）」と「中（チュン）」の2組ペアがあります。何が来ればアガリ形が完成する？",
      subtext: "どちらが3枚になっても形は完成します！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["4p", "5p", "6p"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["9m", "9m"], label: "ペア①", isWait: true },
        { tiles: ["7z", "7z"], label: "ペア②", isWait: true }
      ],
      options: [
        { text: "キューマン（九萬） または チュン（中）", correct: true },
        { text: "チュン（中） だけ", correct: false },
        { text: "パーマン（八萬） または チュン（中）", correct: false }
      ],
      explanation: "大正解！形はキューマン（九萬）とチュン（中）のシャボ待ちです（※もし鳴いていた場合は、役牌の「中（チュン）」のほうでしかロンできない点も実戦のコツです！）。",
      term: {
        word: "カタアガリ（片アガリ / 後付け）",
        reading: "カタアガリ",
        tiles: ["9m", "7z"],
        desc: "2種類の待ちのうち、片方（中）なら役がつくけれど、もう片方（九萬）だと役がつかない状態のこと。鳴いたときによく起きます！"
      }
    },
    {
      id: "s4-8",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "13枚の待ちあて",
      question: "ソーズの［鳥（イーソー / 1索）・リャンソー（2索）］の部分がまだ2枚です。あと何が来ればアガリ？",
      subtext: "「0索」という牌は麻雀にありませんよ！",
      blocks: [
        { tiles: ["3m", "4m", "5m"], label: "完成" },
        { tiles: ["5p", "6p", "7p"], label: "完成" },
        { tiles: ["6z", "6z", "6z"], label: "完成" },
        { tiles: ["8m", "8m"], label: "アタマ" },
        { tiles: ["1s", "2s"], label: "サンソー待ち", isWait: true }
      ],
      options: [
        { text: "サンソー（3索） だけ（片側待ち）", correct: true },
        { text: "イーソー（1索） または サンソー（3索）", correct: false },
        { text: "パーマン（八萬）", correct: false }
      ],
      explanation: "完璧です！「イーソー・リャンソー（1・2索）」と持っているときは「サンソー（3索）」だけのペンチャン待ちになります。13枚がもう怖くないですね！",
      term: {
        word: "アガリ牌（当たり牌）",
        reading: "アガリハイ",
        tiles: ["3s"],
        desc: "テンパイしている手牌を完成させる最後の1枚のこと。山から自分で引けば「ツモ」、他人の捨て牌なら「ロン」でアガリです！"
      }
    },
    {
      id: "s4-9",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "応用パズル！",
      question: "左端のマンズが［二・三・四・五萬］と4枚連続で並んでいます！何が来れば「3枚組＋アタマ」になる？",
      subtext: "ヒント：二萬が来たら［二二］＋［三四五］、もし五萬が来たら…？",
      blocks: [
        { tiles: ["2p", "3p", "4p"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["7z", "7z", "7z"], label: "完成" },
        { tiles: ["2m", "3m", "4m", "5m"], label: "4枚並び!", isWait: true }
      ],
      options: [
        { text: "リャンマン（二萬） または ウーマン（五萬）（両端のどちらでもアタマになる！）", correct: true },
        { text: "イーマン（一萬） または ローマン（六萬）", correct: false },
        { text: "サンマン（三萬） または スーマン（四萬）", correct: false }
      ],
      explanation: "お見事！！4枚連続で並んでいると、両端の「リャンマン（二萬）」と「ウーマン（五萬）」どちらが重なっても3枚組＋アタマが完成します！",
      term: {
        word: "ノベタン（延べ単騎）",
        reading: "ノベタンマチ",
        tiles: ["2m", "3m", "4m", "5m"],
        desc: "「2・3・4・5」のように4枚連続しているとき、両端の2種類（2と5）どちらでもアタマにできるオシャレな待ちです！"
      }
    },
    {
      id: "s4-10",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "13枚の待ちあて",
      question: "ピンズの［スーピン・ウーピン（4・5筒）］がまだ2枚組です！あと何が来ればアガリ？",
      subtext: "※見づらければ上の『🚲 補助輪』ボタンで区切って見られます！",
      blocks: [
        { tiles: ["1m", "2m", "3m"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["7z", "7z", "7z"], label: "完成" },
        { tiles: ["2s", "2s"], label: "アタマ" },
        { tiles: ["4p", "5p"], label: "サン・ローピン待ち", isWait: true }
      ],
      options: [
        { text: "サンピン（3筒） または ローピン（6筒）（両面待ち）", correct: true },
        { text: "スーピン（4筒） または ウーピン（5筒）", correct: false },
        { text: "リャンソー（2索）", correct: false }
      ],
      explanation: "大正解！［スーピン・ウーピン（4・5筒）］の両側、「サンピン（3筒）」か「ローピン（6筒）」が来れば完成です！",
      term: {
        word: "スジ（3-6・2-5・1-4）",
        reading: "両面のペア",
        tiles: ["3p", "4p", "5p", "6p"],
        desc: "「4・5」なら「3・6（サブロー）」、「3・4」なら「2・5（リャンウー）」のように両面待ちになる数字の組み合わせです！"
      }
    },
    {
      id: "s4-11",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "13枚の待ちあて",
      question: "マンズの［ローマン・チーマン（六・七萬）］に注目！あと何が来ればアガリ？",
      subtext: "他の11枚（3ブロック＋アタマ）はもう完成しています！",
      blocks: [
        { tiles: ["2p", "3p", "4p"], label: "完成" },
        { tiles: ["3s", "4s", "5s"], label: "完成" },
        { tiles: ["6z", "6z", "6z"], label: "完成" },
        { tiles: ["9p", "9p"], label: "アタマ" },
        { tiles: ["6m", "7m"], label: "ウー・パーマン待ち", isWait: true }
      ],
      options: [
        { text: "ウーマン（五萬） または パーマン（八萬）（両面待ち）", correct: true },
        { text: "ローマン（六萬） または チーマン（七萬）", correct: false },
        { text: "キューマン（九萬） だけ", correct: false }
      ],
      explanation: "バッチリ！［ローマン・チーマン（六・七萬）］の両側である「ウーマン（五萬）」または「パーマン（八萬）」待ちです！",
      term: {
        word: "ウー・パー待ち（5・8待ち）",
        reading: "6・7の両面",
        tiles: ["6m", "7m"],
        desc: "「6・7」を持っているときの「5・8」待ちのこと。実戦でとてもよく出る両面待ちです！"
      }
    },
    {
      id: "s4-12",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "13枚の待ちあて",
      question: "ソーズの［リャンソー・スーソー（2・4索）］が1つ飛びになっています！あと何が来ればアガリ？",
      subtext: "間の数字を埋めよう！",
      blocks: [
        { tiles: ["3m", "4m", "5m"], label: "完成" },
        { tiles: ["6p", "7p", "8p"], label: "完成" },
        { tiles: ["5z", "5z", "5z"], label: "完成" },
        { tiles: ["9m", "9m"], label: "アタマ" },
        { tiles: ["2s", "4s"], label: "サンソー待ち", isWait: true }
      ],
      options: [
        { text: "サンソー（3索） だけ（カンチャン待ち）", correct: true },
        { text: "イーソー（1索） または ウーソー（5索）", correct: false },
        { text: "キューマン（九萬）", correct: false }
      ],
      explanation: "正解！間を埋める「サンソー（3索）」がハマれば［2・3・4索］になって完成です！",
      term: {
        word: "カンチャン待ち（嵌張待ち）",
        reading: "カンチャンマチ",
        tiles: ["2s", "4s"],
        desc: "1つ飛んだ数字の真ん中1種類だけを待つ形です。リーチをかければ相手も読みづらい待ちになります！"
      }
    },
    {
      id: "s4-13",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "13枚の待ちあて",
      question: "マンズの左端［イーマン・リャンマン（一・二萬）］に注目！あと何が来ればアガリ？",
      subtext: "「ゼロ萬」はありませんよ！",
      blocks: [
        { tiles: ["4p", "5p", "6p"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["7z", "7z", "7z"], label: "完成" },
        { tiles: ["2p", "2p"], label: "アタマ" },
        { tiles: ["1m", "2m"], label: "サンマン待ち", isWait: true }
      ],
      options: [
        { text: "サンマン（三萬） だけ（ペンチャン待ち）", correct: true },
        { text: "イーマン（一萬） または サンマン（三萬）", correct: false },
        { text: "リャンピン（2筒）", correct: false }
      ],
      explanation: "完璧！端っこの［イーマン・リャンマン（一・二萬）］なので、「サンマン（三萬）」1種類だけのペンチャン待ちです！",
      term: {
        word: "ペンチャン待ち（辺張待ち）",
        reading: "ペンチャンマチ",
        tiles: ["1m", "2m"],
        desc: "「1・2」の3待ち、または「8・9」の7待ちのこと。片側しか待てないため4枚しか当たり牌がありません。"
      }
    },
    {
      id: "s4-14",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "13枚の待ちあて",
      question: "3枚ブロックが4つ完成していて、真っ白な［白］が1枚だけ残っています！何が来ればアガリ？",
      subtext: "アタマを作る最後の1枚を待っています！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["3p", "4p", "5p"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["8m", "8m", "8m"], label: "完成" },
        { tiles: ["5z"], label: "ハク待ち", isWait: true }
      ],
      options: [
        { text: "ハク（白 / 単騎待ち）", correct: true },
        { text: "ハツ（發） または チュン（中）", correct: false },
        { text: "パーマン（八萬）", correct: false }
      ],
      explanation: "お見事！字牌の単騎待ちは、相手が「1枚だけ浮いた字牌だから安全かな？」とポロッと捨ててくれやすい人気の待ちです！",
      term: {
        word: "ジハイタンキ（字牌単騎）",
        reading: "タンキマチ",
        tiles: ["5z"],
        desc: "字牌1枚でアタマ完成を待つ単騎待ち。相手から出やすい実戦のテクニックです！"
      }
    },
    {
      id: "s4-15",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "pon",
      modeLabel: "13枚の待ちあて",
      question: "［ローピン（6筒）］と［東（トン）］の2組ペアがあります！何が来ればアガリ形になる？",
      subtext: "ペアが2つあるシャボ待ちです！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["3s", "4s", "5s"], label: "完成" },
        { tiles: ["7s", "8s", "9s"], label: "完成" },
        { tiles: ["6p", "6p"], label: "ペア①", isWait: true },
        { tiles: ["1z", "1z"], label: "ペア②", isWait: true }
      ],
      options: [
        { text: "ローピン（6筒） または トン（東）（シャボ待ち）", correct: true },
        { text: "ウーピン（5筒） または チーピン（7筒）", correct: false },
        { text: "トン（東） だけ", correct: false }
      ],
      explanation: "大正解！ローピン（6筒）とトン（東）のどちらが3枚目になっても、もう片方がアタマになってアガリ完成です！",
      term: {
        word: "シャボ待ち（双碰待ち）",
        reading: "シャボマチ",
        tiles: ["6p", "6p", "1z", "1z"],
        desc: "2つの対子のどちらでもアガれる待ち。字牌が絡むシャボ待ちは相手からとても出やすい強い待ちです！"
      }
    },
    {
      id: "s4-16",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "13枚の待ちあて",
      question: "ピンズの［赤ウーピン・ローピン（赤5・6筒）］コンビが待っています！あと何が来ればアガリ？",
      subtext: "赤ウーピン（赤5筒）は普通のウーピン（5筒）と同じです！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["6m", "7m", "8m"], label: "完成" },
        { tiles: ["3s", "4s", "5s"], label: "完成" },
        { tiles: ["7s", "7s"], label: "アタマ" },
        { tiles: ["0p", "6p"], label: "スー・チーピン待ち", isWait: true }
      ],
      options: [
        { text: "スーピン（4筒） または チーピン（7筒）（両面待ち）", correct: true },
        { text: "ウーピン（5筒） または ローピン（6筒）", correct: false },
        { text: "チーソー（7索）", correct: false }
      ],
      explanation: "バッチリ！［5筒・6筒］と同じなので「スーピン（4筒）」または「チーピン（7筒）」の両面待ちです！",
      term: {
        word: "スー・チー待ち（4・7待ち）",
        reading: "5・6の両面",
        tiles: ["0p", "6p"],
        desc: "「5・6」を持っているときの「4・7」待ち。すべて2〜8で収まりやすく高得点になりやすい好形です！"
      }
    },
    {
      id: "s4-17",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "応用パズル！",
      question: "ピンズが［4・5・6・7筒］と4枚連続で並んでいます！何が来れば「3枚組＋アタマ」になる？",
      subtext: "4枚連続のノベタン待ちです！",
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["6s", "7s", "8s"], label: "完成" },
        { tiles: ["6z", "6z", "6z"], label: "完成" },
        { tiles: ["4p", "5p", "6p", "7p"], label: "4枚並び!", isWait: true }
      ],
      options: [
        { text: "スーピン（4筒） または チーピン（7筒）（両端のどちらでもOK！）", correct: true },
        { text: "サンピン（3筒） または パーピン（8筒）", correct: false },
        { text: "ウーピン（5筒） または ローピン（6筒）", correct: false }
      ],
      explanation: "すごい！！スーピン（4筒）が来れば［44］＋［567］、チーピン（7筒）が来れば［456］＋［77］で見事に完成します！",
      term: {
        word: "ノベタン（延べ単騎）",
        reading: "ノベタン",
        tiles: ["4p", "5p", "6p", "7p"],
        desc: "4枚連続の形（4567など）で両端の2種類（4と7）を待てる形。単騎待ちの2倍アガりやすい好形です！"
      }
    },
    {
      id: "s4-18",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "13枚の待ちあて",
      question: "マンズの［チーマン・キューマン（七・九萬）］に注目！あと何が来ればアガリ？",
      subtext: "7と9の間が1つ抜けています！",
      blocks: [
        { tiles: ["2p", "3p", "4p"], label: "完成" },
        { tiles: ["4s", "5s", "6s"], label: "完成" },
        { tiles: ["1z", "1z", "1z"], label: "完成" },
        { tiles: ["5p", "5p"], label: "アタマ" },
        { tiles: ["7m", "9m"], label: "パーマン待ち", isWait: true }
      ],
      options: [
        { text: "パーマン（八萬） だけ（カンチャン待ち）", correct: true },
        { text: "ローマン（六萬） または パーマン（八萬）", correct: false },
        { text: "ウーピン（5筒）", correct: false }
      ],
      explanation: "完璧！7と9の間、「パーマン（八萬）」が入れば［七・八・九萬］が完成してアガリです！",
      term: {
        word: "テンパイケイ（テンパイ形 / 最終形）",
        reading: "マチのかたち",
        tiles: ["7m", "9m"],
        desc: "13枚から完成した4ブロックを除いた残り1〜4枚を見れば、どんな手でも待ちが一瞬で分かります！"
      }
    }
  ],

  // ==========================================================================
  // Stage 5: 実戦の約束「3大武器とフリテン」（現在 20 問）
  // ==========================================================================
  stage5: [
    {
      id: "s5-1",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "約束① リーチ",
      question: "1回もポン・チーせずに「あと1枚」になりました！でも『白發中』も『タンヤオ』もありません。どうすればアガれる？",
      subtext: "麻雀には「形を作っただけではアガれない（役が1つ必要）」というルールがあります。",
      blocks: [
        { tiles: ["1m", "2m", "3m"], label: "完成" },
        { tiles: ["5p", "6p", "7p"], label: "完成" },
        { tiles: ["7s", "8s", "9s"], label: "完成" },
        { tiles: ["2p", "2p"], label: "アタマ" },
        { tiles: ["6m", "8m"], label: "あと1枚!", isWait: true }
      ],
      options: [
        { text: "⭕ 「リーチ！」と宣言する（リーチが役になる）", correct: true },
        { text: "❌ チーして早く揃える", correct: false }
      ],
      explanation: "大正解！1回も鳴いていなければ、「リーチ！」と宣言するだけで立派な役がつき、どんな手でも堂々とアガれます！",
      term: {
        word: "リーチ（立直）",
        reading: "リーチ",
        tiles: ["6m", "8m"],
        desc: "1回も鳴かずにテンパイしたとき、1000点棒を出して宣言する最強の基本役。裏ドラというボーナスチャンスも増えます！"
      }
    },
    {
      id: "s5-2",
      type: "text-choice",
      callSound: "pon",
      modeLabel: "約束② 鳴いていい時",
      question: "逆に、相手の牌を「ポン・チー（鳴き）」するとリーチができなくなります。初心者が鳴いていい『2つの安全パターン』は？",
      subtext: "これ以外のときに鳴くと「揃ったのにアガれない！」という罠にハマります。",
      boardTiles: ["5z", "6z", "7z", "2m", "5p", "8s"],
      caption: "鳴いても消えない頼もしい味方たち",
      options: [
        { text: "⭕ 『白・發・中（ハク・ハツ・チュン）』を3枚揃える時 か 『2〜8の数牌だけ』で揃える時", correct: true },
        { text: "❌ 『1・2・3』などの端っこをチーして急ぐ時", correct: false }
      ],
      explanation: "その通り！最初は「リーチ」「白・發・中」「タンヤオ（2〜8だけ）」の3つの武器だけで麻雀は十分に勝てます！",
      term: {
        word: "メンゼン（門前）",
        reading: "メンゼン",
        tiles: ["5z", "6z", "7z"],
        desc: "1回もポン・チーせずに自分の力だけで手牌を進めている状態のこと。迷ったら鳴かずに門前リーチを目指せば安心です！"
      }
    },
    {
      id: "s5-3",
      type: "text-choice",
      callSound: "pon",
      modeLabel: "風牌のひっかけ！",
      question: "今は「東場（全員の風が東）」で、あなたの席は「南家」です。他家から出た『西』をポンして3枚にしました。これだけで役になる？",
      subtext: "「白・發・中」は何でも役になりますが、方角の牌は…？",
      boardTiles: ["3z", "3z", "3z"],
      caption: "東場・南家のときに集めた「西」3枚",
      options: [
        { text: "❌ ならない（場風でも自風でもない『オタ風』だから）", correct: true },
        { text: "⭕ なる（字牌はどれでも3枚で役になる）", correct: false }
      ],
      explanation: "よく見抜きました！東場・南家のとき、役になる風牌は「東」と「南」だけ。関係ない「西・北」はポンしても役になりません！",
      term: {
        word: "オタ風（客風牌）",
        reading: "オタカゼ",
        tiles: ["3z", "4z"],
        desc: "場の風（東場なら東）でも自分の席の風でもない風牌のこと。3枚集めても役にならないので、アタマとして使うのが基本です！"
      }
    },
    {
      id: "s5-4a",
      type: "tile-choice",
      callSound: "tsumo",
      modeLabel: "本番のドラ表示！",
      question: "場の山に『スーマン（四萬）』が1枚めくれています（ドラ表示牌）。この局でボーナスがつく『ドラ』はどの牌？",
      subtext: "本番では「めくれている表示牌の『次』の牌」がドラになります！",
      doraIndicator: "4m",
      boardNote: "▲ 本番の王牌（めくれている牌の「次」がドラ！）",
      tileOptions: [
        { tile: "5m", correct: true },
        { tile: "4m", correct: false },
        { tile: "3m", correct: false }
      ],
      explanation: "大正解！！本番ではめくれている「ドラ表示牌」そのものではなく、その1つ次の『ウーマン（五萬）』がドラになります！（※9の次は1、風牌は東→南→西→北→東、三元牌は白→發→中→白の順）",
      term: {
        word: "ドラ表示牌",
        reading: "ドラヒョウジハイ",
        tiles: ["4m", "5m"],
        desc: "山の端に1枚だけ表向きにめくられた牌のこと。この牌の「次の順番の牌」が実際のドラになります！"
      }
    },
    {
      id: "s5-4",
      type: "text-choice",
      callSound: "kan",
      modeLabel: "ドラの落とし穴！",
      question: "手牌に「ドラ」や「赤ドラ」が合計3枚もあります！でも『リーチ』も『役牌』も『タンヤオ』もありません。アガれる？",
      subtext: "超重要なルールです！ドラは「役」になるでしょうか？",
      boardTiles: ["5m", "5m", "0m"],
      caption: "ドラがたっぷり3枚ある状態",
      options: [
        { text: "❌ アガれない！（ドラはおまけの加点なので『役』にはならない）", correct: true },
        { text: "⭕ ドラが1枚でもあればアガれる", correct: false }
      ],
      explanation: "大正解！！ドラは「アガった後に乗るボーナス点」なので、ドラだけではアガれません。必ずリーチやタンヤオなどの「役」を1つ作りましょう！",
      term: {
        word: "ドラ（懸賞牌）",
        reading: "ドラ",
        tiles: ["0m", "5m"],
        desc: "アガったときに1枚につき1飜（ハン）点数を増やしてくれるボーナス牌。ただしドラ自体は「アガるための役」にはなりません！"
      }
    },
    {
      id: "s5-5",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "約束③ フリテンの罠",
      question: "あなたは［リャンソー・ウーソー（2・5索）］待ちです。でも、自分の捨て牌に『リャンソー（2索）』がありました！相手から出た『リャンソー（2索）』でロンできる？",
      subtext: "スマホ麻雀で初心者が一番パニックになるルールです！",
      river: [
        { tile: "9m" },
        { tile: "1z" },
        { tile: "2s", highlight: true },
        { tile: "4z" }
      ],
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["5p", "6p", "7p"], label: "完成" },
        { tiles: ["7z", "7z", "7z"], label: "中3枚" },
        { tiles: ["8p", "8p"], label: "アタマ" },
        { tiles: ["3s", "4s"], label: "リャン・ウーソー待ち", isWait: true }
      ],
      options: [
        { text: "❌ ロンできない！（自分で捨てた牌はフリテン）", correct: true },
        { text: "⭕ 役（チュン / 中）があるからロンできる", correct: false }
      ],
      explanation: "超重要！自分が過去に捨てた牌では、相手から「ロン」できません（フリテン）。「揃ったのにロンが出ない！」の原因はほぼコレです！",
      term: {
        word: "フリテン（振聴）",
        reading: "フリテン",
        tiles: ["2s"],
        desc: "自分のアガリ牌が自分の捨て牌（河）にある状態のこと。相手から「ロン」することは禁止されます（役があっても不可）。"
      }
    },
    {
      id: "s5-6",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "ron",
      modeLabel: "フリテンの重要ルール",
      question: "同じく［リャンソー・ウーソー（2・5索）］待ちで、捨て牌に『リャンソー（2索）』があります。相手から、捨てていない方の『ウーソー（5索）』が出ました！ロンできる？",
      subtext: "ウーソー（5索）自体は捨てていませんが…？",
      river: [
        { tile: "9m" },
        { tile: "1z" },
        { tile: "2s", highlight: true },
        { tile: "4z" }
      ],
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["5p", "6p", "7p"], label: "完成" },
        { tiles: ["7z", "7z", "7z"], label: "中3枚" },
        { tiles: ["8p", "8p"], label: "アタマ" },
        { tiles: ["3s", "4s"], label: "リャン・ウーソー待ち", isWait: true }
      ],
      options: [
        { text: "❌ ウーソー（5索）でもロンできない！（片方でも捨てていたら全部ロン不可）", correct: true },
        { text: "⭕ ウーソー（5索）は捨てていないからロンできる", correct: false }
      ],
      explanation: "よくぞ見抜きました！待ち牌のうち1種類でも自分の捨て牌にあると、他の当たり牌でも「ロン」は一切できなくなります。",
      term: {
        word: "ホー（河 / 捨て牌）",
        reading: "ホー",
        tiles: ["9m", "1z", "2s"],
        desc: "各プレイヤーの前に並んでいる「捨て牌置き場」のこと。自分の河にある牌が待ちに1つでも混ざるとフリテンになります！"
      }
    },
    {
      id: "s5-7",
      type: "scaffold-wait",
      defaultScaffold: false,
      callSound: "tsumo",
      modeLabel: "フリテン脱出法！",
      question: "うっかりフリテンになってしまいました！この手牌のままアガる方法はある？",
      subtext: "「ロン（相手からもらう）」がダメなら…？",
      river: [
        { tile: "9m" },
        { tile: "1z" },
        { tile: "2s", highlight: true },
        { tile: "4z" }
      ],
      blocks: [
        { tiles: ["2m", "3m", "4m"], label: "完成" },
        { tiles: ["5p", "6p", "7p"], label: "完成" },
        { tiles: ["7z", "7z", "7z"], label: "中3枚" },
        { tiles: ["8p", "8p"], label: "アタマ" },
        { tiles: ["3s", "4s"], label: "リャン・ウーソー待ち", isWait: true }
      ],
      options: [
        { text: "⭕ 自分の番に山から引けば（ツモなら）アガれる！", correct: true },
        { text: "❌ どうやっても絶対にアガれない", correct: false }
      ],
      explanation: "大正解！！フリテンで禁止されるのは「相手からのロン」だけ。自分で引く「ツモ」ならいつでも堂々とアガれます！",
      term: {
        word: "ツモアガリ（自摸和了）",
        reading: "ツモ",
        tiles: ["5s"],
        desc: "自分の番に山から引いた牌でアガること。フリテン中でもアガれるうえ、門前なら「門前清自摸和（メンゼンツモ）」という役もつきます！"
      }
    },
    {
      id: "s5-8",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "実戦の注意点！",
      question: "リーチをかけたあと、相手から出た当たり牌をうっかり見逃しました（スルー）。そのあと別の人から出た当たり牌でロンできる？",
      subtext: "リーチ後の見逃しルールです！",
      boardTiles: ["2m", "3m", "4m", "5p", "6p", "7p"],
      caption: "リーチ後に当たり牌を1回スルーした状態",
      options: [
        { text: "❌ できない！（リーチ後に1回でも見逃すと、ずっとフリテンになる）", correct: true },
        { text: "⭕ 別の人からならロンできる", correct: false }
      ],
      explanation: "バッチリ！リーチ後に当たり牌をスルーすると「リーチ後フリテン」になり、以降はツモでしかアガれなくなります。リーチ後は迷わずロンしましょう！",
      term: {
        word: "ミノガシフリテン（見逃し振聴）",
        reading: "リーチごフリテン",
        tiles: ["2m", "3m", "4m"],
        desc: "リーチ後に他家の当たり牌を見逃すと、その局が終わるまで永続的にフリテン（ロン不可・ツモのみ可）になるルールです。"
      }
    },
    {
      id: "s5-9",
      type: "tile-choice",
      callSound: "tsumo",
      modeLabel: "本番のドラ表示②",
      question: "王牌のドラ表示牌に端っこの『キューピン（9筒）』がめくれています！このとき『ドラ』になる牌はどれ？",
      subtext: "10筒は存在しません！「9」の次は何に戻るでしょう？",
      doraIndicator: "9p",
      boardNote: "▲ 9がめくれた時は最初の数字にループします！",
      tileOptions: [
        { tile: "1p", correct: true },
        { tile: "9p", correct: false },
        { tile: "8p", correct: false }
      ],
      explanation: "大正解！！表示牌が「9」のときは、同じ種類の「1（今回はイーピン / 1筒）」にぐるっと戻ってドラになります！",
      term: {
        word: "ドラのループ（9→1）",
        reading: "ドラの順番",
        tiles: ["9p", "1p"],
        desc: "数牌のドラは「1→2→…→8→9→1」とループします。表示牌がキューマン（9萬）ならイーマン（一萬）、キューソー（9索）ならイーソー（1索 / 鳥）がドラです！"
      }
    },
    {
      id: "s5-10",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "本番のドラ表示③",
      question: "ドラ表示牌に風牌の『東（トン）』がめくれています！このとき『ドラ』になる牌はどれ？",
      subtext: "方角の順番は「東 → 南 → 西 → 北」です！",
      doraIndicator: "1z",
      boardNote: "▲ 東・南・西・北の順番を思い出そう！",
      tileOptions: [
        { tile: "2z", correct: true },
        { tile: "1z", correct: false },
        { tile: "3z", correct: false }
      ],
      explanation: "バッチリ！！風牌は「東→南→西→北→東」の順番なので、東がめくれていたら次の『南』がドラになります！",
      term: {
        word: "フォンパイドラ（風牌の順番）",
        reading: "トン→ナン→シャー→ペー",
        tiles: ["1z", "2z", "3z", "4z"],
        desc: "方角のドラ表示は「東→南→西→北→（最初に戻って）東」の順になります！"
      }
    },
    {
      id: "s5-11",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "本番のドラ表示④",
      question: "ドラ表示牌に風牌の最後『北（ペー）』がめくれています！このとき『ドラ』になる牌はどれ？",
      subtext: "「東→南→西→北」の次はどこに戻る？（※白には行きません！）",
      doraIndicator: "4z",
      boardNote: "▲ 風牌4つの中だけでループします！",
      tileOptions: [
        { tile: "1z", correct: true },
        { tile: "5z", correct: false },
        { tile: "3z", correct: false }
      ],
      explanation: "お見事！！風牌は風牌4種類の中でループするため、「北」の次は最初に戻って『東』がドラになります！",
      term: {
        word: "ペー表示のドラ（北→東）",
        reading: "ペーの次はトン",
        tiles: ["4z", "1z"],
        desc: "初心者が一番迷いやすいポイント！北の次は白ではなく、風牌の先頭である「東」に戻ります。"
      }
    },
    {
      id: "s5-12",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "本番のドラ表示⑤",
      question: "ドラ表示牌に真っ白な『白（ハク）』がめくれています！このとき『ドラ』になる牌はどれ？",
      subtext: "三元牌の順番はいつも口に出す「白・發・中（ハク・ハツ・チュン）」の順です！",
      doraIndicator: "5z",
      boardNote: "▲ 白 → 發 → 中 の順番！",
      tileOptions: [
        { tile: "6z", correct: true },
        { tile: "7z", correct: false },
        { tile: "5z", correct: false }
      ],
      explanation: "大正解！！三元牌は「白 → 發 → 中 → 白」の順番なので、白がめくれていたら次の『發』がドラです！",
      term: {
        word: "サンゲンパイドラ（三元牌の順番）",
        reading: "ハク→ハツ→チュン",
        tiles: ["5z", "6z", "7z"],
        desc: "三元牌のドラは覚えやすく、普段呼ぶ順番そのまま「白→發→中→（戻って）白」です！"
      }
    },
    {
      id: "s5-13",
      type: "tile-choice",
      callSound: "pon",
      modeLabel: "本番のドラ表示⑥",
      question: "ドラ表示牌に赤い『中（チュン）』がめくれています！このとき『ドラ』になる牌はどれ？",
      subtext: "「白 → 發 → 中」の次はどれに戻るでしょう？",
      doraIndicator: "7z",
      boardNote: "▲ 三元牌3つの中でループします！",
      tileOptions: [
        { tile: "5z", correct: true },
        { tile: "1z", correct: false },
        { tile: "6z", correct: false }
      ],
      explanation: "完璧です！！「白→發→中」の次は先頭の『白（真っ白な牌）』がドラになります。これで本番のドラ読みは完全マスターです！",
      term: {
        word: "チュン表示のドラ（中→白）",
        reading: "チュンの次はハク",
        tiles: ["7z", "5z"],
        desc: "中がめくれているときは「白」がドラ！白をポンできれば役牌＋ドラ3で一気に満貫級になります！"
      }
    },
    {
      id: "s5-14",
      type: "text-choice",
      callSound: "pon",
      modeLabel: "自分の風（自風）",
      question: "今は「東場」で、あなたの席は「東家（親）」です。『東』をポンして3枚集めたら何飜つく？",
      subtext: "場の風（東）と、自分の席の風（東）が重なっています！",
      boardTiles: ["1z", "1z", "1z"],
      caption: "東場・東家で揃えた「東」3枚",
      options: [
        { text: "⭕ 2飜つく！（場風の1飜＋自風の1飜がダブルで重なる！）", correct: true },
        { text: "❌ 重なっても1飜だけ", correct: false }
      ],
      explanation: "大正解！！東場の親（東家）にとっての「東」は『ダブ東（連風牌）』と呼ばれ、ポンするだけでなんと2飜つきます！",
      term: {
        word: "ダブ東（連風牌）",
        reading: "ダブトン",
        tiles: ["1z", "1z", "1z"],
        desc: "東場の東家が集めた「東」（南場の南家なら「ダブ南」）のこと。3枚だけで2飜になる超強力な役牌です！"
      }
    },
    {
      id: "s5-15",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "リーチの条件",
      question: "すでに『白』をポンして右端に晒しています。残りも揃ってテンパイしました！「リーチ！」と宣言できる？",
      subtext: "リーチができる一番大事な条件です！",
      boardTiles: ["5z", "5z", "5z"],
      caption: "1回ポンして鳴いている状態",
      options: [
        { text: "❌ できない！（1回でもポン・チーしたらリーチは不可）", correct: true },
        { text: "⭕ 1000点払えば鳴いていてもリーチできる", correct: false }
      ],
      explanation: "その通り！リーチは「門前（1回も鳴いていない状態）」だけの特権です。ただし白をポンしていれば、リーチしなくても「役牌（白）」の役があるのでそのままロン・ツモできます！",
      term: {
        word: "メンゼンゲンテイ（門前限定）",
        reading: "鳴くと使えない役",
        tiles: ["2m", "3m", "4m"],
        desc: "リーチ・平和（ピンフ）・一盃口・七対子など、1回もポン・チーしていない時だけ成立する役のことです。"
      }
    },
    {
      id: "s5-16",
      type: "text-choice",
      callSound: "tsumo",
      modeLabel: "ツモの嬉しい役！",
      question: "1回もポン・チーせずにテンパイしていましたが、リーチはかけずに様子を見ていたら、自分の番に当たり牌を山から引きました！アガれる？",
      subtext: "タンヤオや役牌が1つもない手牌だとします！",
      boardTiles: ["1m", "2m", "3m", "9p", "9p"],
      caption: "鳴かずに自力で山から引いた（ツモ）場面",
      options: [
        { text: "⭕ アガれる！（鳴いていなければ『門前ツモ』という1飜の役がつく！）", correct: true },
        { text: "❌ リーチしていないからツモでもアガれない", correct: false }
      ],
      explanation: "知っておくと超お得！1回も鳴いていない（門前）状態なら、自分で山から引くだけで「門前清自摸和（メンゼンツモ）」という1飜役がつきます！（※相手からのロンには別の役が必要です）",
      term: {
        word: "メンゼンツモ（門前清自摸和）",
        reading: "ツモ（1飜）",
        tiles: ["1m", "2m", "3m"],
        desc: "1回も鳴かずに自力でツモアガリしたときにつく1飜役。鳴いているとこの役はつかないので注意！"
      }
    },
    {
      id: "s5-17",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "裏ドラの楽しみ！",
      question: "「リーチ！」をかけて見事アガった人だけがめくれる、秘密のボーナスドラを何と呼ぶ？",
      subtext: "ドラ表示牌のすぐ下に隠れている牌を見られます！",
      boardTiles: ["4m", "5m"],
      caption: "リーチでアガった人だけの特権ボーナス！",
      options: [
        { text: "⭕ 裏ドラ（乗れば一気に高得点！）", correct: true },
        { text: "❌ 横ドラ", correct: false }
      ],
      explanation: "大正解！リーチをしてアガると、ドラ表示牌の下にある牌をめくって「裏ドラ」を追加できます。リーチが強い最大の理由です！",
      term: {
        word: "ウラドラ（裏ドラ）",
        reading: "ウラドラ",
        tiles: ["5m"],
        desc: "リーチをかけてアガったときだけ有効になる隠れドラ。運良く手牌に重なれば一気に満貫・跳満に化けます！"
      }
    },
    {
      id: "s5-18",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "フリテン確認クイズ",
      question: "他の人が捨てた『サンソー（3索）』はフリテンになりません。では、フリテンかどうかチェックするときに見るのは「誰の」捨て牌（河）？",
      subtext: "他人の捨て牌に自分の待ち牌があることはよくありますが…？",
      boardTiles: ["3s", "4s"],
      caption: "誰の捨て牌を見るとフリテンがわかる？",
      options: [
        { text: "⭕ 「自分自身」の捨て牌だけ見ればOK！（他人が捨てた牌は関係ない）", correct: true },
        { text: "❌ 4人全員の捨て牌に1枚でもあったらフリテン", correct: false }
      ],
      explanation: "安心してください！他の人が過去に捨てた牌はフリテンと一切関係ありません（ただしリーチ後に当たり牌を見逃した時だけ注意）。見るのは自分の河だけです！",
      term: {
        word: "ゲンブツフリテン（現物振聴）",
        reading: "自分の捨て牌チェック",
        tiles: ["3s"],
        desc: "自分の捨て牌（河）の中に、今の自分の待ち牌が含まれている状態のこと。他人の捨て牌は関係ありません！"
      }
    },
    {
      id: "s5-19",
      type: "text-choice",
      callSound: "tsumo",
      modeLabel: "テンパイ料のルール",
      question: "誰もアガれないまま山の牌が全部なくなりました（流局）！このとき「テンパイ（あと1枚）」していた人にはいいことがある？",
      subtext: "アガれなくても最後まで諦めないメリットです！",
      boardTiles: ["2p", "3p"],
      caption: "山が尽きて引き分け（流局）になった場面",
      options: [
        { text: "⭕ テンパイしていない人から点数（合計3000点分）をもらえる！", correct: true },
        { text: "❌ 何も起きない", correct: false }
      ],
      explanation: "そうなんです！流局したとき、テンパイしている人はノーテンの人から点数（ノーテン罰符）をもらえます。8枚・13枚でテンパイを目指す技術がここでも活きます！",
      term: {
        word: "リュウキョク（流局）",
        reading: "リュウキョク",
        tiles: ["2p", "3p"],
        desc: "誰もアガらないまま山が尽きてその局が終わること。テンパイしていれば手牌を公開して点数がもらえます！"
      }
    }
  ],

  // ==========================================================================
  // Stage 6: 合体！「ポン・チー・カン入門」（現在 16 問）
  // ==========================================================================
  stage6: [
    {
      id: "s6-1",
      type: "slot-fill",
      callSound: "pon",
      modeLabel: "ポン合体パズル！",
      question: "手牌に『發』が2枚あります！誰かが捨てた3枚目の『發』をもらって「ポン！」しよう！",
      subtext: "空欄［ ？ ］に牌をはめて3枚組を完成させよう！",
      slots: ["6z", "6z", "?"],
      tileOptions: [
        { tile: "6z", correct: true },
        { tile: "5z", correct: false },
        { tile: "7z", correct: false }
      ],
      explanation: "ポン！！相手が捨てた3枚目をもらって、あっという間に「發」の役牌ブロックが完成しました！",
      term: {
        word: "ポン（碰）",
        reading: "ポン",
        tiles: ["6z", "6z", "6z"],
        desc: "手牌に同じ牌が2枚あるとき、他の誰かが捨てた3枚目をもらって「同じ牌3枚組（刻子）」を作る技です！"
      }
    },
    {
      id: "s6-2",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "チー合体パズル！",
      question: "左隣の人（上家）が牌を捨てました！手牌の［スーピン・ウーピン（4・5筒）］と合体させて「チー！」しよう！",
      subtext: "［4・5筒］の後ろに繋がって、3枚の階段になる牌をはめよう！",
      slots: ["4p", "5p", "?"],
      tileOptions: [
        { tile: "6p", correct: true },
        { tile: "6s", correct: false },
        { tile: "9p", correct: false }
      ],
      explanation: "チー！！左隣の人が捨てたローピン（6筒）をもらって、［4・5・6筒］の階段が完成しました！",
      term: {
        word: "チー（吃）",
        reading: "チー",
        tiles: ["4p", "5p", "6p"],
        desc: "自分のすぐ左隣の人（上家）が捨てた牌をもらって、「数字の階段3枚組（順子）」を作る技です！"
      }
    },
    {
      id: "s6-3",
      type: "text-choice",
      callSound: "chi",
      modeLabel: "超重要ルール！",
      question: "あなたは［リャンマン・サンマン（二・三萬）］を持っています。正面に座っている人（対面）が『スーマン（四萬）』を捨てました！「チー」できる？",
      subtext: "「誰から」チーできるかの大事なルールです！",
      boardTiles: ["2m", "3m"],
      caption: "正面の人（対面）が「スーマン（四萬）」を捨てた場面",
      options: [
        { text: "❌ できない！（チーできるのは左隣の『上家』からだけ！）", correct: true },
        { text: "⭕ 誰からでもチーできる", correct: false }
      ],
      explanation: "大正解！！「チー」ができるのは自分のすぐ左隣の人（上家＝カミチャ）が捨てた牌だけです。正面や右の人からはチーできません！",
      term: {
        word: "カミチャ（上家 / 左隣）",
        reading: "カミチャ",
        tiles: ["2m", "3m", "4m"],
        desc: "自分から見て「すぐ左隣」の席の人のこと。麻雀は反時計回りに進むため、直前の番である上家からだけチーができます！"
      }
    },
    {
      id: "s6-4",
      type: "text-choice",
      callSound: "pon",
      modeLabel: "ポンとチーの違い",
      question: "今度は［中・中］と2枚持っています。右隣の人（下家）や正面の人（対面）が『中』を捨てました！「ポン」できる？",
      subtext: "ポンも左隣の人からだけでしょうか？",
      boardTiles: ["7z", "7z"],
      caption: "右隣・正面の人が「中」を捨てた場面",
      options: [
        { text: "⭕ できる！（ポンは左・正面・右の誰からでもOK！）", correct: true },
        { text: "❌ できない（左隣からだけ）", correct: false }
      ],
      explanation: "バッチリ！！「チーは左隣だけ、ポンは3人誰からでもOK！」この違いを押さえれば鳴きの基本は完璧です！",
      term: {
        word: "ナキ（副露 / ポン・チー・カン）",
        reading: "フーロ / ナキ",
        tiles: ["7z", "7z", "7z"],
        desc: "ポン・チー・カンをして他人の捨て牌をもらい、自分の手牌の右端に表向きで並べることを「鳴き（副露）」と呼びます。"
      }
    },
    {
      id: "s6-5",
      type: "tap-hand",
      callSound: "chi",
      modeLabel: "手牌をタップ！",
      question: "左隣の人（上家）が『ウーピン（5筒）』を捨てました！手牌の中で、一緒に「チー」して階段を作れる牌をタップしよう！",
      subtext: "ウーピン（5筒）と繋がって［5・6・7筒］になるパーツを探そう！",
      hand: ["2m", "6p", "7p", "9s", "1z"],
      correctTiles: ["6p", "7p"],
      caption: "👆 一緒にチーできる牌（ローピン または チーピン）をタップ！",
      explanation: "ナイス！！手牌の「ローピン・チーピン（6・7筒）」と相手の「ウーピン（5筒）」を合わせれば［5・6・7筒］が完成しますね！",
      term: {
        word: "サラシ（晒し）",
        reading: "サラシ",
        tiles: ["5p", "6p", "7p"],
        desc: "鳴いて完成させた3枚組は、全員に見えるように卓の右下に表向きで置きます（誰からもらったか分かるよう1枚を横向きにします）。"
      }
    },
    {
      id: "s6-6",
      type: "text-choice",
      callSound: "pon",
      modeLabel: "鳴いた後の動き",
      question: "「ポン！」や「チー！」をして相手の牌を1枚もらった直後、あなたがやることはどっち？",
      subtext: "手牌の枚数が増えすぎないようにするルールです！",
      boardTiles: ["5p", "6p", "7p"],
      caption: "相手の牌をもらってブロックを作った直後",
      options: [
        { text: "⭕ 山からは引かず、そのまま手牌から不要な牌を1枚捨てる", correct: true },
        { text: "❌ さらに山からも1枚ツモってくる", correct: false }
      ],
      explanation: "その通り！「山から1枚引く代わり」に相手の捨て牌を1枚もらったので、そのまま手牌から不要な牌を1枚捨てて次の人に番が移ります。",
      term: {
        word: "ツモ番スキップ",
        reading: "鳴きの手順",
        tiles: ["5p", "6p", "7p"],
        desc: "誰かがポンすると、間の人の順番を飛ばしてポンした人の番になり、手牌から1枚捨てたらその右隣の人へ順番が進みます。"
      }
    },
    {
      id: "s6-7",
      type: "text-choice",
      callSound: "pon",
      modeLabel: "優先順位クイズ！",
      question: "捨てられた1枚の牌に対して、Aさんが「チー！」、Bさんが「ポン！」とほぼ同時に言いました。優先されるのはどっち？",
      subtext: "オンライン麻雀でも自動でこの優先順になります！",
      boardTiles: ["3s", "3s", "3s"],
      caption: "「ポン」と「チー」が重なった場面",
      options: [
        { text: "⭕ 「ポン」が優先される！（ロン ＞ ポン ＞ チーの順）", correct: true },
        { text: "❌ 「チー」が優先される", correct: false }
      ],
      explanation: "大正解！優先順位は「①ロン（アガリ） ＞ ②ポン・カン ＞ ③チー」です。だからスマホ麻雀でチーボタンを押したのに他の人にポンされることがあるんですね！",
      term: {
        word: "ハッセイの優先順位（ポン優先）",
        reading: "ロン ＞ ポン ＞ チー",
        tiles: ["3s", "3s", "3s"],
        desc: "同じ捨て牌に複数の声がかかった場合、アガリである「ロン」が最優先、次に「ポン・カン」、一番最後が「チー」になります。"
      }
    },
    {
      id: "s6-8",
      type: "slot-fill",
      callSound: "kan",
      modeLabel: "4枚集めてカン！",
      question: "同じ牌が3枚揃っています！［ ？ ］にもう1枚同じ牌をはめて豪快に「カン！」しよう！",
      subtext: "カンをすると「新しいドラ」が1枚増える特別な技です！",
      slots: ["8p", "8p", "8p", "?"],
      tileOptions: [
        { tile: "8p", correct: true },
        { tile: "7p", correct: false },
        { tile: "9p", correct: false }
      ],
      explanation: "カン！！同じ牌4枚を1つの3枚ブロック扱いにしつつ、ドラ表示牌が1枚新しくめくれて高得点のチャンスが広がります！",
      term: {
        word: "カン（槓）",
        reading: "カン",
        tiles: ["8p", "8p", "8p", "8p"],
        desc: "同じ牌4枚を1組にする大技（槓子＝カンツ）。4枚使うので手牌が1枚減るぶん山から1枚補充し、全員のドラが1つ増えます！"
      }
    },
    {
      id: "s6-9",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "超入門・最終問題！",
      question: "すべて「2〜8の数牌（タンヤオ）」だけでまとまりそうな手牌です！早くアガるためにポン・チーして進めてもOK？",
      subtext: "ここまで学んだ知識の総仕上げです！",
      boardTiles: ["2s", "3s", "4s", "0p", "5p", "5p"],
      caption: "赤ドラ入りのタンヤオ手牌",
      options: [
        { text: "⭕ どんどん鳴いてOK！（喰いタンで素早くアガれる！）", correct: true },
        { text: "❌ タンヤオは鳴くと消えるからダメ", correct: false }
      ],
      explanation: "全ステージ制覇レベルの大正解！！「役牌（白發中など）」と「タンヤオ」が確定している時は、ポン・チーして最速でアガるのが実戦でも最強の戦術です🎉",
      term: {
        word: "クイタン（鳴きタンヤオ）",
        reading: "クイタン",
        tiles: ["2s", "3s", "4s", "0p"],
        desc: "ポンやチー（鳴き）を使って素早く完成させるタンヤオのこと。スピード抜群で初心者が実戦で一番勝てる武器になります！"
      }
    },
    {
      id: "s6-10",
      type: "slot-fill",
      callSound: "pon",
      modeLabel: "ポン合体パズル！",
      question: "手牌に赤い字牌が2枚あります！相手が捨てた牌をもらって「ポン！」しよう！",
      subtext: "3枚揃えばその瞬間に1飜の役が確定します！",
      slots: ["7z", "7z", "?"],
      tileOptions: [
        { tile: "7z", correct: true },
        { tile: "6z", correct: false },
        { tile: "5z", correct: false }
      ],
      explanation: "ポン！！「中」の3枚ブロックが完成し、アガるための役（1飜）が確定しました！",
      term: {
        word: "ヤクハイバック（役牌後付け）",
        reading: "ヤクハイポン",
        tiles: ["7z", "7z", "7z"],
        desc: "白・發・中が2枚あるときは、誰から出ても迷わずポンしてアガリに向かうのがスピード勝負の基本です！"
      }
    },
    {
      id: "s6-11",
      type: "slot-fill",
      callSound: "chi",
      modeLabel: "チー合体パズル！",
      question: "手牌に［ウーソー・チーソー（5・7索）］があります！左隣（上家）から間に入る牌が出ました。「チー！」しよう！",
      subtext: "引きにくい間の牌を上家からもらう超有効ワザです！",
      slots: ["5s", "?", "7s"],
      tileOptions: [
        { tile: "6s", correct: true },
        { tile: "8s", correct: false },
        { tile: "6p", correct: false }
      ],
      explanation: "チー！！引きにくい真ん中の「ローソー（6索）」を左隣からもらって、一気に［5・6・7索］が完成しました！（※役牌やタンヤオがある時に使いましょう！）",
      term: {
        word: "キュウショのチー（急所鳴き）",
        reading: "カンチャン解消",
        tiles: ["5s", "6s", "7s"],
        desc: "自分で引きにくいカンチャン（間待ち）を上家からチーして埋めるのは、タンヤオや役牌手で大活躍するテクニックです！"
      }
    },
    {
      id: "s6-12",
      type: "text-choice",
      callSound: "chi",
      modeLabel: "チーできる席クイズ！",
      question: "あなたは［スーピン・ウーピン（4・5筒）］を持っています。すぐ右隣の人（下家）が『ローピン（6筒）』を捨てました！「チー」できる？",
      subtext: "チーできるのは左右どっちの隣だったでしょう？",
      boardTiles: ["4p", "5p"],
      caption: "右隣の人（下家）がローピン（6筒）を捨てた場面",
      options: [
        { text: "❌ できない！（チーは『左隣（上家）』からだけ！）", correct: true },
        { text: "⭕ 隣の人なら右からでもチーできる", correct: false }
      ],
      explanation: "引っかかりませんでしたね！チーができるのは「左隣（上家＝自分の直前の人）」からだけです。右隣（下家）からはチーできません！",
      term: {
        word: "シモチャ（下家 / 右隣）",
        reading: "シモチャ",
        tiles: ["4p", "5p", "6p"],
        desc: "自分の「すぐ右隣」の席の人のこと。下家からはポンとロンはできますが、チーはできません！"
      }
    },
    {
      id: "s6-13",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "鳴き判断実践！",
      question: "手牌に『イー・リャン・サンマン（1・2・3萬）』や『キューソー（9索）』があり、白・發・中などの役牌は1枚もありません。上家から出た牌をうっかり「チー！」するとどうなる？",
      subtext: "初心者が実戦で一番やってしまいがちなミスです！",
      boardTiles: ["1m", "2m", "3m", "9s", "9s"],
      caption: "端牌があり、役牌がない手牌",
      options: [
        { text: "⚠️ 『役なし』になってしまい、最後14枚揃ってもアガれなくなる！", correct: true },
        { text: "⭕ とりあえず早く揃えればいつでもアガれる", correct: false }
      ],
      explanation: "超重要！！1・9・字牌が混ざっていて役牌もないときに鳴くと、リーチもタンヤオも消えて「アガれない手（役なし）」になります。こういう手は鳴かずに門前リーチを目指しましょう！",
      term: {
        word: "ヤクナシ（役なし / アガリ不可）",
        reading: "ヤクナシ",
        tiles: ["1m", "2m", "3m"],
        desc: "14枚の形だけ揃えても「役」が1つもない状態。鳴く前に「白發中があるか？2〜8だけ（タンヤオ）か？」を確認すれば100%防げます！"
      }
    },
    {
      id: "s6-14",
      type: "tap-hand",
      callSound: "pon",
      modeLabel: "手牌をタップ！",
      question: "誰かが『白』を捨てました！手牌の中で「ポン！」してすぐに役牌1飜を確定できる牌をタップしよう！",
      subtext: "同じ牌が2枚あるペアを探そう！",
      hand: ["2m", "5p", "5z", "5z", "8s"],
      correctTiles: ["5z"],
      caption: "👆 ポンできるペアをタップ！",
      explanation: "ポン！！手牌に2枚あった「白」でポンして、あっという間に役牌1飜が確定しました！",
      term: {
        word: "ポンテン（ポンしてテンパイ）",
        reading: "ポンテン",
        tiles: ["5z", "5z", "5z"],
        desc: "ポンした瞬間にテンパイ（あと1枚）になること。終盤でスピード勝負するときに最強の技です！"
      }
    },
    {
      id: "s6-15",
      type: "text-choice",
      callSound: "kan",
      modeLabel: "カンの種類！",
      question: "誰からも鳴かず、自分の手牌の中だけで同じ牌が4枚全部揃いました！このとき自分の番にできる「カン」を何と呼ぶ？",
      subtext: "しかもこのカンだけは「門前（鳴いていない扱い）」のままリーチもできます！",
      boardTiles: ["6m", "6m", "6m", "6m"],
      caption: "自力で同じ牌を4枚引き入れた状態",
      options: [
        { text: "⭕ 暗槓（アンカン）！門前扱いのままドラも1つ増える！", correct: true },
        { text: "❌ 4枚持っていても自分の番にはカンできない", correct: false }
      ],
      explanation: "大正解！自力で4枚揃えてする「暗槓（アンカン）」だけは鳴いた扱いにならず、そのままリーチもかけられてドラ（と裏ドラ！）まで増える超気持ちいい大技です！",
      term: {
        word: "アンカン（暗槓）",
        reading: "アンカン",
        tiles: ["6m", "6m", "6m", "6m"],
        desc: "自分の手牌にある4枚で行うカン。両端の2枚を裏向きにして置き、門前（鳴きなし）を維持したままドラを増やせます！"
      }
    },
    {
      id: "s6-16",
      type: "text-choice",
      callSound: "ron",
      modeLabel: "ロンのルール！",
      question: "最後の1枚をもらう「ロン！」は、左隣・正面・右隣の誰が捨てた牌からできる？",
      subtext: "チーは左隣だけ、ポンは3人全員OKでしたが、「ロン」は…？",
      boardTiles: ["2s", "3s", "4s"],
      caption: "アガリ宣言の「ロン！」",
      options: [
        { text: "⭕ 左・正面・右の3人『誰から出た牌でも』ロンできる！", correct: true },
        { text: "❌ チーと同じで左隣の人からだけ", correct: false }
      ],
      explanation: "バッチリ！！「ロン」は相手3人の誰が捨てた当たり牌でもアガれます（フリテンでなければOK）。これで鳴きとアガリのルールは完璧です！",
      term: {
        word: "ホウジュウ（放銃 / 振り込み）",
        reading: "ホウジュウ",
        tiles: ["4s"],
        desc: "誰かのロン牌を捨ててしまうことを「振り込み（放銃）」と言います。逆に自分がロンしたときは捨てた人1人から点数をもらいます！"
      }
    }
  ]
};

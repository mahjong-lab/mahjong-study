/**
 * ワンタップ麻雀用語ミニ辞典＆用語ハイライトエンジン (js/shared/term-dict.js)
 * - 問題文・補足・解説内の麻雀用語に点線リンクを自動付与
 * - 選択肢内の単語も調べられる「📖 わからない単語をタップ」チップバーを生成
 * - モーダルDOM (#wordMeaningModal) が未配置なら自動注入
 */
const MAHJONG_DICT = [
  { key: 'manzu', word: '萬子（マンズ）', reading: 'マンズ', tiles: ['1m', '5m', '9m'], match: ['萬子', 'マンズ'], desc: '漢数字の「一〜九」に「萬」と書かれた数牌グループです。1〜9までの数字として階段や3枚組を作れます。' },
  { key: 'pinzu', word: '筒子（ピンズ）', reading: 'ピンズ', tiles: ['1p', '5p', '9p'], match: ['筒子', 'ピンズ'], desc: '丸い模様の数で「1〜9」を表す数牌グループです。丸の数をそのまま数えればOK！' },
  { key: 'souzu', word: '索子（ソーズ）', reading: 'ソーズ', tiles: ['1s', '5s', '9s'], match: ['索子', 'ソーズ'], desc: '緑の竹の本数で「1〜9」を表す数牌グループです。1索（イーソー）だけは鳥のイラストになっています！' },
  { key: 'isou', word: '一索（イーソー）', reading: 'イーソー', tiles: ['1s'], match: ['イーソー', '1索'], desc: '索子（竹のグループ）の「1」の牌です。これだけ竹ではなく鳥（クジャク）の絵が描かれています。端っこの1なのでタンヤオには使えません！' },
  { key: 'ipin', word: '一筒（イーピン）', reading: 'イーピン', tiles: ['1p'], match: ['イーピン', '1筒'], desc: '筒子（丸のグループ）の「1」の牌です。大きな丸が1つ描かれた端っこの牌です。' },
  { key: 'shupai', word: '数牌（シュウパイ）', reading: 'シュウパイ', tiles: ['2m', '5p', '8s'], match: ['数牌'], desc: '数字の1〜9がついた牌（萬子・筒子・索子）の総称です。字牌と違い「2・3・4」のような階段が作れます！' },
  { key: 'jihai', word: '字牌（ジハイ）', reading: 'ジハイ', tiles: ['1z', '5z', '7z'], match: ['字牌'], desc: '東南西北・白發中の7種類の漢字牌です。数字ではないので階段（順子）は作れず、同じ牌を2枚・3枚集めて使います。' },
  { key: 'kazehai', word: '風牌（フォンパイ）', reading: 'フォンパイ', tiles: ['1z', '2z', '3z', '4z'], match: ['風牌'], desc: '「東・南・西・北」の方角を表す4種類の字牌です。場の風や自分の席の風と一致するときだけ3枚で役になります。' },
  { key: 'sangenpai', word: '三元牌（白・發・中）', reading: 'サンゲンパイ', tiles: ['5z', '6z', '7z'], match: ['三元牌', '白・發・中', '白發中'], desc: '「白（真っ白な牌）・發・中」の3種類のこと。席に関係なく、誰でも3枚集める（ポンする）だけで1飜の役がつく最強の味方です！' },
  { key: 'yakuhai', word: '役牌（ヤクハイ）', reading: 'ヤクハイ', tiles: ['5z', '6z', '7z'], call: 'pon', match: ['役牌', 'ヤクハイ'], desc: '3枚集める（ポンでもOK！）だけで1飜の「役」が確定する特別な字牌（白・發・中・場風・自風）のことです。' },
  { key: 'yaochu', word: '端牌・么九牌', reading: 'ヤオチューハイ', tiles: ['1m', '9p', '1z'], match: ['么九牌', '端牌'], desc: '数字の「1」「9」と「字牌」をまとめた呼び方です。これが1枚でもあるとタンヤオにはなりません。' },
  { key: 'shuntsu', word: '順子（シュンツ / 階段）', reading: 'シュンツ', tiles: ['2p', '3p', '4p'], match: ['順子', 'シュンツ', '階段'], desc: '同じ種類で数字が連続する3枚組（例：2・3・4筒）のこと。アガリに必要な3枚ブロックの基本形です！' },
  { key: 'koutsu', word: '刻子（コーツ）', reading: 'コーツ', tiles: ['7z', '7z', '7z'], match: ['刻子', 'コーツ'], desc: 'まったく同じ牌を3枚揃えたブロック（例：中・中・中）のこと。自分で引いても、ポンして作ってもOKです！' },
  { key: 'anko', word: '暗刻（アンコ）', reading: 'アンコ', tiles: ['6m', '6m', '6m'], match: ['暗刻', 'アンコ'], desc: 'ポンを使わず、自分のツモだけで同じ牌を3枚揃えたブロックのことです。' },
  { key: 'kantsu', word: '槓子（カンツ）', reading: 'カンツ', tiles: ['8p', '8p', '8p', '8p'], call: 'kan', match: ['槓子', 'カンツ'], desc: '同じ牌4枚を「カン！」して1つの3枚ブロック扱いにした形です。新しいドラが1枚増えます！' },
  { key: 'ankan', word: '暗槓（アンカン）', reading: 'アンカン', tiles: ['6m', '6m', '6m', '6m'], call: 'kan', match: ['暗槓', 'アンカン'], desc: '自分の手牌だけで4枚揃えて行うカンです。鳴いた扱いにならず、門前（リーチ可能）を維持したままドラを増やせます！' },
  { key: 'mentsu', word: '4面子1雀頭（基本のアガリ形）', reading: 'ヨンメンツ・イチジャントウ', tiles: ['2m', '3m', '4m', '8s', '8s'], match: ['4面子1雀頭', '面子', 'メンツ'], desc: '麻雀の基本ゴールである「3枚ブロック（面子）×4つ ＋ 2枚ペア（雀頭/アタマ）×1つ ＝ 計14枚」の形のことです。' },
  { key: 'atama', word: 'アタマ（雀頭 / ジャントウ）', reading: 'アタマ / ジャントウ', tiles: ['8s', '8s'], match: ['雀頭', 'アタマ'], desc: 'アガリ形に必ず1組だけ必要な「同じ牌2枚のペア」のことです。3枚ブロック4つとアタマ1つで完成します！' },
  { key: 'toitsu', word: '対子（トイツ）', reading: 'トイツ', tiles: ['6m', '6m'], match: ['対子', 'トイツ'], desc: '同じ牌が2枚揃ったペアの形です。そのままアタマにもなるし、ポンして3枚組にもできる便利なパーツです。' },
  { key: 'taatsu', word: '塔子（ターツ）', reading: 'ターツ', tiles: ['3m', '4m'], match: ['塔子', 'ターツ'], desc: '「3・4」や「6・8」のように、あと1枚来れば3枚の階段（順子）になる2枚組パーツのことです。' },
  { key: 'tenpai', word: '聴牌（テンパイ）', reading: 'テンパイ', tiles: ['3s', '4s'], match: ['テンパイ', '聴牌'], desc: '「あと1枚、欲しい牌が来ればアガリ完成！」という王手の状態です。' },
  { key: 'ryanmen', word: '両面待ち（リャンメン待ち）', reading: 'リャンメンマチ', tiles: ['3s', '4s'], match: ['両面待ち', 'リャンメン待ち', '両面'], desc: '「3・4」のように並んだ2枚を持っていて、両側の「2」と「5」どちらが来てもアガれる一番強い待ちです！' },
  { key: 'kanchan', word: '嵌張待ち（カンチャン待ち）', reading: 'カンチャンマチ', tiles: ['6p', '8p'], match: ['嵌張待ち', 'カンチャン待ち', 'カンチャン'], desc: '「6・8」のように1つ飛んだ数字の真ん中（7）1種類を待つ形です。' },
  { key: 'penchan', word: '辺張待ち（ペンチャン / 片側待ち）', reading: 'ペンチャンマチ', tiles: ['8s', '9s'], match: ['辺張待ち', 'ペンチャン待ち', 'ペンチャン', '片側待ち'], desc: '端っこの「1・2」で3だけを待つ形や、「8・9」で7だけを待つ片側待ちのことです。' },
  { key: 'tanki', word: '単騎待ち（タンキ待ち）', reading: 'タンキマチ', tiles: ['2z'], match: ['単騎待ち', '単騎'], desc: '3枚組が4つ完成していて、最後のアタマ（2枚ペア）になる相方1枚だけを待っている状態です。' },
  { key: 'shabo', word: 'シャボ待ち（双碰待ち）', reading: 'シャボマチ', tiles: ['4m', '4m', '6z', '6z'], match: ['双碰待ち', 'シャボ待ち', 'シャンポン待ち'], desc: '2枚ペアが2組あり、どちらか片方が3枚目になって刻子になればアガれる待ちです。' },
  { key: 'nobetan', word: 'ノベタン（延べ単騎）', reading: 'ノベタン', tiles: ['2m', '3m', '4m', '5m'], match: ['ノベタン', '延べ単騎'], desc: '「2・3・4・5」と4枚連続しているとき、両端の「2」か「5」どちらが重なっても3枚組＋アタマになる待ちです。' },
  { key: 'agarihai', word: 'アガリ牌（当たり牌）', reading: 'アガリハイ', tiles: ['4s'], match: ['アガリ牌', '当たり牌'], desc: 'テンパイしている手牌を完成させる最後の1枚のこと。自分で引けば「ツモ」、相手から出れば「ロン」です！' },
  { key: 'naki', word: '鳴き（副露 / フーロ）', reading: 'ナキ / フーロ', tiles: ['7z', '7z', '7z'], call: 'pon', match: ['副露', '鳴き手', '鳴き', '鳴いて', '鳴く', '鳴いちゃ'], desc: '他人が捨てた牌を「ポン・チー・カン」でもらって3枚組を素早く作ること。便利ですが、リーチやピンフは使えなくなります！' },
  { key: 'menzen', word: '門前（メンゼン）', reading: 'メンゼン', tiles: ['2m', '3m', '4m'], match: ['門前', 'メンゼン'], desc: '1回もポン・チーせずに、自分の力だけで手牌を進めている状態のこと。門前なら「リーチ」でいつでも役がつきます！' },
  { key: 'pon', word: 'ポン（碰）', reading: 'ポン', tiles: ['6z', '6z', '6z'], call: 'pon', match: ['ポン'], desc: '手牌に同じ牌が2枚あるとき、誰かが捨てた3枚目をもらって「同じ牌3枚組」を作る技。左・正面・右の誰からでも鳴けます！' },
  { key: 'chi', word: 'チー（吃）', reading: 'チー', tiles: ['4p', '5p', '6p'], call: 'chi', match: ['チー'], desc: '自分のすぐ左隣の人（上家）が捨てた牌をもらって「数字の階段3枚組」を作る技。左隣の人からしかできないのがポイントです！' },
  { key: 'kan', word: 'カン（槓）', reading: 'カン', tiles: ['8p', '8p', '8p', '8p'], call: 'kan', match: ['カン'], desc: '同じ牌を4枚集めて1つのブロックにする大技。山から1枚補充し、全員のドラが1つ増えます！' },
  { key: 'tsumo', word: 'ツモ / 門前清自摸和', reading: 'ツモ / メンゼンツモ', tiles: ['4s'], call: 'tsumo', match: ['門前清自摸和', 'メンゼンツモ', 'ツモアガリ', 'ツモり', 'ツモっ', 'ツモ'], desc: '自分の番に山から引いた牌でアガること！さらに1回も鳴いていなければ（門前）、それだけで「門前清自摸和（1飜）」という役がつきます。' },
  { key: 'ron', word: 'ロン（栄和）', reading: 'ロン', tiles: ['5s'], call: 'ron', match: ['ロンアガリ', 'ロン牌', 'ロン'], desc: '他のプレイヤーが捨てた当たり牌をもらってアガること。捨てた人1人から点数をすべてもらいます！' },
  { key: 'kamicha', word: '上家（カミチャ）', reading: 'カミチャ', tiles: ['2m', '3m', '4m'], match: ['上家', 'カミチャ'], desc: '自分から見て「すぐ左隣」に座っている人のこと。「チー」ができるのはこの上家が捨てた牌だけです！' },
  { key: 'shimocha', word: '下家（シモチャ）', reading: 'シモチャ', tiles: ['1z', '2z'], match: ['下家', 'シモチャ'], desc: '自分から見て「すぐ右隣」に座っている人（自分の次に番が回る人）のことです。' },
  { key: 'toimen', word: '対面（トイメン）', reading: 'トイメン', tiles: ['1z', '3z'], match: ['対面', 'トイメン'], desc: '自分の正面（向かい側）に座っている人のことです。ポンやロンはできますが、チーはできません。' },
  { key: 'tacha', word: '他家（ターチャ）', reading: 'ターチャ', tiles: ['2z', '3z', '4z'], match: ['他家', 'ターチャ'], desc: '自分以外の3人のプレイヤー全員のことです。' },
  { key: 'bakaze', word: '東場・場風（バカゼ）', reading: 'トンバ / バカゼ', tiles: ['1z', '1z', '1z'], match: ['東1局', '東場', '場風'], desc: 'そのゲームの全員共通の風のこと。「東場（トンバ）」のときは、全員にとって『東』が3枚で1飜の役牌になります！' },
  { key: 'jikaze', word: '自風（ジカゼ）・東家/南家', reading: 'ジカゼ', tiles: ['2z', '2z', '2z'], match: ['自風', '南家', '東家', '西家', '北家'], desc: 'あなたの席に割り当てられた風のこと。あなたが「南家（ナンチャ）」なら、『南』を3枚集めると1飜の役牌になります！' },
  { key: 'otakaze', word: 'オタ風（客風牌）', reading: 'オタカゼ', tiles: ['3z', '4z'], match: ['オタ風', '客風牌'], desc: '場風でも自分の席の風でもない風牌のこと（例：東場・南家のときの西と北）。ポンして3枚集めても役にならないので注意！' },
  { key: 'oya', word: '親（オヤ）と 子（コ）', reading: 'オヤ / コ', tiles: ['1z'], match: ['【親】', '【子】', '親の', '子の'], desc: '4人のうち「東家」の1人が『親』、残り3人が『子』です。親がアガると点数が子の1.5倍（満貫なら12,000点！）になります。' },
  { key: 'kawa', word: '河（ホー / 捨て牌置き場）', reading: 'ホー', tiles: ['9m', '1z', '2s'], match: ['捨て牌', '河'], desc: '各プレイヤーが捨てた牌を順番に並べる場所のことです。自分がここに捨てた牌では相手からロンできません（フリテン）。' },
  { key: 'furiten', word: 'フリテン（振聴）', reading: 'フリテン', tiles: ['2s'], match: ['見逃しフリテン', 'フリテン', '振聴'], desc: '自分の待ち牌のうち1種類でも自分の捨て牌（河）にある状態。相手から「ロン」できませんが、自分で引く「ツモ」ならアガれます！' },
  { key: 'yaku', word: '役（ヤク）・役なし', reading: 'ヤク', tiles: ['5z', '6z', '7z'], match: ['役なし', '基本役', '役'], desc: '麻雀でアガるために最低1つ必要な「特定のそろえ方（リーチ・タンヤオ・役牌など）」のこと。形が14枚揃っても役が0個だとアガれません！' },
  { key: 'riichi', word: '立直（リーチ）', reading: 'リーチ', tiles: ['6m', '8m'], call: 'ron', match: ['リーチ', '立直'], desc: '1回も鳴かずにテンパイしたとき、1000点棒を出して宣言する基本役（1飜）。他の役がなくてもこれだけでアガれ、裏ドラのチャンスも増えます！' },
  { key: 'tanyao', word: '断么九（タンヤオ）・喰いタン', reading: 'タンヤオ', tiles: ['2m', '3m', '4m', '0p'], call: 'chi', match: ['断么九', 'タンヤオ', '喰いタン', '鳴きタン'], desc: '1・9・字牌を1枚も使わず、「2〜8の数牌だけ」で揃える1飜役！ポン・チーして作ってもOK（喰いタン）な超便利役です。' },
  { key: 'pinfu', word: '平和（ピンフ）', reading: 'ピンフ', tiles: ['2m', '3m', '4m', '2s', '3s'], match: ['平和', 'ピンフ'], desc: '門前（鳴かない）で、4ブロックすべてを階段（順子）にし、役牌以外のアタマ＋最後は両面待ちにする1飜役です。鳴くと消えます！' },
  { key: 'iipeiko', word: '一盃口（イーペーコー）', reading: 'イーペーコー', tiles: ['2m', '3m', '4m', '2m', '3m', '4m'], match: ['一盃口', 'イーペーコー'], desc: '門前（鳴かない）で、同じ色・同じ数字の階段を2組（例：234萬＋234萬）揃える1飜役です。鳴くと消えます！' },
  { key: 'chiitoitsu', word: '七対子（チートイツ）', reading: 'チートイツ', tiles: ['2m', '2m', '5p', '5p', '6z', '6z'], match: ['七対子', 'チートイツ'], desc: '同じ牌2枚のペア（対子）を7種類集める特殊な2飜役です！ポンは使えず、必ず門前で作ります。' },
  { key: 'toitoi', word: '対々和（トイトイ）', reading: 'トイトイ', tiles: ['2m', '2m', '2m', '7z', '7z', '7z'], call: 'pon', match: ['対々和', 'トイトイ'], desc: '階段を1つも使わず、「同じ牌3枚組（刻子）」ばかり4組揃える2飜役です。ポンしまくって作れます！' },
  { key: 'sanshoku', word: '三色同順（サンショク）', reading: 'サンショクドウジュン', tiles: ['1m', '2m', '3m', '1p', '2p', '3p'], match: ['三色同順', 'サンショク'], desc: '萬子・筒子・索子の3種類すべてで同じ数字の階段（例：123萬・123筒・123索）を揃える役です（門前2飜・鳴き1飜）。' },
  { key: 'ittsu', word: '一気通貫（イッツー）', reading: 'イッキツウカン', tiles: ['1m', '2m', '3m', '4m', '5m', '6m'], match: ['一気通貫', 'イッツー'], desc: '同じ種類の数牌で「123・456・789」と1〜9まで一気に揃える爽快な役です（門前2飜・鳴き1飜）。' },
  { key: 'honitsu', word: '混一色（ホンイツ）', reading: 'ホンイツ', tiles: ['1m', '2m', '3m', '7z', '7z'], match: ['混一色', 'ホンイツ'], desc: '数牌を1種類だけ（例：萬子だけ）に絞り、そこに字牌を混ぜて揃える高得点役です（門前3飜・鳴いても2飜！）。' },
  { key: 'dora_ind', word: 'ドラ表示牌とドラ', reading: 'ドラヒョウジハイ', tiles: ['4m', '5m'], match: ['ドラ表示牌', 'ドラ表示'], desc: '場の中央にめくれている牌（ドラ表示牌）の「次の数字・順番の牌」が実際のボーナス牌（ドラ）になります！（例：表示が四萬ならドラは五萬、表示が東ならドラは南）' },
  { key: 'akadora', word: '赤ドラ（赤五萬・赤五筒・赤五索）', reading: 'アカドラ', tiles: ['0m', '0p', '0s'], match: ['赤ドラ', '赤5筒', '赤5萬', '赤5索', '赤五索'], desc: '5の数牌に1枚ずつ入っている真っ赤なボーナス牌。持っているだけでアガった時に1飜プラスされます！（※ドラだけでは役になりません）' },
  { key: 'dora', word: 'ドラ（懸賞牌）', reading: 'ドラ', tiles: ['5m', '0p'], match: ['裏ドラ', 'ドラ'], desc: 'アガったときに1枚につき1飜（点数が約2倍！）増えるボーナス牌。ただしドラ自体は「役」ではないので、必ずリーチや役牌などと一緒に使います。' },
  { key: 'han', word: '飜（ハン）', reading: 'ハン', tiles: ['5z', '5z', '5z'], match: ['何飜', '1飜', '2飜', '3飜', '4飜', '5飜', '1 飜', '2 飜', '3 飜', '4 飜', '5 飜', '飜'], desc: '役やドラの「グレード（レベル）」を表す単位です！1飜増えるごとに、もらえる点数がおよそ倍々（1000→2000→3900→8000）に増えていきます。' },
  { key: 'fu', word: '符（フ / 30符・40符）', reading: 'フ', tiles: ['2m', '3m', '4m'], match: ['符計算', '30符', '40符'], desc: '手牌の基礎点のことですが計算は不要！「鳴いたら30符グループ（1000点の倍々）」「門前ロンなら40符グループ（1300点の倍々）」とだけ覚えれば完璧です。' },
  { key: 'mangan', word: '満貫（マンガン）', reading: 'マンガン', tiles: ['0m', '5m', '5m'], match: ['満貫', 'マンガン'], desc: '5飜（または4飜40符以上）で到達する高得点の区切り！計算いらずで無条件に「子なら8,000点（親なら12,000点）」になります。' },
  { key: 'all_call', word: '〇〇オール（親のツモ申告）', reading: 'オール', tiles: ['1z'], call: 'tsumo', match: ['4000オール', '2000オール', 'オール'], desc: '親がツモアガリしたとき、子3人全員から同じ点数ずつもらうコールです。「4000オール！」なら4,000点×3人＝合計12,000点！' },
  { key: 'suru', word: 'スルー（見逃し・鳴かない）', reading: 'スルー', tiles: ['2m', '3m', '4m'], match: ['スルー'], desc: '相手が捨てた牌に対してポンやチーをせず、そのまま見送って自分のツモ番を待つことです。' }
];

const TermHelper = {
  byKey: {},
  patterns: [],
  regex: null,

  init() {
    if (this.regex) return;
    const pairs = [];
    MAHJONG_DICT.forEach(entry => {
      this.byKey[entry.key] = entry;
      entry.match.forEach(m => {
        pairs.push({ surface: m, key: entry.key, label: entry.word.split('（')[0] });
      });
    });
    pairs.sort((a, b) => b.surface.length - a.surface.length);
    this.patterns = pairs;
    const escaped = pairs.map(p => p.surface.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    this.regex = new RegExp('(' + escaped.join('|') + ')', 'g');
  },

  ensureModal() {
    if (typeof document === 'undefined') return null;
    let modal = document.getElementById('wordMeaningModal');
    if (modal) return modal;
    if (!document.body || typeof document.createElement !== 'function') return null;

    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="wordMeaningModal" onclick="if(event.target===this)TermHelper.close()" class="fixed inset-0 bg-black/60 z-[70] hidden backdrop-blur-sm flex justify-center items-center p-4">
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-400 animate-pop-in">
          <div class="bg-gradient-to-r from-teal-800 to-emerald-800 text-white px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs font-bold text-amber-200">
              <span>🔍</span>
              <span>ことばの意味（ワンタップ辞典）</span>
            </div>
            <button type="button" onclick="TermHelper.close()" class="text-white/80 hover:text-white text-xs font-bold bg-white/15 px-2.5 py-1 rounded-lg">
              とじる ✕
            </button>
          </div>
          <div class="p-4 space-y-3">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div class="flex items-baseline gap-2 flex-wrap">
                <h4 id="wmWord" class="text-lg font-black text-slate-900 font-serif">用語</h4>
                <span id="wmReading" class="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">ヨミ</span>
              </div>
              <button type="button" id="wmSoundBtn" class="hidden text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full transition active:scale-95">
                🔊 発声を聞く
              </button>
            </div>
            <div id="wmTiles" class="mj-modal-tiles flex items-center gap-1 py-1 empty:hidden"></div>
            <p id="wmDesc" class="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/70 border border-amber-200/80 rounded-xl p-3"></p>
            <button type="button" onclick="TermHelper.close()" class="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm transition active:scale-95">
              わかった！
            </button>
          </div>
        </div>
      </div>
    `;
    modal = wrap.firstElementChild;
    document.body.appendChild(modal);
    return modal;
  },

  escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  linkify(text, theme = 'dark') {
    this.init();
    if (!text) return '';
    const cls = theme === 'dark' ? 'mj-term-dark' : 'mj-term-light';
    const usedKeys = new Set();
    const parts = String(text).split(this.regex);
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        const found = this.patterns.find(p => p.surface === part);
        if (found && !usedKeys.has(found.key)) {
          usedKeys.add(found.key);
          return `<span class="${cls}" role="button" tabindex="0" onclick="TermHelper.open('${found.key}', event)" title="タップして意味を表示">${this.escapeHtml(part)}</span>`;
        }
      }
      return this.escapeHtml(part);
    }).join('');
  },

  extractKeysFromQuestion(texts) {
    this.init();
    const combined = (texts || []).filter(Boolean).join(' ');
    const keys = [];
    const seen = new Set();
    let m;
    this.regex.lastIndex = 0;
    while ((m = this.regex.exec(combined)) !== null) {
      const found = this.patterns.find(p => p.surface === m[1]);
      if (found && !seen.has(found.key)) {
        seen.add(found.key);
        keys.push(found.key);
      }
    }
    return keys;
  },

  findBestTermForQuestion(q) {
    if (!q) return null;
    if (q.term && q.term.word) return q.term;
    const correctOpt = (q.options || []).find(o => o.correct);
    const priorityTexts = [
      correctOpt && correctOpt.text,
      q.explanation,
      q.subtext,
      q.question
    ];
    const keys = this.extractKeysFromQuestion(priorityTexts);
    if (keys.length === 0) return null;
    const e = this.byKey[keys[0]];
    return {
      word: e.word.split('（')[0],
      reading: e.reading,
      tiles: e.tiles || [],
      desc: e.desc
    };
  },

  renderChipsBar(containerId, texts) {
    const el = typeof document !== 'undefined' ? document.getElementById(containerId) : null;
    if (!el) return;
    const keys = this.extractKeysFromQuestion(texts).slice(0, 7);
    if (keys.length === 0) {
      el.classList.add('hidden');
      el.innerHTML = '';
      return;
    }
    el.classList.remove('hidden');
    const chipsHtml = keys.map(k => {
      const e = this.byKey[k];
      const shortName = e.word.split('（')[0];
      return `<button type="button" onclick="TermHelper.open('${k}', event)" class="inline-flex items-center gap-1 bg-white hover:bg-amber-50 active:scale-95 text-teal-900 border border-teal-200/90 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm transition"><span>❓</span><span>${this.escapeHtml(shortName)}</span></button>`;
    }).join('');
    el.innerHTML = `
      <div class="flex items-center flex-wrap gap-1.5 bg-amber-50/90 border border-amber-200/90 rounded-xl px-3 py-2">
        <span class="text-[11px] font-bold text-amber-900 mr-0.5">📖 わからない単語をタップ：</span>
        ${chipsHtml}
      </div>
    `;
  },

  open(key, ev) {
    if (ev) {
      ev.stopPropagation();
      ev.preventDefault();
    }
    this.init();
    const entry = this.byKey[key];
    if (!entry) return;
    if (typeof MahjongSound !== 'undefined') MahjongSound.clack();

    const modal = this.ensureModal();
    if (!modal) return;
    document.getElementById('wmWord').textContent = entry.word;
    document.getElementById('wmReading').textContent = entry.reading;
    document.getElementById('wmDesc').textContent = entry.desc;

    const tilesEl = document.getElementById('wmTiles');
    tilesEl.innerHTML = (entry.tiles || []).map(t => TileRenderer.render(t)).join('');

    const sBtn = document.getElementById('wmSoundBtn');
    if (entry.call && typeof MahjongSound !== 'undefined') {
      sBtn.classList.remove('hidden');
      const lbl = MahjongSound.getCallLabel(entry.call);
      sBtn.textContent = `🔊 「${lbl}」を聞く`;
      sBtn.onclick = () => MahjongSound.playCall(entry.call);
    } else {
      sBtn.classList.add('hidden');
    }

    modal.classList.remove('hidden');
  },

  close() {
    const modal = typeof document !== 'undefined' ? document.getElementById('wordMeaningModal') : null;
    if (modal) modal.classList.add('hidden');
  }
};

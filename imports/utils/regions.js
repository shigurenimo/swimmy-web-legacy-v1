const regions = {
  okinawa: {name: {jp: '沖縄'}, value: 'okinawa', katakana: 'オキナワ'},
  kagoshima: {name: {jp: '鹿児島'}, value: 'kagoshima', katakana: 'カゴシマ'},
  miyazaki: {name: {jp: '宮崎'}, value: 'miyazaki', katakana: 'ミヤザキ'},
  oita: {name: {jp: '大分'}, value: 'oita', katakana: 'オーイタ'},
  kumamoto: {name: {jp: '熊本'}, value: 'kumamoto', katakana: 'クマモト'},
  nagasaki: {name: {jp: '長崎'}, value: 'nagasaki', katakana: 'ナガサキ'},
  saga: {name: {jp: '佐賀'}, value: 'saga', katakana: 'サガ'},
  fukuoka: {name: {jp: '福岡'}, value: 'fukuoka', katakana: 'フクオカ'},
  kochi: {name: {jp: '高知'}, value: 'kochi', katakana: 'コーチ'},
  tokushima: {name: {jp: '徳島'}, value: 'tokushima', katakana: 'トクシマ'},
  ehime: {name: {jp: '愛媛'}, value: 'ehime', katakana: 'エヒメ'},
  kagawa: {name: {jp: '香川'}, value: 'kagawa', katakana: 'カガワ'},
  yamaguchi: {name: {jp: '山口'}, value: 'yamaguchi', katakana: 'ヤマグチ'},
  hiroshima: {name: {jp: '広島'}, value: 'hiroshima', katakana: 'ヒロシマ'},
  okayama: {name: {jp: '岡山'}, value: 'okayama', katakana: 'オカヤマ'},
  shimane: {name: {jp: '島根'}, value: 'shimane', katakana: 'シマネ'},
  tottori: {name: {jp: '鳥取'}, value: 'tottori', katakana: 'トットリ'},
  wakayama: {name: {jp: '和歌山'}, value: 'wakayama', katakana: 'ワカヤマ'},
  nara: {name: {jp: '奈良'}, value: 'nara', katakana: 'ナラ'},
  hyogo: {name: {jp: '兵庫'}, value: 'hyogo', katakana: 'ヒョーゴ'},
  osaka: {name: {jp: '大阪'}, value: 'osaka', katakana: 'オオサカ'},
  kyoto: {name: {jp: '京都'}, value: 'kyoto', katakana: 'キョート'},
  shiga: {name: {jp: '滋賀'}, value: 'shiga', katakana: 'シガ'},
  mie: {name: {jp: '三重'}, value: 'mie', katakana: 'ミエ'},
  gifu: {name: {jp: '岐阜'}, value: 'gifu', katakana: 'ギフ'},
  aichi: {name: {jp: '愛知'}, value: 'aichi', katakana: 'アイチ'},
  shizuoka: {name: {jp: '静岡'}, value: 'shizuoka', katakana: 'シズオカ'},
  fukui: {name: {jp: '福井'}, value: 'fukui', katakana: 'フクイ'},
  ishikawa: {name: {jp: '石川'}, value: 'ishikawa', katakana: 'イシカワ'},
  toyama: {name: {jp: '富山'}, value: 'toyama', katakana: 'トヤマ'},
  niigata: {name: {jp: '新潟'}, value: 'niigata', katakana: 'ニイガタ'},
  nagano: {name: {jp: '長野'}, value: 'nagano', katakana: 'ナガノ'},
  yamanashi: {name: {jp: '山梨'}, value: 'yamanashi', katakana: 'ヤマナシ'},
  kanagawa: {name: {jp: '神奈川'}, value: 'kanagawa', katakana: 'カナガワ'},
  tokyo: {name: {jp: '東京'}, value: 'tokyo', katakana: 'トーキョー'},
  chiba: {name: {jp: '千葉'}, value: 'chiba', katakana: 'チバ'},
  saitama: {name: {jp: '埼玉'}, value: 'saitama', katakana: 'サイタマ'},
  gunma: {name: {jp: '群馬'}, value: 'gunma', katakana: 'グンマ'},
  tochigi: {name: {jp: '栃木'}, value: 'tochigi', katakana: 'トチギ'},
  ibaraki: {name: {jp: '茨城'}, value: 'ibaraki', katakana: 'イバラキ'},
  fukushima: {name: {jp: '福島'}, value: 'fukushima', katakana: 'フクシマ'},
  yamagata: {name: {jp: '山形'}, value: 'yamagata', katakana: 'ヤマガタ'},
  miyagi: {name: {jp: '宮城'}, value: 'miyagi', katakana: 'ミヤギ'},
  akita: {name: {jp: '秋田'}, value: 'akita', katakana: 'アキタ'},
  iwate: {name: {jp: '岩手'}, value: 'iwate', katakana: 'イワテ'},
  aomori: {name: {jp: '青森'}, value: 'aomori', katakana: 'アオモリ'},
  hokkaido: {name: {jp: '北海道'}, value: 'hokkaido', katakana: 'ホッカイドー'},
  list: [
    {name: {jp: '沖縄'}, value: 'okinawa', katakana: 'オキナワ'},
    {name: {jp: '鹿児島'}, value: 'kagoshima', katakana: 'カゴシマ'},
    {name: {jp: '宮崎'}, value: 'miyazaki', katakana: 'ミヤザキ'},
    {name: {jp: '大分'}, value: 'oita', katakana: 'オーイタ'},
    {name: {jp: '熊本'}, value: 'kumamoto', katakana: 'クマモト'},
    {name: {jp: '長崎'}, value: 'nagasaki', katakana: 'ナガサキ'},
    {name: {jp: '佐賀'}, value: 'saga', katakana: 'サガ'},
    {name: {jp: '福岡'}, value: 'fukuoka', katakana: 'フクオカ'},
    {name: {jp: '高知'}, value: 'kochi', katakana: 'コーチ'},
    {name: {jp: '徳島'}, value: 'tokushima', katakana: 'トクシマ'},
    {name: {jp: '愛媛'}, value: 'ehime', katakana: 'エヒメ'},
    {name: {jp: '香川'}, value: 'kagawa', katakana: 'カガワ'},
    {name: {jp: '山口'}, value: 'yamaguchi', katakana: 'ヤマグチ'},
    {name: {jp: '広島'}, value: 'hiroshima', katakana: 'ヒロシマ'},
    {name: {jp: '岡山'}, value: 'okayama', katakana: 'オカヤマ'},
    {name: {jp: '島根'}, value: 'shimane', katakana: 'シマネ'},
    {name: {jp: '鳥取'}, value: 'tottori', katakana: 'トットリ'},
    {name: {jp: '和歌山'}, value: 'wakayama', katakana: 'ワカヤマ'},
    {name: {jp: '奈良'}, value: 'nara', katakana: 'ナラ'},
    {name: {jp: '兵庫'}, value: 'hyogo', katakana: 'ヒョーゴ'},
    {name: {jp: '大阪'}, value: 'osaka', katakana: 'オオサカ'},
    {name: {jp: '京都'}, value: 'kyoto', katakana: 'キョート'},
    {name: {jp: '滋賀'}, value: 'shiga', katakana: 'シガ'},
    {name: {jp: '三重'}, value: 'mie', katakana: 'ミエ'},
    {name: {jp: '岐阜'}, value: 'gifu', katakana: 'ギフ'},
    {name: {jp: '愛知'}, value: 'aichi', katakana: 'アイチ'},
    {name: {jp: '静岡'}, value: 'shizuoka', katakana: 'シズオカ'},
    {name: {jp: '福井'}, value: 'fukui', katakana: 'フクイ'},
    {name: {jp: '石川'}, value: 'ishikawa', katakana: 'イシカワ'},
    {name: {jp: '富山'}, value: 'toyama', katakana: 'トヤマ'},
    {name: {jp: '新潟'}, value: 'niigata', katakana: 'ニイガタ'},
    {name: {jp: '長野'}, value: 'nagano', katakana: 'ナガノ'},
    {name: {jp: '山梨'}, value: 'yamanashi', katakana: 'ヤマナシ'},
    {name: {jp: '神奈川'}, value: 'kanagawa', katakana: 'カナガワ'},
    {name: {jp: '東京'}, value: 'tokyo', katakana: 'トーキョー'},
    {name: {jp: '千葉'}, value: 'chiba', katakana: 'チバ'},
    {name: {jp: '埼玉'}, value: 'saitama', katakana: 'サイタマ'},
    {name: {jp: '群馬'}, value: 'gunma', katakana: 'グンマ'},
    {name: {jp: '栃木'}, value: 'tochigi', katakana: 'トチギ'},
    {name: {jp: '茨城'}, value: 'ibaraki', katakana: 'イバラキ'},
    {name: {jp: '福島'}, value: 'fukushima', katakana: 'フクシマ'},
    {name: {jp: '山形'}, value: 'yamagata', katakana: 'ヤマガタ'},
    {name: {jp: '宮城'}, value: 'miyagi', katakana: 'ミヤギ'},
    {name: {jp: '秋田'}, value: 'akita', katakana: 'アキタ'},
    {name: {jp: '岩手'}, value: 'iwate', katakana: 'イワテ'},
    {name: {jp: '青森'}, value: 'aomori', katakana: 'アオモリ'},
    {name: {jp: '北海道'}, value: 'hokkaido', katakana: 'ホッカイドー'}
  ],
  block: [
    [
      {name: {jp: '沖縄'}, value: 'okinawa', katakana: 'オキナワ'}
    ], [
      {name: {jp: '鹿児島'}, value: 'kagoshima', katakana: 'カゴシマ'},
      {name: {jp: '宮崎'}, value: 'miyazaki', katakana: 'ミヤザキ'},
      {name: {jp: '大分'}, value: 'oita', katakana: 'オーイタ'},
      {name: {jp: '熊本'}, value: 'kumamoto', katakana: 'クマモト'},
      {name: {jp: '長崎'}, value: 'nagasaki', katakana: 'ナガサキ'},
      {name: {jp: '佐賀'}, value: 'saga', katakana: 'サガ'},
      {name: {jp: '福岡'}, value: 'fukuoka', katakana: 'フクオカ'}
    ], [
      {name: {jp: '高知'}, value: 'kochi', katakana: 'コーチ'},
      {name: {jp: '徳島'}, value: 'tokushima', katakana: 'トクシマ'},
      {name: {jp: '愛媛'}, value: 'ehime', katakana: 'エヒメ'},
      {name: {jp: '香川'}, value: 'kagawa', katakana: 'カガワ'}
    ], [
      {name: {jp: '山口'}, value: 'yamaguchi', katakana: 'ヤマグチ'},
      {name: {jp: '広島'}, value: 'hiroshima', katakana: 'ヒロシマ'},
      {name: {jp: '岡山'}, value: 'okayama', katakana: 'オカヤマ'},
      {name: {jp: '島根'}, value: 'shimane', katakana: 'シマネ'},
      {name: {jp: '鳥取'}, value: 'tottori', katakana: 'トットリ'}
    ], [
      {name: {jp: '和歌山'}, value: 'wakayama', katakana: 'ワカヤマ'},
      {name: {jp: '奈良'}, value: 'nara', katakana: 'ナラ'},
      {name: {jp: '兵庫'}, value: 'hyogo', katakana: 'ヒョーゴ'},
      {name: {jp: '大阪'}, value: 'osaka', katakana: 'オオサカ'},
      {name: {jp: '京都'}, value: 'kyoto', katakana: 'キョート'},
      {name: {jp: '滋賀'}, value: 'shiga', katakana: 'シガ'},
      {name: {jp: '三重'}, value: 'mie', katakana: 'ミエ'}
    ], [
      {name: {jp: '岐阜'}, value: 'gifu', katakana: 'ギフ'},
      {name: {jp: '愛知'}, value: 'aichi', katakana: 'アイチ'},
      {name: {jp: '静岡'}, value: 'shizuoka', katakana: 'シズオカ'},
      {name: {jp: '福井'}, value: 'fukui', katakana: 'フクイ'},
      {name: {jp: '石川'}, value: 'ishikawa', katakana: 'イシカワ'},
      {name: {jp: '富山'}, value: 'toyama', katakana: 'トヤマ'},
      {name: {jp: '新潟'}, value: 'niigata', katakana: 'ニイガタ'},
      {name: {jp: '長野'}, value: 'nagano', katakana: 'ナガノ'},
      {name: {jp: '山梨'}, value: 'yamanashi', katakana: 'ヤマナシ'}
    ], [
      {name: {jp: '神奈川'}, value: 'kanagawa', katakana: 'カナガワ'},
      {name: {jp: '東京'}, value: 'tokyo', katakana: 'トーキョー'},
      {name: {jp: '千葉'}, value: 'chiba', katakana: 'チバ'},
      {name: {jp: '埼玉'}, value: 'saitama', katakana: 'サイタマ'},
      {name: {jp: '群馬'}, value: 'gunma', katakana: 'グンマ'},
      {name: {jp: '栃木'}, value: 'tochigi', katakana: 'トチギ'},
      {name: {jp: '茨城'}, value: 'ibaraki', katakana: 'イバラキ'}
    ], [
      {name: {jp: '福島'}, value: 'fukushima', katakana: 'フクシマ'},
      {name: {jp: '山形'}, value: 'yamagata', katakana: 'ヤマガタ'},
      {name: {jp: '宮城'}, value: 'miyagi', katakana: 'ミヤギ'},
      {name: {jp: '秋田'}, value: 'akita', katakana: 'アキタ'},
      {name: {jp: '岩手'}, value: 'iwate', katakana: 'イワテ'},
      {name: {jp: '青森'}, value: 'aomori', katakana: 'アオモリ'}
    ], [
      {name: {jp: '北海道'}, value: 'hokkaido', katakana: 'ホッカイドー'}
    ]
  ],
  en: [
    [
      {name: {jp: 'メイン', en: 'Maine'}, value: 'maine', katakana: 'メイン'},
      {name: {jp: 'ニューハンプシャー', en: 'New Hampshire'}, value: 'newHampshire', katakana: 'ニューハンプシャー'},
      {name: {jp: 'バーモント', en: 'Vermont'}, value: 'vermont', katakana: 'バーモント'},
      {name: {jp: 'マサチューセッツ', en: 'Massachusetts'}, value: 'massachusetts', katakana: 'マサチューセッツ'},
      {name: {jp: 'ロードアイランド', en: 'Rhode Island'}, value: 'rhodeIsland', katakana: 'ロードアイランド'},
      {name: {jp: 'コネチカット', en: 'Connecticut'}, value: 'connecticut', katakana: 'コネチカット'}
    ], [
      {name: {jp: 'ニューヨーク', en: 'New York'}, value: 'newYork', katakana: 'ニューヨーク'},
      {name: {jp: 'ニュージャージー', en: 'New Jersey'}, value: 'newJersey', katakana: 'ニュージャージー'},
      {name: {jp: 'ペンシルベニア', en: 'Pennsylvania'}, value: 'pennsylvania', katakana: 'ペンシルベニア'}
    ], [
      {name: {jp: 'ミシガン', en: 'Michigan'}, value: 'michigan', katakana: 'ミシガン'},
      {name: {jp: 'ウィスコンシン', en: 'Wisconsin'}, value: 'wisconsin', katakana: 'ウィスコンシン'},
      {name: {jp: 'オハイオ', en: 'Ohio'}, value: 'ohio', katakana: 'オハイオ'},
      {name: {jp: 'インディアナ', en: 'Indiana'}, value: 'indiana', katakana: 'インディアナ'},
      {name: {jp: 'イリノイ', en: 'Illinois'}, value: 'illinois', katakana: 'イリノイ'}
    ], [
      {name: {jp: 'ミネソタ', en: 'Minnesota'}, value: 'minnesota', katakana: 'ミネソタ'},
      {name: {jp: 'ノースダコタ', en: 'North Dakota'}, value: 'northDakota', katakana: 'ノースダコタ'},
      {name: {jp: 'サウスダコタ', en: 'South Dakota'}, value: 'southDakota', katakana: 'サウスダコタ'},
      {name: {jp: 'アイオワ', en: 'Iowa'}, value: 'iowa', katakana: 'アイオワ'},
      {name: {jp: 'ネブラスカ', en: 'Nebraska'}, value: 'nebraska', katakana: 'ネブラスカ'},
      {name: {jp: 'ミズーリ', en: 'Missouri'}, value: 'missouri', katakana: 'ミズーリ'},
      {name: {jp: 'カンザス', en: 'Kansas'}, value: 'kansas', katakana: 'カンザス'}
    ], [
      {name: {jp: 'デラウェア', en: 'Delaware'}, value: 'delaware', katakana: 'デラウェア'},
      {name: {jp: 'メリーランド', en: 'Maryland'}, value: 'maryland', katakana: 'メリーランド'},
      {name: {jp: 'ワシントンD.C.', en: 'Washington,D.C.'}, value: 'washingtonDC', katakana: 'ワシントンD.C.'},
      {name: {jp: 'ウエストバージニア', en: 'West Virginia'}, value: 'westVirginia', katakana: 'ウエストバージニア'},
      {name: {jp: 'バージニア', en: 'Virginia'}, value: 'virginia', katakana: 'バージニア'},
      {name: {jp: 'ノースカロライナ', en: 'North Carolina'}, value: 'northCarolina', katakana: 'ノースカロライナ'},
      {name: {jp: 'サウスカロライナ', en: 'South Carolina'}, value: 'south Carolina', katakana: 'サウスカロライナ'},
      {name: {jp: 'ジョージア', en: 'Georgia'}, value: 'georgia', katakana: 'ジョージア'}
    ], [
      {name: {jp: 'フロリダ', en: 'Florida'}, value: 'florida', katakana: 'フロリダ'},
      {name: {jp: 'ケンタッキー', en: 'Kentucky'}, value: 'kentucky', katakana: 'ケンタッキー'},
      {name: {jp: 'テネシー', en: 'Tennessee'}, value: 'tennessee', katakana: 'テネシー'},
      {name: {jp: 'アラバマ', en: 'Alabama'}, value: 'alabama', katakana: 'アラバマ'},
      {name: {jp: 'ミシシッピ', en: 'Mississippi'}, value: 'mississippi', katakana: 'ミシシッピ'}
    ], [
      {name: {jp: 'アーカンソー', en: 'Arkansas'}, value: 'arkansas', katakana: 'アーカンソー'},
      {name: {jp: 'オクラホマ', en: 'Oklahoma'}, value: 'oklahoma', katakana: 'オクラホマ'},
      {name: {jp: 'ルイジアナ', en: 'Louisiana'}, value: 'louisiana', katakana: 'ルイジアナ'},
      {name: {jp: 'テキサス', en: 'Texas'}, value: 'texas', katakana: 'テキサス'}
    ], [
      {name: {jp: 'モンタナ', en: 'Montana'}, value: 'montana', katakana: 'モンタナ'},
      {name: {jp: 'ワイオミング', en: 'Wyoming'}, value: 'wyoming', katakana: 'ワイオミング'},
      {name: {jp: 'アイダホ', en: 'Idaho'}, value: 'idaho', katakana: 'アイダホ'},
      {name: {jp: 'コロラド', en: 'Colorado'}, value: 'colorado', katakana: 'コロラド'},
      {name: {jp: 'ユタ', en: 'Utah'}, value: 'utah', katakana: 'ユタ'},
      {name: {jp: 'ネバダ', en: 'Nevada'}, value: 'nevada', katakana: 'ネバダ'},
      {name: {jp: 'ニューメキシコ', en: 'New Mexico'}, value: 'newMexico', katakana: 'ニューメキシコ'},
      {name: {jp: 'アリゾナ', en: 'Arizona'}, value: 'arizona', katakana: 'アリゾナ'}
    ], [
      {name: {jp: 'オレゴン', en: 'Oregon'}, value: 'oregon', katakana: 'オレゴン'},
      {name: {jp: 'カリフォルニア', en: 'California'}, value: 'california', katakana: 'カリフォルニア'},
      {name: {jp: 'アラスカ', en: 'Alaska '}, value: 'alaska', katakana: 'アラスカ'},
      {name: {jp: 'ハワイ', en: 'Hawaii'}, value: 'hawaii', katakana: 'ハワイ'}
    ]
  ]
}

export { regions }

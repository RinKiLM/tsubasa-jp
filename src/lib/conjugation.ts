export type WordCategory = 'godan' | 'ichidan' | 'irregular' | 'i-adj' | 'na-adj';

export type ConjugationFormId =
  | 'masu'
  | 'masen'
  | 'nai'
  | 'te'
  | 'ta'
  | 'potential'
  | 'volitional';

export interface DojoWord {
  id: string;
  kanji: string;
  reading: string;
  meaning: string;
  category: WordCategory;
  categoryLabel: string;
  tricky?: boolean; // e.g., 帰る / 走る / いい / きれい
  hint?: string;
}

export interface ConjugationFormMeta {
  id: ConjugationFormId;
  label: string;
  shortLabel: string;
  description: string;
  appliesTo: WordCategory[];
}

export interface ConjugationResult {
  kanjiForm: string;
  readingForm: string;
  ruleSteps: string;
  distractors: string[];
}

export const CONJUGATION_FORMS: ConjugationFormMeta[] = [
  {
    id: 'masu',
    label: '礼貌体（ます / です）',
    shortLabel: 'ます形',
    description: '日常对话、旅游点餐、礼貌沟通最核心的形态',
    appliesTo: ['godan', 'ichidan', 'irregular', 'i-adj', 'na-adj']
  },
  {
    id: 'nai',
    label: '普通体否定（ない）',
    shortLabel: 'ない形',
    description: '动漫口语高频否定形，也是众多中级句型的底座',
    appliesTo: ['godan', 'ichidan', 'irregular', 'i-adj', 'na-adj']
  },
  {
    id: 'te',
    label: '连接形（て形）',
    shortLabel: 'て形',
    description: '请求、正在进行、动作先后衔接的万能连接器',
    appliesTo: ['godan', 'ichidan', 'irregular', 'i-adj', 'na-adj']
  },
  {
    id: 'ta',
    label: '普通体过去（た形）',
    shortLabel: 'た形',
    description: '表示完成与过去，变形规则与て形完全同步',
    appliesTo: ['godan', 'ichidan', 'irregular', 'i-adj', 'na-adj']
  },
  {
    id: 'masen',
    label: '礼貌体否定（ません）',
    shortLabel: 'ません形',
    description: '礼貌地表达“不做 / 不去 / 不是”',
    appliesTo: ['godan', 'ichidan', 'irregular', 'i-adj', 'na-adj']
  },
  {
    id: 'potential',
    label: '可能形（能做某事）',
    shortLabel: '可能形',
    description: '表达“会说日语 / 能买到票”等能力与可能性',
    appliesTo: ['godan', 'ichidan', 'irregular']
  },
  {
    id: 'volitional',
    label: '意志形（〜吧）',
    shortLabel: '意志形',
    description: '口语提议“一起去吧！”或表达自己打算',
    appliesTo: ['godan', 'ichidan', 'irregular']
  }
];

export const DOJO_WORDS: DojoWord[] = [
  // 五段动词（覆盖 9 种结尾 + 行く特例 + 常见伪一段）
  { id: 'v-kau', kanji: '買う', reading: 'かう', meaning: '买', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-au', kanji: '会う', reading: 'あう', meaning: '见面', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-matsu', kanji: '待つ', reading: 'まつ', meaning: '等待', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-motsu', kanji: '持つ', reading: 'もつ', meaning: '拿 / 拥有', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-toru', kanji: '撮る', reading: 'とる', meaning: '拍照', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-kaeru', kanji: '帰る', reading: 'かえる', meaning: '回去 / 回家', category: 'godan', categoryLabel: '五段（伪一段）', tricky: true, hint: '虽是 e+る 结尾，但属于高频五段例外！' },
  { id: 'v-hashiru', kanji: '走る', reading: 'はしる', meaning: '跑', category: 'godan', categoryLabel: '五段（伪一段）', tricky: true, hint: '虽是 i+る 结尾，但属于高频五段例外！' },
  { id: 'v-hairu', kanji: '入る', reading: 'はいる', meaning: '进入', category: 'godan', categoryLabel: '五段（伪一段）', tricky: true, hint: '注意区分：入る(はいる) 是五段动词！' },
  { id: 'v-shiru', kanji: '知る', reading: 'しる', meaning: '知道', category: 'godan', categoryLabel: '五段（伪一段）', tricky: true, hint: '高频陷阱词：知る 是五段动词！' },
  { id: 'v-nomu', kanji: '飲む', reading: 'のむ', meaning: '喝', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-yomu', kanji: '読む', reading: 'よむ', meaning: '读 / 阅读', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-asobu', kanji: '遊ぶ', reading: 'あそぶ', meaning: '玩耍', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-yobu', kanji: '呼ぶ', reading: 'よぶ', meaning: '叫 / 呼唤', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-shinu', kanji: '死ぬ', reading: 'しぬ', meaning: '死（唯一ぬ结尾动词）', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-kiku', kanji: '聞く', reading: 'きく', meaning: '听 / 询问', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-kaku', kanji: '書く', reading: 'かく', meaning: '写', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-iku', kanji: '行く', reading: 'いく', meaning: '去', category: 'godan', categoryLabel: '五段（音便特例）', tricky: true, hint: '行く 的て/た形不是いいて，而是促音便 行って/行った！' },
  { id: 'v-oyogu', kanji: '泳ぐ', reading: 'およぐ', meaning: '游泳', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-isogu', kanji: '急ぐ', reading: 'いそぐ', meaning: '赶忙 / 着急', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-hanasu', kanji: '話す', reading: 'はなす', meaning: '说话 / 交谈', category: 'godan', categoryLabel: '五段动词' },
  { id: 'v-dasu', kanji: '出す', reading: 'だす', meaning: '拿出 / 寄出', category: 'godan', categoryLabel: '五段动词' },

  // 一段动词
  { id: 'v-taberu', kanji: '食べる', reading: 'たべる', meaning: '吃', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-miru', kanji: '見る', reading: 'みる', meaning: '看', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-okiru', kanji: '起きる', reading: 'おきる', meaning: '起床', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-neru', kanji: '寝る', reading: 'ねる', meaning: '睡觉', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-akeru', kanji: '開ける', reading: 'あける', meaning: '打开', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-oboeru', kanji: '覚える', reading: 'おぼえる', meaning: '记住', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-oshieru', kanji: '教える', reading: 'おしえる', meaning: '教 / 告诉', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-kariru', kanji: '借りる', reading: 'かりる', meaning: '借入', category: 'ichidan', categoryLabel: '一段动词' },
  { id: 'v-tsukareru', kanji: '疲れる', reading: 'つかれる', meaning: '累 / 疲惫', category: 'ichidan', categoryLabel: '一段动词' },

  // 不规则动词
  { id: 'v-suru', kanji: 'する', reading: 'する', meaning: '做', category: 'irregular', categoryLabel: 'サ变不规则', tricky: true },
  { id: 'v-benkyou', kanji: '勉強する', reading: 'べんきょうする', meaning: '学习', category: 'irregular', categoryLabel: 'サ变不规则' },
  { id: 'v-yoyaku', kanji: '予約する', reading: 'よやくする', meaning: '预约', category: 'irregular', categoryLabel: 'サ变不规则' },
  { id: 'v-kuru', kanji: '来る', reading: 'くる', meaning: '来', category: 'irregular', categoryLabel: 'カ变不规则', tricky: true, hint: '注意读音变化：きます / こない / きて / こられる！' },

  // い形容词
  { id: 'a-takai', kanji: '高い', reading: 'たかい', meaning: '贵 / 高', category: 'i-adj', categoryLabel: 'い形容词' },
  { id: 'a-oishii', kanji: '美味しい', reading: 'おいしい', meaning: '好吃', category: 'i-adj', categoryLabel: 'い形容词' },
  { id: 'a-tanoshii', kanji: '楽しい', reading: 'たのしい', meaning: '开心 / 愉快', category: 'i-adj', categoryLabel: 'い形容词' },
  { id: 'a-atsui', kanji: '暑い', reading: 'あつい', meaning: '（天气）热', category: 'i-adj', categoryLabel: 'い形容词' },
  { id: 'a-ii', kanji: 'いい', reading: 'いい', meaning: '好', category: 'i-adj', categoryLabel: 'い形容词（特例）', tricky: true, hint: '变形时必须先还原成 よい（よくない / よかった）！' },

  // な形容词
  { id: 'n-shizuka', kanji: '静か', reading: 'しずか', meaning: '安静', category: 'na-adj', categoryLabel: 'な形容词' },
  { id: 'n-benri', kanji: '便利', reading: 'べんり', meaning: '方便', category: 'na-adj', categoryLabel: 'な形容词' },
  { id: 'n-kirei', kanji: 'きれい', reading: 'きれい', meaning: '漂亮 / 干净', category: 'na-adj', categoryLabel: 'な形容词（陷阱）', tricky: true, hint: '虽然以 い 结尾，其实是 な形容词（汉字：綺麗）！' },
  { id: 'n-yuumei', kanji: '有名', reading: 'ゆうめい', meaning: '有名', category: 'na-adj', categoryLabel: 'な形容词（陷阱）', tricky: true, hint: '读音以 い 结尾，但属于 な形容词！' },
  { id: 'n-suki', kanji: '好き', reading: 'すき', meaning: '喜欢', category: 'na-adj', categoryLabel: 'な形容词' }
];

const GODAN_I_ROW: Record<string, string> = {
  う: 'い', つ: 'ち', る: 'り', む: 'み', ぶ: 'び', ぬ: 'に', く: 'き', ぐ: 'ぎ', す: 'し'
};
const GODAN_A_ROW: Record<string, string> = {
  う: 'わ', つ: 'た', る: 'ら', む: 'ま', ぶ: 'ば', ぬ: 'な', く: 'か', ぐ: 'が', す: 'さ'
};
const GODAN_E_ROW: Record<string, string> = {
  う: 'え', つ: 'て', る: 'れ', む: 'め', ぶ: 'べ', ぬ: 'ね', く: 'け', ぐ: 'げ', す: 'せ'
};
const GODAN_O_ROW: Record<string, string> = {
  う: 'おう', つ: 'とう', る: 'ろう', む: 'もう', ぶ: 'ぼう', ぬ: 'のう', く: 'こう', ぐ: 'ごう', す: 'そう'
};

function godanTeEnding(last: string, isIku: boolean): { te: string; ta: string; rule: string } {
  if (isIku) {
    return { te: 'って', ta: 'った', rule: '特例：行く 不走 い音便，直接促音便 → って / った' };
  }
  if (['う', 'つ', 'る'].includes(last)) {
    return { te: 'って', ta: 'った', rule: `五段音便口诀「う・つ・る → って/った」（${last} → っ）` };
  }
  if (['む', 'ぶ', 'ぬ'].includes(last)) {
    return { te: 'んで', ta: 'んだ', rule: `五段音便口诀「む・ぶ・ぬ → んで/んだ」（${last} → ん＋浊音）` };
  }
  if (last === 'く') {
    return { te: 'いて', ta: 'いた', rule: '五段音便口诀「く → いて/いた」（い音便）' };
  }
  if (last === 'ぐ') {
    return { te: 'いで', ta: 'いだ', rule: '五段音便口诀「ぐ → いで/いだ」（い音便＋浊音）' };
  }
  return { te: 'して', ta: 'した', rule: '五段す结尾直接「す → して/した」' };
}

function uniqueDistractors(correct: string, candidates: string[]): string[] {
  const seen = new Set<string>([correct]);
  const result: string[] = [];
  for (const c of candidates) {
    if (c && !seen.has(c)) {
      seen.add(c);
      result.push(c);
    }
    if (result.length === 3) break;
  }
  return result;
}

export function conjugateWord(word: DojoWord, form: ConjugationFormId): ConjugationResult {
  const { kanji, reading, category } = word;
  const kStem = kanji.slice(0, -1);
  const rStem = reading.slice(0, -1);
  const last = reading.slice(-1);

  // 1. Irregular Verbs
  if (category === 'irregular') {
    if (reading === 'くる') {
      const map: Record<ConjugationFormId, ConjugationResult> = {
        masu: { kanjiForm: '来ます', readingForm: 'きます', ruleSteps: 'カ变动词 来る(くる) → き＋ます', distractors: ['くります', 'くます', 'こます'] },
        masen: { kanjiForm: '来ません', readingForm: 'きません', ruleSteps: 'カ变动词 来る(くる) → き＋ません', distractors: ['くりません', 'こません', 'くません'] },
        nai: { kanjiForm: '来ない', readingForm: 'こない', ruleSteps: 'カ变动词 来る(くる) 否定读音变为 こ＋ない', distractors: ['きない', 'くらない', 'くない'] },
        te: { kanjiForm: '来て', readingForm: 'きて', ruleSteps: 'カ变动词 来る(くる) → き＋て', distractors: ['くって', 'こて', 'くいて'] },
        ta: { kanjiForm: '来た', readingForm: 'きた', ruleSteps: 'カ变动词 来る(くる) → き＋た', distractors: ['くった', 'こた', 'くいた'] },
        potential: { kanjiForm: '来られる', readingForm: 'こられる', ruleSteps: 'カ变动词 来る(くる) 可能形为 こ＋られる', distractors: ['きられる', 'くれる', 'くられる'] },
        volitional: { kanjiForm: '来よう', readingForm: 'こよう', ruleSteps: 'カ变动词 来る(くる) 意志形为 こ＋よう', distractors: ['きよう', 'くろう', 'くよう'] }
      };
      return map[form];
    }
    // する / 〜する
    const kBase = kanji.slice(0, -2);
    const rBase = reading.slice(0, -2);
    const map: Record<ConjugationFormId, [string, string, string[]]> = {
      masu: ['します', 'サ变动词 する → し＋ます', ['すります', 'すます', 'せます']],
      masen: ['しません', 'サ变动词 する → し＋ません', ['すりません', 'すません', 'せません']],
      nai: ['しない', 'サ变动词 する → し＋ない', ['すらない', 'すない', 'さない']],
      te: ['して', 'サ变动词 する → し＋て', ['すって', 'すて', 'さして']],
      ta: ['した', 'サ变动词 する → し＋た', ['すった', 'すた', 'さした']],
      potential: ['できる', 'サ变动词 する 可能形独立变为 できる', ['しられる', 'すれる', 'しれる']],
      volitional: ['しよう', 'サ变动词 する → し＋よう', ['すろう', 'すよう', 'そう']]
    };
    const [suffix, ruleSteps, distSuffixes] = map[form];
    return {
      kanjiForm: kBase + suffix,
      readingForm: rBase + suffix,
      ruleSteps,
      distractors: uniqueDistractors(rBase + suffix, distSuffixes.map((s) => rBase + s))
    };
  }

  // 2. Ichidan Verbs
  if (category === 'ichidan') {
    const map: Record<ConjugationFormId, [string, string, string[]]> = {
      masu: ['ます', '一段动词最简单：直接去掉词尾 る ＋ ます', ['ります', 'います', 'えます']],
      masen: ['ません', '一段动词：去掉词尾 る ＋ ません', ['りません', 'いません', 'えません']],
      nai: ['ない', '一段动词：去掉词尾 る ＋ ない', ['らない', 'わない', 'くない']],
      te: ['て', '一段动词：去掉词尾 る ＋ て（不需要音便）', ['って', 'んで', 'いて']],
      ta: ['た', '一段动词：去掉词尾 る ＋ た', ['った', 'んだ', 'いた']],
      potential: ['られる', '一段动词：去掉词尾 る ＋ られる（口语常省略成れる）', ['れる', 'える', 'らせる']],
      volitional: ['よう', '一段动词：去掉词尾 る ＋ よう', ['ろう', 'おう', 'う']]
    };
    const [suffix, ruleSteps, distSuffixes] = map[form];
    return {
      kanjiForm: kStem + suffix,
      readingForm: rStem + suffix,
      ruleSteps,
      distractors: uniqueDistractors(rStem + suffix, distSuffixes.map((s) => rStem + s))
    };
  }

  // 3. Godan Verbs
  if (category === 'godan') {
    const iKana = GODAN_I_ROW[last];
    const aKana = GODAN_A_ROW[last];
    const eKana = GODAN_E_ROW[last];
    const oKana = GODAN_O_ROW[last];
    const isIku = reading === 'いく';

    if (form === 'masu') {
      const ans = rStem + iKana + 'ます';
      return {
        kanjiForm: kStem + iKana + 'ます',
        readingForm: ans,
        ruleSteps: `五段动词「う段 → い段 ＋ ます」：${last} → ${iKana}＋ます`,
        distractors: uniqueDistractors(ans, [rStem + 'ます', rStem + eKana + 'ます', rStem + aKana + 'ます'])
      };
    }
    if (form === 'masen') {
      const ans = rStem + iKana + 'ません';
      return {
        kanjiForm: kStem + iKana + 'ません',
        readingForm: ans,
        ruleSteps: `五段动词「う段 → い段 ＋ ません」：${last} → ${iKana}＋ません`,
        distractors: uniqueDistractors(ans, [rStem + 'ません', rStem + aKana + 'ません', rStem + eKana + 'ません'])
      };
    }
    if (form === 'nai') {
      const ans = rStem + aKana + 'ない';
      const extraNote = last === 'う' ? '（注意：う 变 わ 而不是 あ！）' : '';
      return {
        kanjiForm: kStem + aKana + 'ない',
        readingForm: ans,
        ruleSteps: `五段动词「う段 → あ段 ＋ ない」：${last} → ${aKana}＋ない${extraNote}`,
        distractors: uniqueDistractors(ans, [
          rStem + 'ない',
          rStem + iKana + 'ない',
          last === 'う' ? rStem + 'あない' : rStem + eKana + 'ない'
        ])
      };
    }
    if (form === 'te' || form === 'ta') {
      const info = godanTeEnding(last, isIku);
      const ending = form === 'te' ? info.te : info.ta;
      const ans = rStem + ending;
      const altEndings = form === 'te' ? ['て', 'って', 'いて', 'んで', 'いで'] : ['た', 'った', 'いた', 'んだ', 'いだ'];
      return {
        kanjiForm: kStem + ending,
        readingForm: ans,
        ruleSteps: info.rule,
        distractors: uniqueDistractors(ans, altEndings.map((e) => rStem + e))
      };
    }
    if (form === 'potential') {
      const ans = rStem + eKana + 'る';
      return {
        kanjiForm: kStem + eKana + 'る',
        readingForm: ans,
        ruleSteps: `五段动词可能形「う段 → え段 ＋ る」：${last} → ${eKana}＋る`,
        distractors: uniqueDistractors(ans, [rStem + 'られる', rStem + aKana + 'れる', rStem + iKana + 'る'])
      };
    }
    // volitional
    const ans = rStem + oKana;
    return {
      kanjiForm: kStem + oKana,
      readingForm: ans,
      ruleSteps: `五段动词意志形「う段 → お段 ＋ う」：${last} → ${oKana}`,
      distractors: uniqueDistractors(ans, [rStem + 'よう', rStem + aKana + 'う', rStem + eKana + 'よう'])
    };
  }

  // 4. i-Adjectives
  if (category === 'i-adj') {
    const isIi = reading === 'いい';
    const baseK = isIi ? 'よ' : kStem;
    const baseR = isIi ? 'よ' : rStem;

    if (form === 'masu') {
      const ans = reading + 'です';
      return {
        kanjiForm: kanji + 'です',
        readingForm: ans,
        ruleSteps: 'い形容词礼貌体：直接在词尾后加 です',
        distractors: uniqueDistractors(ans, [baseR + 'ます', baseR + 'だです', baseR + 'くです'])
      };
    }
    if (form === 'masen') {
      const ans = baseR + 'くないです';
      return {
        kanjiForm: baseK + 'くないです',
        readingForm: ans,
        ruleSteps: isIi
          ? '特例 いい 先还原成 よい → 去い加 くないです'
          : 'い形容词礼貌否定：去词尾 い → くないです（或 くありません）',
        distractors: uniqueDistractors(ans, [reading + 'じゃないです', reading + 'ません', baseR + 'ないです'])
      };
    }
    if (form === 'nai') {
      const ans = baseR + 'くない';
      return {
        kanjiForm: baseK + 'くない',
        readingForm: ans,
        ruleSteps: isIi
          ? '特例 いい 必须先还原为 よい → 去い变 よくない'
          : 'い形容词否定：去掉词尾 い → くない',
        distractors: uniqueDistractors(ans, [reading + 'じゃない', baseR + 'ない', reading + 'くない'])
      };
    }
    if (form === 'te') {
      const ans = baseR + 'くて';
      return {
        kanjiForm: baseK + 'くて',
        readingForm: ans,
        ruleSteps: isIi
          ? '特例 いい 还原为 よい → 去い变 よくて'
          : 'い形容词て形（表示并列/原因）：去词尾 い → くて',
        distractors: uniqueDistractors(ans, [reading + 'で', baseR + 'って', baseR + 'て'])
      };
    }
    // ta
    const ans = baseR + 'かった';
    return {
      kanjiForm: baseK + 'かった',
      readingForm: ans,
      ruleSteps: isIi
        ? '特例 いい 还原为 よい → 去い变 よかった'
        : 'い形容词过去形：去掉词尾 い → かった',
      distractors: uniqueDistractors(ans, [reading + 'だった', baseR + 'た', reading + 'かった'])
    };
  }

  // 5. na-Adjectives
  if (form === 'masu') {
    const ans = reading + 'です';
    return {
      kanjiForm: kanji + 'です',
      readingForm: ans,
      ruleSteps: 'な形容词礼貌体：词干直接加 です（和名词完全一样）',
      distractors: uniqueDistractors(ans, [reading + 'なです', reading + 'ます', reading + 'だです'])
    };
  }
  if (form === 'masen') {
    const ans = reading + 'じゃないです';
    return {
      kanjiForm: kanji + 'じゃないです',
      readingForm: ans,
      ruleSteps: 'な形容词礼貌否定：词干 ＋ じゃないです（书面用 ではありません）',
      distractors: uniqueDistractors(ans, [reading.slice(0, -1) + 'くないです', reading + 'ません', reading + 'なじゃないです'])
    };
  }
  if (form === 'nai') {
    const ans = reading + 'じゃない';
    return {
      kanjiForm: kanji + 'じゃない',
      readingForm: ans,
      ruleSteps: 'な形容词普通否定：词干 ＋ じゃない（书面用 ではない），切忌变 くない！',
      distractors: uniqueDistractors(ans, [reading.slice(0, -1) + 'くない', reading + 'くない', reading + 'なない'])
    };
  }
  if (form === 'te') {
    const ans = reading + 'で';
    return {
      kanjiForm: kanji + 'で',
      readingForm: ans,
      ruleSteps: 'な形容词て形（表示并列/中顿）：词干直接加 で',
      distractors: uniqueDistractors(ans, [reading.slice(0, -1) + 'くて', reading + 'て', reading + 'なで'])
    };
  }
  // ta
  const ans = reading + 'だった';
  return {
    kanjiForm: kanji + 'だった',
    readingForm: ans,
    ruleSteps: 'な形容词过去形：词干直接加 だった（礼貌体为 でした）',
    distractors: uniqueDistractors(ans, [reading.slice(0, -1) + 'かった', reading + 'かった', reading + 'なだった'])
  };
}

// Simple romaji-to-hiragana normalizer for typing mode comfort
const ROMAJI_TABLE: [string, string][] = [
  ['kka', 'っか'], ['kki', 'っき'], ['kku', 'っく'], ['kke', 'っけ'], ['kko', 'っこ'],
  ['tta', 'った'], ['tte', 'って'], ['tto', 'っと'], ['tsu', 'つ'], ['chi', 'ち'], ['shi', 'し'],
  ['sha', 'しゃ'], ['shu', 'しゅ'], ['sho', 'しょ'], ['cha', 'ちゃ'], ['chu', 'ちゅ'], ['cho', 'ちょ'],
  ['ja', 'じゃ'], ['ju', 'じゅ'], ['jo', 'じょ'], ['kya', 'きゃ'], ['kyu', 'きゅ'], ['kyo', 'きょ'],
  ['ka', 'か'], ['ki', 'き'], ['ku', 'く'], ['ke', 'け'], ['ko', 'こ'],
  ['ga', 'が'], ['gi', 'ぎ'], ['gu', 'ぐ'], ['ge', 'げ'], ['go', 'ご'],
  ['sa', 'さ'], ['su', 'す'], ['se', 'せ'], ['so', 'そ'],
  ['za', 'ざ'], ['ji', 'じ'], ['zu', 'ず'], ['ze', 'ぜ'], ['zo', 'ぞ'],
  ['ta', 'た'], ['te', 'て'], ['to', 'と'],
  ['da', 'だ'], ['de', 'で'], ['do', 'ど'],
  ['na', 'な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne', 'ね'], ['no', 'の'],
  ['ha', 'は'], ['hi', 'ひ'], ['fu', 'ふ'], ['he', 'へ'], ['ho', 'ほ'],
  ['ba', 'ば'], ['bi', 'び'], ['bu', 'ぶ'], ['be', 'べ'], ['bo', 'ぼ'],
  ['pa', 'ぱ'], ['pi', 'ぴ'], ['pu', 'ぷ'], ['pe', 'ぺ'], ['po', 'ぽ'],
  ['ma', 'ま'], ['mi', 'み'], ['mu', 'む'], ['me', 'め'], ['mo', 'も'],
  ['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ'],
  ['ra', 'ら'], ['ri', 'り'], ['ru', 'る'], ['re', 'れ'], ['ro', 'ろ'],
  ['wa', 'わ'], ['wo', 'を'], ['nn', 'ん'],
  ['a', 'あ'], ['i', 'い'], ['u', 'う'], ['e', 'え'], ['o', 'お'],
  ['n', 'ん']
];

export function normalizeUserInputToHiragana(input: string): string {
  const cleaned = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!/[a-z]/.test(cleaned)) return cleaned;
  let result = '';
  let i = 0;
  while (i < cleaned.length) {
    let matched = false;
    for (const [romaji, kana] of ROMAJI_TABLE) {
      if (cleaned.startsWith(romaji, i)) {
        result += kana;
        i += romaji.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += cleaned[i];
      i += 1;
    }
  }
  return result;
}

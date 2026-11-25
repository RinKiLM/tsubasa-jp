import type { Lesson } from '../types/curriculum';

export const STAGE0_LESSONS_PART1: Lesson[] = [
  {
    id: 'stage0-01',
    number: '01',
    stage: 'Stage 0',
    title: '日语的骨架：SOV 语序、三大句型与「零主语」',
    subtitle: '打破中文逐字翻译习惯，3 分钟看懂任何日语句子的底层结构',
    estimatedMinutes: 8,
    tags: ['底层语序', '三大句型', '零主语'],
    coreInsight:
      '日语是一门“结论放在最后”的语言（主-宾-谓），所有成分靠后面的「助词」贴标签，而不是靠位置决定意思；只要上下文清楚，主语经常直接隐身。',
    sections: [
      {
        heading: '1. 结论永远在最后（SOV 语序）',
        summary:
          '中文和英语习惯把动作放在中间（我 吃 拉面），而日语把核心谓语（吃 / 是 / 好吃）牢牢钉在句子最末尾。',
        points: [
          '听到句尾之前，千万不要急着下结论——肯定、否定、过去、推测全都在句尾一锤定音。',
          '因为每个名词后面都贴着「助词标签」（は / を / に / で），前面成分的顺序其实相当自由，但**谓语必须在最后**。'
        ],
        formula: [
          { label: '主题', jp: '私は', role: 'topic' },
          { label: '时间/地点', jp: '新宿で', role: 'modifier' },
          { label: '宾语', jp: 'ラーメンを', role: 'particle' },
          { label: '核心谓语（结论）', jp: '食べます', role: 'predicate' }
        ]
      },
      {
        heading: '2. 万变不离其宗：日语只有 3 种基本句型',
        summary: '不管 N1 长难句看起来多吓人，拆到最底层永远只是这三种发动机之一：',
        points: [
          '① 名词句（A 是 B）：以「名词 + だ / です」结尾，如「今日は金曜日です」。',
          '② 形容词句（A 很……）：以「い形容词」或「な形容词 + だ / です」结尾，如「この曲はいいです」。',
          '③ 动词句（A 做了……）：以「动词」结尾，如「明日、東京へ行きます」。'
        ],
        table: {
          headers: ['句型', '核心引擎', '普通体（动漫/朋友）', '礼貌体（旅游/正式）'],
          rows: [
            ['名词句', 'A = B', '学生だ', '学生です'],
            ['い形容词句', 'A 的状态', '楽しい', '楽しいです'],
            ['な形容词句', 'A 的性质', '静かだ', '静かです'],
            ['动词句', 'A 的动作', '行く', '行きます']
          ]
        }
      },
      {
        heading: '3. 理解「零主语」：不写出来的“我/你/它”',
        summary:
          '你平时看番经常只听到一句「行くよ！」或「美味しい！」，完全没有主语——这不是偷懒，而是日语的默认机制。',
        points: [
          '在日语里，每句话在逻辑上都有隐形主语，只要说话双方都知道在聊谁，就会把「私は / あなたは / それは」省掉。',
          '反过来，如果你每句话都坚持说「私は… 私は…」，听起来反而会像机器翻译或者在刻意强调自己。'
        ]
      }
    ],
    pitfall: {
      title: '中文母语者最容易踩的坑：把「です」当成万能“是”',
      wrong: '私はラーメンを食べるです。 / この本は面白いですだ。',
      right: 'ラーメンを食べます。 / この本は面白いです。',
      reason:
        '「です」是名词/形容词句的礼貌收尾（相当于把 だ 变礼貌），动词本身要通过「ます形」变礼貌，绝不能直接在动词原形后面硬贴 です！'
    },
    examples: [
      {
        id: 's0-01-ex1',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: 'これ', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '東京駅', ruby: 'とうきょうえき', role: 'modifier' },
          { text: 'の', role: 'particle' },
          { text: '切符', ruby: 'きっぷ', role: 'plain' },
          { text: 'です', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '这是东京站的车票。',
        breakdown: '名词句：[これ(主题)] は [東京駅の切符(名词)] + です(礼貌结尾)'
      },
      {
        id: 's0-01-ex2',
        track: 'practical',
        contextTag: 'Live / 活动',
        tokens: [
          { text: '今日', ruby: 'きょう', role: 'modifier' },
          { text: 'の', role: 'particle' },
          { text: 'ライブ', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '最高', ruby: 'さいこう', role: 'plain' },
          { text: 'だった', role: 'predicate' },
          { text: '！', role: 'plain' }
        ],
        translation: '今天的 Live 太棒了！',
        breakdown: '名词/形容动词过去普通体：最高 + だった（礼貌体是 最高でした）'
      },
      {
        id: 's0-01-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: '田中', ruby: 'たなか', role: 'topic' },
          { text: 'さん', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '毎日', ruby: 'まいにち', role: 'modifier' },
          { text: '日本語', ruby: 'にほんご', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '勉強', ruby: 'べんきょう', role: 'predicate' },
          { text: 'します', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '田中先生每天学习日语。',
        breakdown: '标准 SOV 动词句：主题(田中さんは) + 频率(毎日) + 宾语(日本語を) + 动词(勉強します)'
      }
    ],
    quizzes: [
      {
        id: 's0-01-q1',
        type: 'choice',
        prompt: '下面哪一句的礼貌体表达是完全正确的？',
        options: [
          '毎日アニメを見るです。',
          '毎日アニメを見ます。',
          '毎日アニメを見ますです。',
          '毎日アニメは見るです。'
        ],
        answer: '毎日アニメを見ます。',
        explanation: '动词句变礼貌必须用动词自身的 ます形（見る → 見ます），不能在动词后面直接加 です。'
      },
      {
        id: 's0-01-q2',
        type: 'order',
        prompt: '请按日语 SOV 语序拼出：「我明天去大阪。」',
        options: ['大阪へ', '明日、', '行きます。', '私は'],
        answer: ['私は', '明日、', '大阪へ', '行きます。'],
        explanation: '主题「私は」和时间「明日」在前，目的地「大阪へ」紧随其后，核心动词「行きます」牢牢放在句尾。'
      },
      {
        id: 's0-01-q3',
        type: 'choice',
        prompt: '在餐厅点完菜端上来吃了一口，最自然的日语感叹是？',
        options: [
          '私はこのラーメンは美味しいです。',
          '美味しい！',
          'これは私に美味しいだ。',
          '私は食べる美味しいです。'
        ],
        answer: '美味しい！',
        explanation: '语境极其明确时，日语默认采用「零主语」省略，直接说出核心形容词谓语最地道自然。'
      }
    ]
  },
  {
    id: 'stage0-02',
    number: '02',
    stage: 'Stage 0',
    title: '主题「は」与主语「が」的本质区别',
    subtitle: '用「聚光灯模型」一次解决日语学习者最头疼的世纪难题',
    estimatedMinutes: 10,
    tags: ['は vs が', '聚光灯模型', '核心助词'],
    coreInsight:
      '「は」用来划定聊天话题的“画框”（至于 A 嘛，重点在后面）；「が」用来打聚光灯锁定唯一主角（正是 A！重点在前面）。',
    sections: [
      {
        heading: '1. 「は」是画框（话题标记），重点在后面',
        summary:
          '读作 wa 的「は」并不等于主语，它的真实含义是“关于……来说”。你先抛出一个大家已知的话题，真正想传达的新信息在「は」的后面。',
        points: [
          '「私は学生です」= 至于我嘛，【是学生】（信息重心在“是学生”）。',
          '对比功能：把两个事物并列对比时，用「は」画出界限。例如：「コーヒーは飲みますが、お酒は飲みません」（咖啡喝，酒不喝）。'
        ],
        formula: [
          { label: '已知话题（画框）', jp: 'この店は', role: 'topic' },
          { label: '重点新信息', jp: 'ラーメンが美味しいです', role: 'predicate' }
        ]
      },
      {
        heading: '2. 「が」是聚光灯（主语标记），重点在前面',
        summary:
          '当你要指出“究竟是谁/什么做了这件事”，或者描述眼前突然出现的新现象时，用「が」把聚光灯死死打在前面的词上。',
        points: [
          '「私がやりました」= 【是我】干的！（聚光灯打在“我”身上）。',
          '自然现象与初次登场：「雨が降っています」（下雨了）、「あ、猫がいる！」（啊，有只猫！）。',
          '疑问词做主语时**永远只能用 が**：问「誰が来ますか？」（谁来？），因为“谁”本身就是未知的新信息，绝不能用 は！回答也对应「佐藤さんが来ます」。'
        ]
      },
      {
        heading: '3. 情感与能力的固定拍档：好き / 分かる / できる 用「が」',
        summary:
          '中文说“我喜欢音乐”，会把音乐当宾语；但日语底层逻辑是“对我来说，音乐是令人喜欢的 / 可理解的”，所以对象用「が」而不是「を」。',
        points: [
          '「私は日本の音楽が好きです」（关于我：日本音乐 [が] 令人喜欢）。',
          '「日本語が少し分かります」（日语 [が] 稍微能懂）。',
          '这就是著名的「象は鼻が長い（大象鼻子长）」双主语句：は 定大范围，が 定里面的具体部位/对象！'
        ],
        table: {
          headers: ['场景', '用 は', '用 が', '核心差别'],
          rows: [
            ['自我介绍', '私は翼です', '私が翼です', '前者“我叫翼”；后者“我就是翼（你要找的那个人）”'],
            ['回答“谁去？”', '❌ 誰は行きますか', '✅ 誰が行きますか', '疑问词做主语必须用 が'],
            ['表达喜好', '猫は好きです（对比）', '猫が好きです（陈述）', '好き/嫌い/上手/分かる 默认配 が']
          ]
        }
      }
    ],
    pitfall: {
      title: '高频踩坑：把「好き・分かる」前面套上宾语助词「を」',
      wrong: '私はアニメを好きです。 / 日本語を分かります。',
      right: '私はアニメが好きです。 / 日本語が分かります。',
      reason:
        '「好き」是形容词、「分かる」是自动词（意为“变得清晰可懂”），它们描述的是对象呈现出来的性质，而不是你去动手操作它，因此必须用「が」。'
    },
    examples: [
      {
        id: 's0-02-ex1',
        track: 'practical',
        contextTag: '日常对话',
        tokens: [
          { text: '私', ruby: 'わたし', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '日本', ruby: 'にほん', role: 'modifier' },
          { text: 'の', role: 'particle' },
          { text: '音楽', ruby: 'おんがく', role: 'topic' },
          { text: 'が', role: 'particle' },
          { text: '好', ruby: 'す', role: 'predicate' },
          { text: 'きです', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '我喜欢日本的音乐。',
        breakdown: '经典「Aは Bが…」结构：A(私)是大话题，B(日本の音楽)是「好き」的聚光灯对象'
      },
      {
        id: 's0-02-ex2',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: 'あ、', role: 'plain' },
          { text: '電車', ruby: 'でんしゃ', role: 'topic' },
          { text: 'が', role: 'particle' },
          { text: '来', ruby: 'き', role: 'predicate' },
          { text: 'ました', role: 'predicate' },
          { text: 'よ', role: 'particle' },
          { text: '！', role: 'plain' }
        ],
        translation: '啊，电车来了哦！',
        breakdown: '描述眼前刚发生的新景象（发现感），主语「電車」必须用 が'
      },
      {
        id: 's0-02-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: '英語', ruby: 'えいご', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '話', ruby: 'はな', role: 'predicate' },
          { text: 'せます', role: 'predicate' },
          { text: 'が、', role: 'particle' },
          { text: '中国語', ruby: 'ちゅうごくご', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '話', ruby: 'はな', role: 'predicate' },
          { text: 'せません', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '英语会说，但是中文不会说。',
        breakdown: '对比用法：把「英語」和「中国語」分别用 は 框出来形成鲜明对比'
      }
    ],
    quizzes: [
      {
        id: 's0-02-q1',
        type: 'choice',
        prompt: '问“谁买了票？”应该选哪一个助词？',
        sentence: [
          { text: '誰', ruby: 'だれ', role: 'topic' },
          { text: '（　）', role: 'particle' },
          { text: 'チケットを', role: 'plain' },
          { text: '買', ruby: 'か', role: 'predicate' },
          { text: 'いましたか。', role: 'predicate' }
        ],
        options: ['は', 'が', 'を', 'に'],
        answer: 'が',
        explanation: '疑问词（誰 / 何 / どれ）做主语时，表示未知的锁定对象，必须使用「が」。'
      },
      {
        id: 's0-02-q2',
        type: 'choice',
        prompt: '填入正确助词表达“我稍微懂一点日语”：',
        sentence: [
          { text: '日本語', ruby: 'にほんご', role: 'topic' },
          { text: '（　）', role: 'particle' },
          { text: '少', ruby: 'すこ', role: 'modifier' },
          { text: 'し', role: 'modifier' },
          { text: '分', ruby: 'わ', role: 'predicate' },
          { text: 'かります。', role: 'predicate' }
        ],
        options: ['を', 'が', 'で', 'へ'],
        answer: 'が',
        explanation: '表示能力与理解的「分かる」前面固定搭配助词「が」，不用「を」。'
      },
      {
        id: 's0-02-q3',
        type: 'choice',
        prompt: '别人问“明天哪位去秋叶原？”，你想举手说“我去！”，最准确的是：',
        options: ['私は行きます。', '私が行きます。', '私を行きます。', '私に行きます。'],
        answer: '私が行きます。',
        explanation: '对方在寻找“是谁去”，焦点在你这个人身上，用「が」把聚光灯打在「私」上。'
      }
    ]
  },
  {
    id: 'stage0-03',
    number: '03',
    stage: 'Stage 0',
    title: '核心格助词地图：を・に・で・へ・と・から・まで',
    subtitle: '不背死规则，用空间画面感一次吃透 7 大高频助词',
    estimatedMinutes: 12,
    tags: ['に vs で', '格助词', '空间逻辑'],
    coreInsight:
      '助词是挂在名词后面的“方向路标”：想象画面就能分清——「に」像一枚图钉（钉住目的地/存在点/时间点），「で」像一座舞台（动作在这个舞台上发生，或借用某种工具完成）。',
    sections: [
      {
        heading: '1. 动作对象「を」与 移动方向「へ / に」',
        summary: '这三个助词负责标出动作的“靶子”和“箭头方向”。',
        points: [
          '「を（读 o）」：动作直接作用的对象（把…… / 吃……），如「水を飲む」「写真を撮る」。',
          '「に（图钉）」：移动的终点着陆点（日本に行く）、具体存在位置（机の上に本がある）、带数字的具体时间点（7時に起きる）。',
          '「へ（读 e，箭头）」：强调“朝……方向去”，比 に 更偏方向感，常与 行く/来る/帰る 搭配。'
        ]
      },
      {
        heading: '2. 黄金分水岭：「に」vs「で」（90% 的地点错误都在这里）',
        summary: '中文里两个都翻译成“在……”，但日语分得一清二楚：',
        points: [
          '静态存在、着陆、停留（ある / いる / 住む / 座る / 着く）→ 用图钉「に」：「秋葉原にいます」（我在秋叶原）。',
          '动态活动发生的场地（食べる / 買う / 見る / 勉強する）→ 用舞台「で」：「秋葉原でゲームを買います」（在秋叶原买游戏）。',
          '「で」还能表示工具、手段、交通方式和语言：「電車で行く」（坐电车去）、「日本語で話す」（用日语说）。'
        ],
        table: {
          headers: ['助词', '核心意象', '高频用法', '一眼秒懂例句'],
          rows: [
            ['を', '🎯 靶心', '动作的直接宾语', 'グッズを買う（买周边）'],
            ['に', '📌 图钉', '存在点 / 目的地 / 具体时间', '東京に住む・8時に会う'],
            ['で', '🎭 舞台 / 🔧 工具', '动作发生场所 / 手段交通', '渋谷で食べる・新幹線で行く'],
            ['へ', '🧭 箭头', '移动的方向', '日本へ行く（去日本）'],
            ['と', '🤝 并肩', '和某人一起 / 完全列举', '友達と行く（和朋友去）'],
            ['から / まで', '🏁 起点 / 终点', '时间或空间的“从…到…”', '9時から5時まで']
          ]
        }
      },
      {
        heading: '3. 伙伴「と」与区间「から〜まで」',
        summary: '出门旅游最常用的行程描述组合：',
        points: [
          '「と」= 和谁一起（友達と旅行する），或把两样东西完整列举（パンとコーヒー）。',
          '「から（从）〜 まで（到）」既能用于地点（新宿から渋谷まで），也能用于时间（月曜日から金曜日まで）。'
        ]
      }
    ],
    pitfall: {
      title: '高频踩坑：在某地做某事错用「に」，或时间词乱加「に」',
      wrong: 'レストランに晩ご飯を食べます。 / 昨日に映画を見ました。',
      right: 'レストランで晩ご飯を食べます。 / 昨日、映画を見ました。',
      reason:
        '① 吃饭是动态动作，地点必须用舞台「で」；②「今日・明日・昨日・毎日」这类相对时间词**不能加 に**，只有带具体数字/星期的时间（7時に / 日曜日に）才加 に！'
    },
    examples: [
      {
        id: 's0-03-ex1',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: 'ホテル', role: 'modifier' },
          { text: 'から', role: 'particle' },
          { text: '会場', ruby: 'かいじょう', role: 'modifier' },
          { text: 'まで', role: 'particle' },
          { text: '電車', ruby: 'でんしゃ', role: 'modifier' },
          { text: 'で', role: 'particle' },
          { text: '行', ruby: 'い', role: 'predicate' },
          { text: 'きます', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '从酒店坐电车去会场。',
        breakdown: 'から(起点) + まで(终点) + 電車で(交通工具) + 行きます(动词)'
      },
      {
        id: 's0-03-ex2',
        track: 'practical',
        contextTag: '日常对话',
        tokens: [
          { text: '友達', ruby: 'ともだち', role: 'modifier' },
          { text: 'と', role: 'particle' },
          { text: 'カフェ', role: 'modifier' },
          { text: 'で', role: 'particle' },
          { text: 'コーヒー', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '飲', ruby: 'の', role: 'predicate' },
          { text: 'みました', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '和朋友在咖啡馆喝了咖啡。',
        breakdown: '友達と(同伴) + カフェで(动作场所) + コーヒーを(宾语) + 飲みました'
      },
      {
        id: 's0-03-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: '駅', ruby: 'えき', role: 'modifier' },
          { text: 'の', role: 'particle' },
          { text: '前', ruby: 'まえ', role: 'modifier' },
          { text: 'に', role: 'particle' },
          { text: '大', ruby: 'おお', role: 'modifier' },
          { text: 'きい', role: 'modifier' },
          { text: '本屋', ruby: 'ほんや', role: 'topic' },
          { text: 'が', role: 'particle' },
          { text: 'あります', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '车站前面有一家大书店。',
        breakdown: '静态存在句：地点(駅前に) 用图钉「に」 + 存在物(大きい本屋が) + あります'
      }
    ],
    quizzes: [
      {
        id: 's0-03-q1',
        type: 'choice',
        prompt: '“在便利店买水”应该用哪个助词？',
        sentence: [
          { text: 'コンビニ', role: 'modifier' },
          { text: '（　）', role: 'particle' },
          { text: '水', ruby: 'みず', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '買', ruby: 'か', role: 'predicate' },
          { text: 'います。', role: 'predicate' }
        ],
        options: ['に', 'で', 'へ', 'と'],
        answer: 'で',
        explanation: '「買う（买）」是在该场所进行的动态行为，必须使用表示动作舞台的「で」。'
      },
      {
        id: 's0-03-q2',
        type: 'choice',
        prompt: '“用日语写邮件”中括号里填什么？',
        sentence: [
          { text: '日本語', ruby: 'にほんご', role: 'modifier' },
          { text: '（　）', role: 'particle' },
          { text: 'メールを', role: 'plain' },
          { text: '書', ruby: 'か', role: 'predicate' },
          { text: 'きます。', role: 'predicate' }
        ],
        options: ['に', 'を', 'で', 'から'],
        answer: 'で',
        explanation: '语言也属于表达的“工具/手段”，因此「日本語で」「英語で」固定用「で」。'
      },
      {
        id: 's0-03-q3',
        type: 'choice',
        prompt: '下面哪一句的时间助词使用是**正确**的？',
        options: [
          '明日に東京へ行きます。',
          '毎日に日本語を勉強します。',
          '7時に起きます。',
          '昨日で映画を見ました。'
        ],
        answer: '7時に起きます。',
        explanation: '具体时刻「7時」后面加「に」；而「明日・毎日・昨日」等相对时间词后面不能加「に」。'
      }
    ]
  },
  {
    id: 'stage0-04',
    number: '04',
    stage: 'Stage 0',
    title: '两类形容词（い形 & な形）的修饰与变形规律',
    subtitle: '分清为什么一个直接贴名词、一个必须加「な」，一次掌握全部时态变形',
    estimatedMinutes: 10,
    tags: ['い形容词', 'な形容词', '陷阱词'],
    coreInsight:
      '日语形容词分两派：「い形容词」自带变形尾巴，像微型动词一样直接修饰名词；「な形容词」骨子里其实是“带描述性质的名词”，修饰名词时需要粘合剂「な」，变否定/过去完全照搬名词。',
    sections: [
      {
        heading: '1. 修饰名词（做定语）时怎么连接？',
        summary: '这是两类形容词名字的由来，记住一句话就行：',
        points: [
          'い形容词：直接把原形放在名词前面，不需要任何粘合剂。例：「高いチケット」（贵的票）、「新しいカメラ」（新相机）。',
          'な形容词：中间必须加一个「な」把名词粘起来。例：「静かな店」（安静的店）、「便利なアプリ」（好用的 App）。'
        ],
        formula: [
          { label: 'い形容词直连', jp: '美味しい ＋ ラーメン', role: 'modifier' },
          { label: 'vs', jp: '/', role: 'plain' },
          { label: 'な形容词加な', jp: '有名 ＋ な ＋ 店', role: 'particle' }
        ]
      },
      {
        heading: '2. 否定与过去变形全景表（核心对比）',
        summary: 'い形容词通过改写词尾「い」变形；な形容词词干纹丝不动，靠后面的「だ/です」变形：',
        points: [
          'い形容词去「い」：变否定加「くない」，变过去加「かった」，变过去否定加「くなかった」。',
          '唯一高频特例：「いい（好）」变形前必须先变回古形「よい」→ よくない / よかった / よくなかった！',
          'な形容词：现在肯定「だ/です」、否定「じゃない/じゃないです」、过去「だった/でした」。'
        ],
        table: {
          headers: ['形态', 'い形容词（高い）', '特例（いい→よい）', 'な形容词（静か）'],
          rows: [
            ['现在肯定', '高い(です)', 'いい(です)', '静かだ / 静かです'],
            ['现在否定', '高くない(です)', 'よくない(です)', '静かじゃない(です)'],
            ['过去肯定', '高かった(です)', 'よかった(です)', '静かだった / 静かでした'],
            ['过去否定', '高くなかった(です)', 'よくなかった(です)', '静かじゃなかった(です)'],
            ['并列て形', '高くて', 'よくて', '静かで']
          ]
        }
      },
      {
        heading: '3. 避坑指南：长着「い」尾巴的“卧底”な形容词',
        summary: '有几个极高频的词虽然发音以 い 结尾，但它们其实是 な形容词！必须特别记住：',
        points: [
          'きれい（綺麗・漂亮/干净）→ きれいな景色（不是 きれいい）、きれいじゃない（不是 きれくない）。',
          'きらい（嫌い・讨厌）→ きらいな食べ物。',
          'ゆうめい（有名・有名）→ ゆうめいな声優 / 有名な店。'
        ]
      }
    ],
    pitfall: {
      title: '高频踩坑：把「きれい」当成 い形容词变形',
      wrong: 'この部屋はきれくないです。 / 昨日、天気はいかった。',
      right: 'この部屋はきれいじゃないです。 / 昨日、天気はよかった。',
      reason:
        '「きれい」汉字是「綺麗」，属于 な形容词，否定必须用 じゃない；而「いい」变形必须先恢复成「よい」，过去式是 よかった。'
    },
    examples: [
      {
        id: 's0-04-ex1',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: 'この', role: 'modifier' },
          { text: 'ホテル', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '駅', ruby: 'えき', role: 'modifier' },
          { text: 'に', role: 'particle' },
          { text: '近', ruby: 'ちか', role: 'predicate' },
          { text: 'くて', role: 'predicate' },
          { text: '便利', ruby: 'べんり', role: 'predicate' },
          { text: 'です', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '这家酒店离车站很近而且很方便。',
        breakdown: '形容词并列：近い(い形) → 近くて + 便利です(な形)'
      },
      {
        id: 's0-04-ex2',
        track: 'practical',
        contextTag: '动漫常用',
        tokens: [
          { text: '昨日', ruby: 'きのう', role: 'modifier' },
          { text: 'の', role: 'particle' },
          { text: 'イベント', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '本当', ruby: 'ほんとう', role: 'modifier' },
          { text: 'に', role: 'particle' },
          { text: '楽', ruby: 'たの', role: 'predicate' },
          { text: 'しかった', role: 'predicate' },
          { text: '！', role: 'plain' }
        ],
        translation: '昨天的活动真的太开心了！',
        breakdown: 'い形容词过去普通体：楽しい → 去い加かった → 楽しかった'
      },
      {
        id: 's0-04-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: 'ここ', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '静', ruby: 'しず', role: 'modifier' },
          { text: 'かな', role: 'particle' },
          { text: '公園', ruby: 'こうえん', role: 'plain' },
          { text: 'です', role: 'predicate' },
          { text: 'が、', role: 'particle' },
          { text: '夜', ruby: 'よる', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: 'あまり', role: 'modifier' },
          { text: '明', ruby: 'あか', role: 'predicate' },
          { text: 'るくないです', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '这里是个安静的公园，但晚上不太亮。',
        breakdown: 'な形定语「静かな公園」 + い形否定「明るくないです」（あまり 固定搭配否定）'
      }
    ],
    quizzes: [
      {
        id: 's0-04-q1',
        type: 'choice',
        prompt: '“这里曾经是一家很有名的店”怎么表达最准确？',
        options: [
          '有名な店だった。',
          '有名い店だった。',
          '有名かった店だ。',
          '有名な店かった。'
        ],
        answer: '有名な店だった。',
        explanation: '「有名」是 な形容词，修饰名词加「な」→ 有名な店；名词句过去式用「だった」。'
      },
      {
        id: 's0-04-q2',
        type: 'choice',
        prompt: '「いい（好）」的普通体否定形是？',
        options: ['いくない', 'いいじゃない', 'よくない', 'よない'],
        answer: 'よくない',
        explanation: '「いい」属于特例 い形容词，变形前一律恢复为「よい」，去 い 加 くない → よくない。'
      },
      {
        id: 's0-04-q3',
        type: 'order',
        prompt: '拼出句子：「这件 T 恤不贵。」',
        options: ['高く', 'この', 'ないです。', 'Tシャツは'],
        answer: ['この', 'Tシャツは', '高く', 'ないです。'],
        explanation: '高い（贵）去 い 加 くないです → 高くないです。'
      }
    ]
  }
];

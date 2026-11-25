import type { Lesson } from '../types/curriculum';

export const STAGE0_LESSONS_PART2: Lesson[] = [
  {
    id: 'stage0-05',
    number: '05',
    stage: 'Stage 0',
    title: '动词三大分类：五段、一段与不规则',
    subtitle: '30 秒精准识别任何日语动词类型，彻底告别变形死记硬背',
    estimatedMinutes: 9,
    tags: ['五段动词', '一段动词', '分类法则'],
    coreInsight:
      '日语几乎所有的动词变形（礼貌、否定、过去、可能、被动、使役）都由“动词属于哪一类”决定。先花 10 分钟彻底学会分类，后面 N5 到 N1 的变形效率会直接翻倍！',
    sections: [
      {
        heading: '1. 为什么原形全部以「う段假名」结尾？',
        summary:
          '翻开词典查任何日语动词（辞书形），词尾一定是 う・く・ぐ・す・つ・ぬ・ぶ・む・る 这 9 个「う段」假名之一。',
        points: [
          '不规则动词只有 2 个家族：「する（以及 勉強する/予約する 等所有 名词+する）」和「来る（くる）」。',
          '剩下的所有动词，只需要用一把简单的“三步筛子”就能分出五段和一段！'
        ]
      },
      {
        heading: '2. 30 秒判定三步筛子',
        summary: '拿到任何一个动词原形，按顺序问自己 3 个问题：',
        points: [
          '第一步：是「する / 来る」吗？ → 是的话就是【不规则动词】。',
          '第二步：词尾是「る」吗？ → 如果词尾不是 る（如 買う・書く・飲む・話す・待つ），**100% 是【五段动词】**，根本不用犹豫！',
          '第三步：词尾是「る」时，看「る」前面的那个假名是哪一段？\n  • 是 a/u/o 段（如 分かる・作る・乗る）→ **100% 是【五段动词】**。\n  • 是 i/e 段（如 見る・起きる・食べる・寝る）→ **绝大多数是【一段动词】**！'
        ],
        table: {
          headers: ['类别', '判定特征', '代表词', '变形难度'],
          rows: [
            ['不规则（仅 2 族）', 'する（〜する）、来る(くる)', '勉強する、来る', '单独记住 2 个即可'],
            ['一段动词', '「i段 / e段」＋ る', '食べる、見る、起きる、覚える', '最简单！去 る 直接拼接'],
            ['五段动词', '非 る 结尾，或「a/u/o段」＋ る', '買う、行く、飲む、話す、撮る', '在 あいうえお 五行内换音']
          ]
        }
      },
      {
        heading: '3. 记住这 7 个高频“伪一段”（实际是五段！）',
        summary:
          '有极少数高频动词长得像一段（i/e段 + る），但实际上是五段动词。不用怕，常用的就这几个，现在顺眼记住就够用到 N2：',
        points: [
          '帰る（かえる・回去）｜走る（はしる・跑）｜入る（はいる・进入）｜切る（きる・切）',
          '知る（しる・知道）｜要る（いる・需要）｜喋る（しゃべる・聊天）',
          '记忆窍门：平时你一定听过「帰って！」「知らない！」「走って！」——你早就在动漫里听出它们不是「帰て」「知ない」了，这就是语感帮你验证语法！'
        ]
      }
    ],
    pitfall: {
      title: '高频踩坑：把「帰る（かえる）」当成一段动词变「帰ます」',
      wrong: 'そろそろ帰ます。 / 私は知ない。',
      right: 'そろそろ帰ります。 / 私は知らない。',
      reason:
        '「帰る」和「知る」都属于高频“伪一段”五段动词，变形必须按五段规则把 る 变成 り/ら/っ（帰ります / 帰らない / 帰って；知ります / 知らない / 知って）。'
    },
    examples: [
      {
        id: 's0-05-ex1',
        track: 'practical',
        contextTag: '动漫常用',
        tokens: [
          { text: 'そんな', role: 'modifier' },
          { text: 'こと、', role: 'plain' },
          { text: '知', ruby: 'し', role: 'predicate' },
          { text: 'らない', role: 'predicate' },
          { text: 'よ', role: 'particle' },
          { text: '！', role: 'plain' }
        ],
        translation: '那种事我才不知道呢！',
        breakdown: '知る（五段例外）→ る变ら + ない → 知らない（绝不是 知ない）'
      },
      {
        id: 's0-05-ex2',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: 'ホテル', role: 'modifier' },
          { text: 'を', role: 'particle' },
          { text: '予約', ruby: 'よやく', role: 'predicate' },
          { text: 'します', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '预订酒店。',
        breakdown: '予約する 属于サ变不规则动词，する 直接变 します'
      },
      {
        id: 's0-05-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: '毎朝', ruby: 'まいあさ', role: 'modifier' },
          { text: '7時', ruby: 'しちじ', role: 'modifier' },
          { text: 'に', role: 'particle' },
          { text: '起', ruby: 'お', role: 'predicate' },
          { text: 'きて、', role: 'predicate' },
          { text: '朝', ruby: 'あさ', role: 'plain' },
          { text: 'ご飯', ruby: 'はん', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '食', ruby: 'た', role: 'predicate' },
          { text: 'べます', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '每天早上 7 点起床，吃早饭。',
        breakdown: '起きる(i+る 一段) → 起きて；食べる(e+る 一段) → 食べます'
      }
    ],
    quizzes: [
      {
        id: 's0-05-q1',
        type: 'choice',
        prompt: '以下哪个动词属于【一段动词】？',
        options: ['飲む（のむ）', '帰る（かえる）', '食べる（たべる）', '作る（つくる）'],
        answer: '食べる（たべる）',
        explanation: '飲む不是る结尾；作る是u段+る；帰る是伪一段五段例外；只有 食べる(e段+る) 是标准一段动词。'
      },
      {
        id: 's0-05-q2',
        type: 'choice',
        prompt: '「走る（はしる・跑）」属于哪一类动词？',
        options: ['一段动词', '五段动词（伪一段例外）', 'サ变不规则', 'カ变不规则'],
        answer: '五段动词（伪一段例外）',
        explanation: '走る 虽然是 i段+る，但属于高频五段例外，它的礼貌体是 走ります，て形是 走って。'
      },
      {
        id: 's0-05-q3',
        type: 'choice',
        prompt: '为什么「話す（はなす）」可以 0.5 秒确定是五段动词？',
        options: [
          '因为它只有两个汉字',
          '因为它不以「る」结尾',
          '因为它是敬语',
          '因为它是形容词'
        ],
        answer: '因为它不以「る」结尾',
        explanation: '只要动词原形不是「る」结尾，100% 是五段动词，没有任何例外！'
      }
    ]
  },
  {
    id: 'stage0-06',
    number: '06',
    stage: 'Stage 0',
    title: '礼貌体（ます）与普通体（原形/ない/た）的双向切换',
    subtitle: '把你听熟的动漫简体和去日本旅游要用的礼貌体彻底打通',
    estimatedMinutes: 11,
    tags: ['ます形', 'ない形', '普通体 vs 礼貌体'],
    coreInsight:
      '日语不是两套语言，而是同一个动词穿上“西装（礼貌体 ます）”还是穿“卫衣（普通体 辞书形/ない形）”。看动漫听到的都是卫衣版，去日本点餐交流换上西装版即可。',
    sections: [
      {
        heading: '1. 如何变礼貌体（ます形 / ません形）',
        summary: '记住“五段挪到 i 段，一段直接去 る”这一句口诀，全天下动词瞬间变礼貌：',
        points: [
          '五段动词：词尾从「う段」滑到同一行的「い段」+ ます。例：行く(ku→ki)→行きます、飲む(mu→mi)→飲みます、買う(u→i)→買います。',
          '一段动词：直接把「る」砍掉 + ます。例：食べる→食べます、見る→見ます。',
          '不规则：する → します；来る(くる) → 来ます(きます)。',
          '礼貌体的否定/过去/过去否定极有规律：ます → ません（否定）/ ました（过去）/ ませんでした（过去否定）。'
        ]
      },
      {
        heading: '2. 如何变普通体否定（ない形）——动漫高频核心',
        summary: '听番时满耳朵的「行かない」「食べない」「分からない」，构造法则同样工整：',
        points: [
          '五段动词：词尾从「う段」滑到同一行的「あ段」+ ない。例：行く(ku→ka)→行かない、飲む(mu→ma)→飲まない。',
          '⚠️ 唯一小细节：以「う」结尾的五段动词（買う・会う），不是变 あ，而是变「わ」→ 買わない・会わない！',
          '一段动词：去「る」+ ない。例：食べる→食べない、見る→見ない。',
          '不规则：する → しない；来る(くる) → 来ない(こない)（读音变 ko！）；ある(有) → ない（直接变 ない）。'
        ],
        table: {
          headers: ['原形（普通肯定）', '礼貌肯定（ます）', '普通否定（ない）', '礼貌否定（ません）'],
          rows: [
            ['行く（五段）', '行きます', '行かない', '行きません'],
            ['買う（五段う结尾）', '買います', '買わない', '買いません'],
            ['食べる（一段）', '食べます', '食べない', '食べません'],
            ['する（不规则）', 'します', 'しない', 'しません'],
            ['来る・くる（不规则）', '来ます（きます）', '来ない（こない）', '来ません（きません）']
          ]
        }
      },
      {
        heading: '3. 什么时候用礼貌体，什么时候用普通体？',
        summary: '掌握社交距离感，既不失礼也不显生分：',
        points: [
          '去日本旅游对店员、车站工作人员、陌生人、初次见面的同好 → 统一用礼貌体（ます / です），安全又得体。',
          '和要好的朋友、自言自语、动漫台词、以及**嵌入长句中间修饰名词时** → 用普通体！学完这课，建议马上点进「变形道场」把 ます形 和 ない形 刷到脱口而出。'
        ]
      }
    ],
    pitfall: {
      title: '高频踩坑：「う」结尾的五段动词否定错变成「あない」',
      wrong: '今日はグッズを買あない。 / 友達に会あない。',
      right: '今日はグッズを買わない。 / 友達に会わない。',
      reason:
        '现代日语里为了避免元音连读拗口，所有以「う」结尾的五段动词（買う・会う・使う・歌う）在变 ない形 时，「う」一律变成「わ」！'
    },
    examples: [
      {
        id: 's0-06-ex1',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: 'すみません、', role: 'plain' },
          { text: '袋', ruby: 'ふくろ', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '要', ruby: 'い', role: 'predicate' },
          { text: 'りません', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '不好意思，我不需要购物袋。',
        breakdown: '要る(伪一段五段) → 要り + ません（日本便利店结账每天必用第一高频句！）'
      },
      {
        id: 's0-06-ex2',
        track: 'practical',
        contextTag: '动漫常用',
        tokens: [
          { text: 'まだ', role: 'modifier' },
          { text: '諦', ruby: 'あきら', role: 'predicate' },
          { text: 'めない', role: 'predicate' },
          { text: 'よ', role: 'particle' },
          { text: '！', role: 'plain' }
        ],
        translation: '我才不会就此放弃呢！',
        breakdown: '諦める(e+る 一段) → 去る加ない → 諦めない'
      },
      {
        id: 's0-06-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: '昨日', ruby: 'きのう', role: 'modifier' },
          { text: 'は', role: 'particle' },
          { text: '忙', ruby: 'いそが', role: 'predicate' },
          { text: 'しくて、', role: 'predicate' },
          { text: 'テレビ', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '見', ruby: 'み', role: 'predicate' },
          { text: 'ませんでした', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '昨天很忙，没有看电视。',
        breakdown: '見る(一段) → 見ませんでした（礼貌过去否定）'
      }
    ],
    quizzes: [
      {
        id: 's0-06-q1',
        type: 'choice',
        prompt: '「使う（つかう・使用）」的普通体否定（ない形）是？',
        options: ['使あない', '使わない', '使いない', '使ない'],
        answer: '使わない',
        explanation: '以「う」结尾的五段动词变 ない形 时，「う」必须变为「わ」→ 使わない。'
      },
      {
        id: 's0-06-q2',
        type: 'choice',
        prompt: '「来る（くる）」的普通体否定「来ない」应该怎么读？',
        options: ['きない', 'くない', 'こない', 'くらない'],
        answer: 'こない',
        explanation: 'カ变不规则动词 来る 在 ない形 时读作 こない，而在 ます形 时读作 きます。'
      },
      {
        id: 's0-06-q3',
        type: 'choice',
        prompt: '把动漫台词「ラーメンを食べない」换成在餐厅对店员说的礼貌体是？',
        options: ['ラーメンを食べません。', 'ラーメンを食べないます。', 'ラーメンを食べりません。', 'ラーメンを食べじゃないです。'],
        answer: 'ラーメンを食べません。',
        explanation: '一段动词 食べる 的礼貌体否定是去 る 加 ません → 食べません。'
      }
    ]
  },
  {
    id: 'stage0-07',
    number: '07',
    stage: 'Stage 0',
    title: '万能连接器「て形」与五段音便规律',
    subtitle: '攻克日语语法第一道里程碑，一次性解锁请求、进行时、先后动作与た形',
    estimatedMinutes: 13,
    tags: ['て形', '五段音便', 'ている / てください'],
    coreInsight:
      '「て形」是日语使用率最高的万能接口，而且只要学会「て形」，把末尾的 て/で 直接换成 た/だ，你就白嫖了全部普通体过去式「た形」！',
    sections: [
      {
        heading: '1. 一张表背牢五段「て形」音便口诀',
        summary:
          '一段动词和不规则动词极简单（食べる→食べて、する→して、来る→きて）；真正需要练熟的是五段动词的 4 组音便口诀（为了发音顺口演变而来）：',
        points: [
          '① う・つ・る → って（促音便）：買う→買って、待つ→待って、撮る→撮って。',
          '② む・ぶ・ぬ → んで（拨音便+浊化）：飲む→飲んで、遊ぶ→遊んで、死ぬ→死んで。',
          '③ く → いて / ぐ → いで（い音便）：書く→書いて、急ぐ→急いで。⚠️ 唯一特例：行く → 行って！',
          '④ す → して（不音便）：話す→話して、出す→出して。'
        ],
        table: {
          headers: ['词尾分组', 'て形变化', 'た形（同步）', '高频例词'],
          rows: [
            ['う・つ・る', '→ って', '→ った', '買う→買って / 待つ→待って / 帰る→帰って'],
            ['む・ぶ・ぬ', '→ んで', '→ んだ', '読む→読んで / 呼ぶ→呼んで / 死ぬ→死んで'],
            ['く（特例：行く）', '→ いて（行って）', '→ いた（行った）', '聞く→聞いて / 行く→行って'],
            ['ぐ', '→ いで', '→ いだ', '泳ぐ→泳いで / 急ぐ→急いで'],
            ['す', '→ して', '→ した', '話す→話して / 消す→消して'],
            ['一段 / する / 来る', '去る+て / して / きて', '去る+た / した / きた', '見る→見て / する→して / 来る→来て']
          ]
        }
      },
      {
        heading: '2. 「て形」4 大高频实战积木（旅游 & 日常天天用）',
        summary: '把动词变成 て形 后，往后面接不同的“小零件”就能变出无数句型：',
        points: [
          '① 动作先后串联：「駅へ行って、切符を買いました」（去了车站，然后买了票）。',
          '② 礼貌请求「〜てください」：「写真を撮ってください」（请帮我拍张照）、「ちょっと待ってください」（请稍等）。',
          '③ 正在进行 / 持续状态「〜ている」：「今、日本語を勉強しています」（正在学日语）、「東京に住んでいます」（住在东京）。',
          '④ 询问许可「〜てもいいですか」：「ここで写真を撮ってもいいですか」（可以在这里拍照吗？）。'
        ],
        formula: [
          { label: '动词 て形', jp: '写真を 撮って', role: 'predicate' },
          { label: '功能后缀', jp: 'もいいですか？', role: 'particle' }
        ]
      }
    ],
    pitfall: {
      title: '高频踩坑：把「行く」套用 く→いて 变成「行いて」',
      wrong: '明日、秋葉原へ行いて、ご飯を食べます。',
      right: '明日、秋葉原へ行って、ご飯を食べます。',
      reason:
        '「行く（いく）」是五段 く 结尾动词里唯一的音便特例，因为「いいて」听起来含糊不清，历史上变成了促音便「行って（いって） / 行った（いった）」。'
    },
    examples: [
      {
        id: 's0-07-ex1',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: 'すみません、', role: 'plain' },
          { text: 'ここ', role: 'modifier' },
          { text: 'で', role: 'particle' },
          { text: '写真', ruby: 'しゃしん', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '撮', ruby: 'と', role: 'predicate' },
          { text: 'ってもいいですか', role: 'predicate' },
          { text: '？', role: 'plain' }
        ],
        translation: '不好意思，可以在这里拍照吗？',
        breakdown: '撮る(五段る→って) → 撮って + もいいですか（许可询问）'
      },
      {
        id: 's0-07-ex2',
        track: 'practical',
        contextTag: 'Live / 活动',
        tokens: [
          { text: 'チケット', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '見', ruby: 'み', role: 'predicate' },
          { text: 'せてください', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '请出示一下您的门票。',
        breakdown: '見せる(一段・给别人看) → 見せて + ください（入场检票高频提示语）'
      },
      {
        id: 's0-07-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: '今', ruby: 'いま', role: 'modifier' },
          { text: '、', role: 'plain' },
          { text: '図書館', ruby: 'としょかん', role: 'modifier' },
          { text: 'で', role: 'particle' },
          { text: '本', ruby: 'ほん', role: 'plain' },
          { text: 'を', role: 'particle' },
          { text: '読', ruby: 'よ', role: 'predicate' },
          { text: 'んでいます', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '现在正在图书馆看书。',
        breakdown: '読む(五段む→んで) → 読んで + います（正在进行）'
      }
    ],
    quizzes: [
      {
        id: 's0-07-q1',
        type: 'choice',
        prompt: '「飲む（のむ・喝）」的 て形 是？',
        options: ['飲みて', '飲って', '飲んで', '飲いて'],
        answer: '飲んで',
        explanation: '五段音便口诀「む・ぶ・ぬ → んで」：飲む → 飲んで。'
      },
      {
        id: 's0-07-q2',
        type: 'choice',
        prompt: '「行く（いく・去）」的普通体过去式（た形）是？',
        options: ['行いた', '行った', '行きった', '行んだ'],
        answer: '行った',
        explanation: '行く 是唯一特例，て形为 行って，同步推得 た形 为 行った。'
      },
      {
        id: 's0-07-q3',
        type: 'order',
        prompt: '拼出句子：「请稍微等一下。」',
        options: ['待って', 'ちょっと', 'ください。'],
        answer: ['ちょっと', '待って', 'ください。'],
        explanation: '待つ（う・つ・る → って）变为 待って，加上 ください 构成礼貌请求。'
      }
    ]
  },
  {
    id: 'stage0-08',
    number: '08',
    stage: 'Stage 0',
    title: '长句的秘密：定语从句与「の」的名词化魔法',
    subtitle: '破译日剧和 JLPT 长难句的核心钥匙，完成 Stage 0 语法闭环！',
    estimatedMinutes: 12,
    tags: ['定语从句', 'の名词化', '长句拆解'],
    coreInsight:
      '日语里没有英语的 that / which！想修饰一个名词，直接把**整句普通体小句子**放在名词前面就行；而想把整个动作当成“一件事”，只需在普通体后面贴一个「の」或「こと」。',
    sections: [
      {
        heading: '1. 万物皆可向前修饰：日语定语从句的铁律',
        summary: '你以前觉得长句晕头转向，往往是因为没看出来“前面一大串其实只是在修饰后面的一个名词”。',
        points: [
          '规则极其暴力简单：**[普通体小句子] ＋ [被修饰的名词]**，中间**不能加 の**！',
          '例 1：「昨日見た映画」（昨天看的电影）= [昨日見た] 直接贴在 [映画] 前面。',
          '例 2：「私が一番好きな曲」（我最喜欢的歌）= [私が一番好きな] 直接贴在 [曲] 前面。',
          '⚠️ 重要细节：在定语从句内部，小句子的主语不能用「は」，必须改用「が」或「の」（如：母が作った料理 / 私の住んでいる町）。'
        ],
        formula: [
          { label: '普通体定语小句（主语用が）', jp: '昨日、友達が撮った', role: 'modifier' },
          { label: '中心名词', jp: '写真', role: 'topic' },
          { label: '整句主干', jp: 'は綺麗です', role: 'predicate' }
        ]
      },
      {
        heading: '2. 名词化魔法：把动作打包成名词（〜の / 〜こと）',
        summary:
          '助词「は・が・を」前面通常只能接名词。那我想说“我喜欢【听音乐】”、“我忘了【买票】”怎么办？给动词穿一层透明包装袋「の」或「こと」！',
        points: [
          '动词普通体 ＋ の/こと ＝ “做某事这件事”。',
          '「音楽を聴くのが好きです」（喜欢听音乐）——把 [音楽を聴く] 用「の」打包成名词，再接「が好きです」！',
          '「チケットを買うのを忘れました」（忘了买票）——把 [チケットを買う] 打包成宾语，再接「を忘れました」。',
          '口语感知类（好き / 上手 / 忘れる / 見る / 聞く）偏爱用「の」；书面定义或固定搭配（趣味は〜ことです / 〜ことができる）用「こと」。'
        ]
      },
      {
        heading: '3. 恭喜！你已打通 Stage 0 日语语法总骨架',
        summary: '用「找主干 → 剥定语 → 看句尾」三步法，你现在已经具备拆解绝大多数 N5–N3 真实日语句子的能力：',
        points: [
          '第一步：先找全句的「は」和句尾谓语，抓住主干（谁 怎么了）。',
          '第二步：把名词前面修饰它的普通体小句用括号 [ ] 框起来当成一个整体名词看。',
          '第三步：看清每个名词后的助词标签（が/を/に/で），句意瞬间豁然开朗！'
        ]
      }
    ],
    pitfall: {
      title: '高频踩坑：动词修饰名词时多加了一个中文式“的（の）”',
      wrong: '昨日買ったの本はとても面白いです。',
      right: '昨日買った本はとても面白いです。',
      reason:
        '中文说“昨天买【的】书”有个“的”，但日语动词普通体可以直接修饰名词，绝不能在动词和名词之间多加「の」！「の」只用于【名词 ＋ の ＋ 名词】（如 日本の本）。'
    },
    examples: [
      {
        id: 's0-08-ex1',
        track: 'practical',
        contextTag: '日常对话',
        tokens: [
          { text: '私', ruby: 'わたし', role: 'modifier' },
          { text: 'が', role: 'particle' },
          { text: '一番', ruby: 'いちばん', role: 'modifier' },
          { text: '好', ruby: 'す', role: 'modifier' },
          { text: 'きな', role: 'modifier' },
          { text: '曲', ruby: 'きょく', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: 'これ', role: 'plain' },
          { text: 'です', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '我最喜欢的歌是这首。',
        breakdown: '定语从句：[私が一番好きな] 修饰 [曲] → 整体当主题接「はこれです」'
      },
      {
        id: 's0-08-ex2',
        track: 'practical',
        contextTag: '日本旅行',
        tokens: [
          { text: '日本', ruby: 'にほん', role: 'modifier' },
          { text: 'を', role: 'particle' },
          { text: '旅行', ruby: 'りょこう', role: 'modifier' },
          { text: 'する', role: 'modifier' },
          { text: 'の', role: 'particle' },
          { text: 'が', role: 'particle' },
          { text: '大好', ruby: 'だいす', role: 'predicate' },
          { text: 'きです', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '我非常喜欢在日本旅行。',
        breakdown: '名词化：[日本を旅行する] + の → 打包成名词短语，再接 が大好きです'
      },
      {
        id: 's0-08-ex3',
        track: 'jlpt',
        contextTag: 'JLPT 规范',
        tokens: [
          { text: 'あそこ', role: 'modifier' },
          { text: 'で', role: 'particle' },
          { text: '本', ruby: 'ほん', role: 'modifier' },
          { text: 'を', role: 'particle' },
          { text: '読', ruby: 'よ', role: 'modifier' },
          { text: 'んでいる', role: 'modifier' },
          { text: '人', ruby: 'ひと', role: 'topic' },
          { text: 'は', role: 'particle' },
          { text: '山田', ruby: 'やまだ', role: 'plain' },
          { text: 'さんです', role: 'predicate' },
          { text: '。', role: 'plain' }
        ],
        translation: '在那里看书的那个人是山田先生。',
        breakdown: '经典 JLPT 拆句：[あそこで本を読んでいる](定语从句) + 人(中心词) + は山田さんです(主干)'
      }
    ],
    quizzes: [
      {
        id: 's0-08-q1',
        type: 'choice',
        prompt: '“昨天吃的拉面非常好吃”哪一句没有中式日语错误？',
        options: [
          '昨日食べたのラーメンはとても美味しかった。',
          '昨日食べましたラーメンはとても美味しかった。',
          '昨日食べたラーメンはとても美味しかった。',
          '昨日は食べたラーメンはとても美味しかった。'
        ],
        answer: '昨日食べたラーメンはとても美味しかった。',
        explanation: '动词修饰名词必须用普通体直接连接（昨日食べたラーメン），既不能用礼貌体，也不能加「の」。'
      },
      {
        id: 's0-08-q2',
        type: 'choice',
        prompt: '填入正确助词完成「我喜欢看动漫」：',
        sentence: [
          { text: 'アニメを', role: 'modifier' },
          { text: '見', ruby: 'み', role: 'modifier' },
          { text: 'る', role: 'modifier' },
          { text: '（　）', role: 'particle' },
          { text: 'が', role: 'particle' },
          { text: '好', ruby: 'す', role: 'predicate' },
          { text: 'きです。', role: 'predicate' }
        ],
        options: ['の', 'な', 'に', 'て'],
        answer: 'の',
        explanation: '用「の」将动词短语「アニメを見る」名词化，才能接在「が好きです」前面。'
      },
      {
        id: 's0-08-q3',
        type: 'order',
        prompt: '拼出句子：「忘了买明天去东京的车票。」',
        options: ['買うのを', '東京へ行く', '忘れました。', '切符を'],
        answer: ['東京へ行く', '切符を', '買うのを', '忘れました。'],
        explanation: '「東京へ行く」直接修饰「切符」，整个「切符を買う」再用「の」名词化作「忘れました」的宾语。'
      }
    ]
  }
];

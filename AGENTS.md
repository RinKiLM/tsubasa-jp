# AGENTS.md — 言翼 Tsubasa（日语语法结构自习室）协作指南

> 本文档面向所有参与本项目开发与内容维护的 AI Agent（Antigravity、Claude Code、Codex、Cursor、Gemini CLI 等）。
> **在修改任何代码或新增课程内容前，请务必先通读本文件。**

---

## 1. 项目定位与核心原则

- **项目名称**：言翼 Tsubasa（`tsubasa-jp`）—— 取自「言の翼（ことばのつばさ）」
- **目标用户**：中文母语的日语自学者（默认已熟练掌握五十音、有一定日漫/日剧语感，但缺乏系统语法框架），面向公开发布以帮助更多学习者。
- **终极学习目标**：从“零系统语法”一路通关至 **JLPT N1 + 日本自由行基本无语言障碍**。
- **核心优先级**：**真实学习效果 > 炫技工程复杂度**。
  - 严禁过度设计、严禁引入重型付费后端依赖；
  - 任何新功能都必须首先在 **PC 浏览器 + iPhone Safari PWA（390px 竖屏）** 上顺畅可用；
  - 例句与场景保持通用实用（日本旅行、日常对话、二次元/Live/活动、JLPT 规范），**不要过度私有化或写成纯个人梗**。

---

## 2. 技术栈与运行环境

- **框架**：React 19 + TypeScript 5.8（严格模式 `strict: true`）+ Vite 6 + Tailwind CSS v4
- **PWA**：`vite-plugin-pwa`（自动生成 `manifest.webmanifest` 与离线 Service Worker）
- **图标与工具**：`lucide-react`、`qrcode`（纯前端离线生成二维码）、`@supabase/supabase-js`（可选免费云同步）
- **开发机环境注意**：
  - 宿主 OS 为 Windows，部分终端环境为 **PowerShell 5.1**（不支持 `&&`，请使用 `;` 分隔命令）。
  - 生产校验命令：`npm run build`（会依次执行 `tsc -b` 与 `vite build`，提交前**必须零报错通过**）。
  - 本地开发命令：`npm run dev`（或 `npx vite --host --port 5173` 支持局域网手机预览）。

---

## 3. 目录结构与模块职责

```text
├── .github/workflows/deploy.yml   # GitHub Pages 自动构建与部署（自动注入 VITE_GITHUB_REPO 与可选 Supabase Secrets）
├── public/icon.svg                # 折纸羽翼应用图标（同时用于 Favicon 与 PWA 图标）
├── supabase/schema.sql            # Supabase 免费云同步（user_progress）与内测反馈（beta_feedback）建表与 RLS 脚本
├── DEPLOY_AND_TEST_GUIDE.md       # 给维护者的上线、Supabase 配置与朋友内测手册
├── README.md                      # GitHub 仓库展示文档
└── src/
    ├── App.tsx                    # 应用壳层：桌面侧边栏 / 手机底部 4 Tab、主题切换、URL ?sync= 检测、Supabase 自动同步
    ├── index.css                  # Tailwind v4 主题变量（和纸浅色 / 深夜靛蓝）、四色语法角色样式、Ruby 注音排版
    ├── vite-env.d.ts              # Vite import.meta.env 类型声明
    ├── types/
    │   └── curriculum.ts          # 课程、例句、RubyToken、练习题、错题与进度数据结构定义
    ├── data/
    │   ├── curriculum.ts          # 导出全部课程 ALL_LESSONS 与 4 阶段路线图 ROADMAP_STAGES
    │   ├── lessonsPart1.ts        # Stage 0 第 01–04 课
    │   └── lessonsPart2.ts        # Stage 0 第 05–08 课
    ├── lib/
    │   ├── conjugation.ts         # 日语动词/形容词实时变形引擎 + 44 词词库 + 常见误用干扰项生成 + 罗马音转平假名
    │   ├── speech.ts              # 日语 TTS 封装（含 iOS Safari 异步 voice 匹配与防 GC 截断处理）
    │   ├── storage.ts             # localStorage 持久化、连续学习天数、smart mergeProgress、Base64URL 魔法同步链接
    │   └── cloudSync.ts           # 可选 Supabase 客户端（未配置环境变量时优雅降级，零报错）
    └── components/
        ├── HomeView.tsx                    # 首页进度总览、统计卡片与 N1 路线图
        ├── LessonListView.tsx              # 课程目录页
        ├── LessonDetailView.tsx            # 互动课本阅读器（振假名/色块/译文/语速控制、公式积木、双轨例句、课后自测）
        ├── ConjugationDojoView.tsx         # 动词 & 形容词变形道场（速选/拼写双模式 + 词类/形态/陷阱词筛选）
        ├── ReviewAndSyncView.tsx           # 错题本、云同步入口、二维码/魔法链接同步、偏好设置
        ├── CloudSyncCard.tsx               # Supabase 账号登录/注册与实时同步状态卡片
        ├── QrCodeBox.tsx                   # 离线 PNG 二维码生成组件
        ├── SyncIncomingModal.tsx           # 识别 ?sync= 参数后的跨端进度对比与「智能合并」弹窗
        ├── BetaInviteAndFeedbackModal.tsx  # 邀请朋友内测（二维码+文案+4步清单）与结构化反馈弹窗
        ├── RubyText.tsx                    # `<ruby>` 振假名与四色语法结构高亮渲染器
        └── SpeakButton.tsx                 # 日语朗读按钮
```

---

## 4. 设计规范与工程铁律（必守）

### 4.1 视觉与主题系统
- **日系清爽极简风（和纸手账感）**：保持大量留白、圆角卡片（`rounded-2xl`）、克制的低饱和度配色。
- **CSS 变量驱动**：始终使用 `src/index.css` 中的变量（`--bg-canvas` / `--bg-surface` / `--border-subtle` / `--text-primary` / `--accent-indigo` 等），禁止写死纯黑/纯白导致暗色模式失效。
- **主按钮高对比度规则**：所有白字主按钮**必须使用 `bg-[var(--accent-indigo-btn)] text-white`**，不要用 `--accent-indigo`（它在暗色模式下是浅天蓝，配白字对比度不足）。
- **四色语法角色语义统一**：
  - `topic`（靛蓝）：主题 / 主语
  - `particle`（朱砂）：助词
  - `modifier`（琥珀）：修饰语 / 状语 / 时间地点
  - `predicate`（抹茶）：谓语 / 动词或形容词变形
- **移动端适配**：保证 `390×844`（iPhone 尺寸）下**零横向溢出**，表格外层必须包 `overflow-x-auto`，底部导航保留 `.pb-safe`。

### 4.2 静态部署与降级兼容
- **`vite.config.ts` 中必须保留 `base: './'`**：确保部署在 GitHub Pages 子路径（如 `/tsubasa-jp/`）、Cloudflare Pages 和 Vercel 根路径时静态资源全部正常加载。
- **零配置可用原则**：`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 为可选环境变量。未配置时应用必须 100% 正常工作（本地存储 + 扫码/魔法链接同步 + 微信复制反馈），绝不可抛运行时异常。
- **非破坏性同步契约**：跨端同步默认走 `mergeProgress(local, incoming)`（集合并集、取最高分、去重保留最新错题），**不要轻易改成直接覆盖**。
- **iOS Safari 语音注意事项**：维护 `src/lib/speech.ts` 时，必须保留 `onvoiceschanged` 显式匹配 `ja-JP` 语音以及全局持有 `activeUtterance` 引用的防 GC 逻辑。

### 4.3 课程内容编写规范（新增 Stage 1–3 时必读）
1. **结构优先讲解**：每课必须包含 `coreInsight`（一句话点透底层逻辑）、至少 1 个可视化 `formula` 或对比 `table`，以及面向中文母语者的 `pitfall`（❌常见误用 vs ✅地道表达 + 原因）。
2. **行内加粗**：`section.points` 和 `pitfall.reason` 中可使用 `**重点**`（`LessonDetailView` 内置 `renderInlineBold` 渲染），不要使用其他复杂 Markdown 语法。
3. **双轨例句**：每课至少 3 条例句，同时覆盖 `track: 'practical'`（日常/旅行/活动）与 `track: 'jlpt'`（规范应试），所有汉字必须准确标注 `ruby` 假名并标记正确的 `role`。
4. **语法严谨性**：动词五段/一段/不规则分类、特殊音便（`行く→行って`）、形容词特例（`いい→よい`、`きれい/きらい/ゆうめい` 为な形容词）、`は/が` 与 `に/で` 辨析必须零错误。
5. **课后自测**：每课至少 3 题，混合 `choice`（单选）与 `order`（语序拼句），每题必须附清晰 `explanation`。

---

## 5. 当前状态与多 Agent 交接路线图

### ✅ 已完成（v0.1.5 Beta）
- Vite + React + TS + Tailwind v4 + PWA 离线架构
- Stage 0 语法破冰骨架全套 8 课（01–08）+ 课后单选/拼句自测
- 动词 & 形容词变形道场（44 词、7 形态、速选/罗马音拼写、陷阱词专项）
- 错题本 + 离线二维码/魔法同步链接智能合并 + 可选 Supabase 实时云同步
- 邀请朋友内测弹窗（二维码 + 微信文案 + 4 步清单）+ 结构化反馈中心
- GitHub Pages 自动部署流水线与建表 SQL
- 项目已公开发布到 `RinKiLM/tsubasa-jp`，Pages 使用 GitHub Actions 部署。

### ⏭️ 下一阶段待开发任务（供后续 Agent 接力）
1. **v0.2（优先）— FSRS 间隔重复记忆引擎 + Stage 1（N5–N4 核心）**：
   - 在 `src/lib/srs.ts` 实现轻量 FSRS（或 SM-2 过渡到 FSRS）调度器，将已学语法点与错题纳入「今日复习队列」；
   - 新增 `src/data/stage1Lessons.ts`（授受动词、可能/被动/使役、四大条件句 `と/ば/たら/なら`、敬体/简体复合句）；
   - 新增「场景精读馆」组件（连贯日本旅行/生活/活动短篇对话，支持点击单句展开语法拆解）。
2. **v0.3 — Stage 2–3（N3–N1）与 JLPT 专项冲刺**：
   - 新增近义语法辨析矩阵、JLPT 星号排序题（`＿ ＿ ★ ＿`）刷题模式、学习统计可视化。
3. **v0.4 — 配套浏览器划词插件**：
   - 独立 `extension/` 目录（Chrome Manifest V3），复用同一套语法点索引与云同步库。

### 📝 Agent 协作交接约定
- 每次完成一个里程碑或较大改动后：
  1. 必须运行 `npm run build` 确认 TypeScript 与打包零错误；
  2. 若修改了界面，建议在桌面端与 `390px` 移动端视口检查无横向溢出与暗色模式对比度问题；
  3. 同步更新本 `AGENTS.md` 第 5 节的「已完成 / 下一阶段待开发」状态，以及 `README.md` 中的路线图勾选状态；
  4. 提交信息遵循 Conventional Commits（如 `feat: ...`、`fix: ...`、`docs: ...`、`content: ...`）。

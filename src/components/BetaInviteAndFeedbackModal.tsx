import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  MessageSquareHeart,
  Send,
  Share2,
  ShieldCheck,
  Star,
  X
} from 'lucide-react';
import {
  GITHUB_REPO,
  isCloudSyncConfigured,
  submitCloudFeedback,
  type BetaFeedbackPayload
} from '../lib/cloudSync';
import { QrCodeBox } from './QrCodeBox';

interface BetaInviteAndFeedbackModalProps {
  initialTab?: 'invite' | 'feedback';
  contextPageLabel: string;
  darkMode: boolean;
  onClose: () => void;
}

const CATEGORIES: { id: BetaFeedbackPayload['category']; label: string }[] = [
  { id: 'bug', label: '🐛 Bug 报错' },
  { id: 'grammar', label: '📖 语法纠错' },
  { id: 'feature', label: '💡 功能建议' },
  { id: 'praise', label: '👍 体验好评' }
];

export function BetaInviteAndFeedbackModal({
  initialTab = 'invite',
  contextPageLabel,
  darkMode,
  onClose
}: BetaInviteAndFeedbackModalProps) {
  const [tab, setTab] = useState<'invite' | 'feedback'>(initialTab);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Feedback form state
  const [category, setCategory] = useState<BetaFeedbackPayload['category']>('feature');
  const [rating, setRating] = useState<number>(5);
  const [testerName, setTesterName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : '';
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);

  const [customShareUrl, setCustomShareUrl] = useState('');
  const effectiveShareUrl = customShareUrl.trim() || currentUrl;

  const inviteText = useMemo(
    () =>
      `我在做一个清爽的日语语法自学小工具「言翼 Tsubasa」（PC / iPhone 都能用，主打零语法破冰 + 动词变形道场），想请你帮我内测体验一下！\n` +
      `体验地址：${effectiveShareUrl}\n` +
      `推荐测 3 分钟：① 读第 01 课试试振假名/色块/朗读 ② 去「变形道场」刷 5 题 ③ 点页面里的「内测/反馈」把吐槽或建议直接发给我，感谢！`,
    [effectiveShareUrl]
  );

  const deviceInfo = useMemo(() => {
    if (typeof window === 'undefined') return 'unknown';
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    return `${window.innerWidth}x${window.innerHeight} | ${darkMode ? 'Dark' : 'Light'} | ${
      isStandalone ? 'PWA' : 'Browser'
    }`;
  }, [darkMode]);

  const formattedFeedbackReport = useMemo(() => {
    const catLabel = CATEGORIES.find((c) => c.id === category)?.label ?? category;
    return [
      `【言翼 Tsubasa 内测反馈】`,
      `类型：${catLabel}`,
      `评分：${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)`,
      `测试者：${testerName.trim() || '朋友'}`,
      `所在页面：${contextPageLabel}`,
      `环境信息：${deviceInfo}`,
      `反馈内容：${message.trim() || '（未填写）'}`
    ].join('\n');
  }, [category, rating, testerName, contextPageLabel, deviceInfo, message]);

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteText);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const handleCopyFeedback = async () => {
    if (!message.trim()) {
      setFeedbackNotice({ ok: false, text: '请先填写一点反馈或吐槽内容再复制哦。' });
      return;
    }
    try {
      await navigator.clipboard.writeText(formattedFeedbackReport);
      setFeedbackNotice({
        ok: true,
        text: '已复制结构化反馈报告！直接粘贴到微信 / QQ 发给开发者即可。'
      });
    } catch {
      setFeedbackNotice({ ok: false, text: '复制失败，请手动选中文本复制。' });
    }
  };

  const handleCloudSubmit = async () => {
    if (!message.trim()) {
      setFeedbackNotice({ ok: false, text: '请先填写反馈内容再提交。' });
      return;
    }
    setSubmitting(true);
    const res = await submitCloudFeedback({
      category,
      rating,
      testerName: testerName.trim(),
      message: message.trim(),
      contextPage: contextPageLabel,
      deviceInfo
    });
    setSubmitting(false);
    if (res.ok) {
      setMessage('');
      setFeedbackNotice({ ok: true, text: '感谢反馈！已直接提交到开发者后台。' });
    } else {
      setFeedbackNotice({ ok: false, text: `提交失败（${res.error}），可改用一键复制发微信。` });
    }
  };

  const handleOpenGithubIssue = () => {
    if (!GITHUB_REPO) return;
    const catLabel = CATEGORIES.find((c) => c.id === category)?.label ?? category;
    const title = encodeURIComponent(`[Beta 反馈] ${catLabel} - ${contextPageLabel}`);
    const body = encodeURIComponent(formattedFeedbackReport);
    window.open(`https://github.com/${GITHUB_REPO}/issues/new?title=${title}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex rounded-xl bg-[var(--bg-subtle)] p-1 text-xs">
            <button
              type="button"
              onClick={() => setTab('invite')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                tab === 'invite'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>邀请朋友内测</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('feedback')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                tab === 'feedback'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <MessageSquareHeart className="w-3.5 h-3.5" />
              <span>提交内测反馈</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {tab === 'invite' ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-[var(--accent-matcha-soft)]/60 border border-[var(--accent-matcha)]/25 p-3.5 flex gap-2.5 text-xs leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-matcha)] shrink-0 mt-0.5" />
              <span>
                <strong>进度完全隔离：</strong>
                朋友打开链接后会在自己设备独立记录进度，不会污染或覆盖你的学习记录与错题本。
              </span>
            </div>

            {isLocalHost && (
              <div className="rounded-xl bg-[var(--accent-ochre-soft)] border border-[var(--accent-ochre)]/30 p-3 text-xs space-y-2">
                <p className="font-semibold text-[var(--accent-ochre)]">
                  提示：你当前在本地预览（localhost），发给外网朋友前请先推送到 GitHub Pages 上线，或在此粘贴你部署好的公开网址：
                </p>
                <input
                  type="url"
                  value={customShareUrl}
                  onChange={(e) => setCustomShareUrl(e.target.value)}
                  placeholder="例如：https://tsubasa.github.io/tsubasa-jp/"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent-indigo)]"
                />
              </div>
            )}

            <QrCodeBox
              value={effectiveShareUrl}
              size={168}
              caption="面对面扫码体验，或点击下方一键复制邀请文案发微信 / QQ"
            />

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 p-3.5 space-y-2">
              <div className="text-xs font-bold text-[var(--text-primary)]">
                给朋友的 4 步内测体验清单
              </div>
              <ol className="text-xs text-[var(--text-secondary)] space-y-1 list-decimal list-inside leading-relaxed">
                <li>打开「第 01 课」：体验振假名开关、四色语法色块、日语朗读与课后拼句题</li>
                <li>进入「变形道场」：用速选或罗马音拼写连刷 5 道题，感受错题推导提示</li>
                <li>切一次「深夜靛蓝」暗色模式，并在手机上试试横竖屏排版</li>
                <li>点右上角或侧栏「反馈」把真实吐槽发回来！</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={handleCopyInvite}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-indigo-btn)] text-white py-2.5 text-sm font-semibold hover:opacity-92 cursor-pointer"
            >
              {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedInvite ? '已复制邀请文案与网址！去微信粘贴吧' : '一键复制邀请文案 + 网址'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)]">反馈类型</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium text-left transition cursor-pointer ${
                      category === c.id
                        ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)] font-semibold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[var(--text-secondary)] block">整体体验打分</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 cursor-pointer"
                      aria-label={`${star} 星`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-[var(--border-subtle)]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-w-[150px] space-y-1">
                <label className="text-xs font-bold text-[var(--text-secondary)] block">
                  你的称呼（选填）
                </label>
                <input
                  type="text"
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  placeholder="比如：小明"
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent-indigo)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">
                具体感受 / 发现的问题
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="例如：第 02 课的例子很直观，但在 iPhone 上某按钮略小 / 某句语法讲解希望再多举一个例子..."
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-sm focus:outline-none focus:border-[var(--accent-indigo)]"
              />
              <div className="text-[11px] text-[var(--text-secondary)]">
                将自动附带上下文：{contextPageLabel} · {deviceInfo}
              </div>
            </div>

            <div className="space-y-2">
              {isCloudSyncConfigured() && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleCloudSubmit}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-indigo-btn)] text-white py-2.5 text-sm font-semibold hover:opacity-92 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? '提交中...' : '直接提交到开发者后台'}</span>
                </button>
              )}

              <div className={`grid gap-2 ${GITHUB_REPO ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <button
                  type="button"
                  onClick={handleCopyFeedback}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold cursor-pointer ${
                    isCloudSyncConfigured()
                      ? 'border border-[var(--border-subtle)] bg-[var(--bg-subtle)] hover:border-[var(--accent-indigo)]'
                      : 'bg-[var(--accent-indigo-btn)] text-white hover:opacity-92'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>一键复制反馈发微信 / QQ</span>
                </button>

                {GITHUB_REPO && (
                  <button
                    type="button"
                    onClick={handleOpenGithubIssue}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-2.5 text-xs font-semibold hover:border-[var(--accent-indigo)] cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>提交 GitHub Issue</span>
                  </button>
                )}
              </div>

              {feedbackNotice && (
                <p
                  className={`text-xs font-medium ${
                    feedbackNotice.ok
                      ? 'text-[var(--accent-matcha)]'
                      : 'text-[var(--accent-vermilion)]'
                  }`}
                >
                  {feedbackNotice.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

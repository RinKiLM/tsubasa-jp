import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  Link2,
  MessageSquareHeart,
  Moon,
  QrCode,
  Share2,
  Smartphone,
  Sun,
  Trash2,
  Upload,
  Volume2
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  buildMagicSyncUrl,
  exportSyncCode,
  importSyncCode,
  mergeProgress
} from '../lib/storage';
import type { UserProgress, UserSettings } from '../types/curriculum';
import { SpeakButton } from './SpeakButton';
import { QrCodeBox } from './QrCodeBox';
import { CloudSyncCard } from './CloudSyncCard';

interface ReviewAndSyncViewProps {
  progress: UserProgress;
  cloudUser: User | null;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string | null;
  onManualCloudSync: () => void;
  onRemoveMistake: (id: string) => void;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
  onReplaceProgress: (next: UserProgress) => void;
  onResetProgress: () => void;
  onOpenBetaModal: (tab: 'invite' | 'feedback') => void;
}

export function ReviewAndSyncView({
  progress,
  cloudUser,
  cloudSyncStatus,
  lastSyncedAt,
  onManualCloudSync,
  onRemoveMistake,
  onUpdateSettings,
  onReplaceProgress,
  onResetProgress,
  onOpenBetaModal
}: ReviewAndSyncViewProps) {
  const [filter, setFilter] = useState<'all' | 'lesson' | 'dojo'>('all');
  const [showQrSync, setShowQrSync] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [importText, setImportText] = useState('');
  const [syncMessage, setSyncMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const [customBaseUrl, setCustomBaseUrl] = useState('');

  const magicSyncUrl = buildMagicSyncUrl(progress, customBaseUrl || undefined);

  const visibleMistakes = progress.mistakes.filter((m) =>
    filter === 'all' ? true : m.source === filter
  );

  const handleCopyMagicLink = async () => {
    try {
      await navigator.clipboard.writeText(magicSyncUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      setSyncMessage({ ok: false, text: '自动复制失败，可直接使用二维码同步。' });
    }
  };

  const handleCopySyncCode = async () => {
    const code = exportSyncCode(progress);
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setImportText(code);
      setSyncMessage({ ok: true, text: '已将同步码填入下方输入框，请全选复制保存。' });
    }
  };

  const extractIncomingFromInput = (raw: string): UserProgress | null => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    // Allow pasting either a full magic URL (?sync=...) or a raw sync code
    if (trimmed.includes('sync=')) {
      try {
        const u = new URL(trimmed);
        const param = u.searchParams.get('sync');
        if (param) return importSyncCode(param);
      } catch {
        const match = trimmed.match(/sync=([^&#\s]+)/);
        if (match) return importSyncCode(match[1]);
      }
    }
    return importSyncCode(trimmed);
  };

  const handleImport = (mode: 'merge' | 'overwrite') => {
    const parsed = extractIncomingFromInput(importText);
    if (!parsed) {
      setSyncMessage({ ok: false, text: '未识别到有效同步码或同步链接，请确认已完整复制。' });
      return;
    }
    const next = mode === 'merge' ? mergeProgress(progress, parsed) : parsed;
    onReplaceProgress(next);
    setImportText('');
    setSyncMessage({
      ok: true,
      text:
        mode === 'merge'
          ? '智能合并成功！两端学过的课程、最高分与错题都已保留。'
          : '进度已完全覆盖导入！'
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Friend Beta Testing & Feedback Quick Entry */}
      <section className="rounded-2xl border border-[var(--accent-indigo)]/25 bg-[var(--accent-indigo-soft)]/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
            邀请朋友帮忙内测 / 收集体验反馈
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            一键生成分享二维码与微信邀请文案，朋友进度完全独立，支持结构化反馈回传。
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenBetaModal('invite')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-indigo-btn)] text-white px-3.5 py-2 text-xs font-semibold hover:opacity-92 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>邀请朋友</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenBetaModal('feedback')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-semibold hover:border-[var(--accent-indigo)] cursor-pointer"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-[var(--accent-vermilion)]" />
            <span>写反馈</span>
          </button>
        </div>
      </section>

      {/* Mistake Book Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold tracking-tight">错题复习本</h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              课后自测与变形道场答错的题目会自动收集于此，真正掌握后点右侧消掉。
            </p>
          </div>
          <div className="inline-flex rounded-xl bg-[var(--bg-subtle)] p-1 text-xs">
            {[
              { id: 'all', label: `全部 (${progress.mistakes.length})` },
              { id: 'lesson', label: '课后题' },
              { id: 'dojo', label: '变形道场' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as 'all' | 'lesson' | 'dojo')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {visibleMistakes.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[var(--accent-matcha)] mx-auto" />
            <div className="text-sm font-semibold">当前没有待消灭的错题</div>
            <p className="text-xs text-[var(--text-secondary)]">
              去「语法课本」做自测或去「变形道场」刷题，答错的内容会自动保存在这里供随时回顾。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleMistakes.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                      {m.title}
                    </span>
                    <p className="mt-1.5 text-sm font-semibold">{m.prompt}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <SpeakButton text={m.expected} rate={progress.settings.speechRate} />
                    <button
                      type="button"
                      onClick={() => onRemoveMistake(m.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--accent-matcha)]/40 bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)] text-xs font-medium hover:opacity-85 cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                      <span>已掌握</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-jp">
                  <span className="text-[var(--accent-vermilion)]">曾误选：{m.userAnswer}</span>
                  <span className="text-[var(--accent-matcha)] font-semibold">
                    正解：{m.expected}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {m.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cloud Auto Sync (Supabase) */}
      <CloudSyncCard
        cloudUser={cloudUser}
        syncStatus={cloudSyncStatus}
        lastSyncedAt={lastSyncedAt}
        onManualSync={onManualCloudSync}
      />

      {/* Zero-Config Magic QR & Link Sync */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <div>
          <h2 className="text-base font-bold">PC ↔ iPhone 零配置跨端同步（扫码 / 链接）</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            出门前用 iPhone 扫一下电脑屏幕二维码（或把链接发微信文件传输助手），打开即弹出「智能合并」，两端进度绝不丢失。
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowQrSync((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-indigo-btn)] text-white px-4 py-2 text-xs font-semibold cursor-pointer hover:opacity-92"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{showQrSync ? '收起同步二维码' : '生成手机扫码同步二维码'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMagicLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-2 text-xs font-semibold cursor-pointer hover:border-[var(--accent-indigo)]"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[var(--accent-matcha)]" /> : <Link2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? '已复制魔法同步链接！' : '复制魔法同步链接'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopySyncCode}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-3.5 py-2 text-xs font-medium cursor-pointer hover:border-[var(--accent-indigo)]"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-[var(--accent-matcha)]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? '已复制同步码' : '仅复制同步码'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const code = exportSyncCode(progress);
              const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'tsubasa-jp-backup.txt';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] px-3.5 py-2 text-xs font-medium cursor-pointer hover:border-[var(--accent-indigo)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下载备份</span>
          </button>
        </div>

        {showQrSync && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-4 space-y-3">
            {isLocalHost && (
              <div className="text-xs text-[var(--accent-ochre)] space-y-1.5">
                <p>
                  当前为本地地址，手机在 4G/5G 外网无法打开 localhost。若已上线 GitHub Pages，可填入你的上线网址生成外网可用二维码：
                </p>
                <input
                  type="url"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://你的用户名.github.io/tsubasa-jp/"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-primary)]"
                />
              </div>
            )}
            <QrCodeBox
              value={magicSyncUrl}
              size={188}
              caption="用 iPhone 相机扫码并在 Safari 打开，即可一键合并当前进度"
            />
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]/70">
          <label className="text-xs font-semibold text-[var(--text-secondary)] block">
            手动导入（支持粘贴魔法同步链接或纯同步码）
          </label>
          <textarea
            rows={2}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="在此粘贴另一台设备导出的同步链接或同步码..."
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3 text-xs font-mono focus:outline-none focus:border-[var(--accent-indigo)]"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!importText.trim()}
              onClick={() => handleImport('merge')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-indigo-btn)] text-white px-4 py-2 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>智能合并导入（推荐）</span>
            </button>
            <button
              type="button"
              disabled={!importText.trim()}
              onClick={() => handleImport('overwrite')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-3.5 py-2 text-xs font-medium disabled:opacity-40 cursor-pointer hover:border-[var(--accent-vermilion)]"
            >
              <span>完全覆盖导入</span>
            </button>
          </div>
          {syncMessage && (
            <p
              className={`text-xs font-medium ${
                syncMessage.ok ? 'text-[var(--accent-matcha)]' : 'text-[var(--accent-vermilion)]'
              }`}
            >
              {syncMessage.text}
            </p>
          )}
        </div>
      </section>

      {/* Preferences & iPhone Tips */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
        <h2 className="text-base font-bold">阅读偏好与 iPhone 离线安装提示</h2>

        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <button
            type="button"
            onClick={() => onUpdateSettings({ darkMode: !progress.settings.darkMode })}
            className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-4 py-3 cursor-pointer hover:border-[var(--accent-indigo)]"
          >
            <span className="inline-flex items-center gap-2 font-medium">
              {progress.settings.darkMode ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              外观主题
            </span>
            <span className="text-xs font-semibold text-[var(--accent-indigo)]">
              {progress.settings.darkMode ? '深夜靛蓝' : '和纸浅色'}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ speechRate: progress.settings.speechRate < 0.9 ? 0.95 : 0.75 })
            }
            className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] px-4 py-3 cursor-pointer hover:border-[var(--accent-indigo)]"
          >
            <span className="inline-flex items-center gap-2 font-medium">
              <Volume2 className="w-4 h-4" />
              朗读语速
            </span>
            <span className="text-xs font-semibold text-[var(--accent-indigo)]">
              {progress.settings.speechRate < 0.9 ? '0.75x 慢速清晰' : '1.0x 自然语速'}
            </span>
          </button>
        </div>

        <div className="rounded-xl bg-[var(--accent-indigo-soft)]/50 border border-[var(--accent-indigo)]/20 p-4 space-y-1.5 text-xs leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-[var(--accent-indigo)]">
            <Smartphone className="w-4 h-4" />
            <span>iPhone 出门随时学习设置（2 步搞定）</span>
          </div>
          <p>
            1. 在 iPhone Safari 打开上线后的 HTTPS 网址 → 点底部「分享」图标 → 选择<strong>「添加到主屏幕」</strong>，即可全屏像原生 App 一样使用，地铁没信号也能离线看课。
          </p>
          <p>
            2. 注意：iPhone 桌面 PWA 与 Safari 浏览器的本地存储互相独立，若开启了上方「云端账号同步」，在桌面 App 里登录一次即可永远自动同步；未开云同步时，直接在桌面 App 粘贴同步码即可。
          </p>
          <p>
            3. 若朗读没声音，请确认 iPhone 机身左侧<strong>物理静音开关</strong>未处于静音状态。
          </p>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-secondary)]">清空本设备的所有学习记录</span>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1 text-xs text-[var(--accent-vermilion)] hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>重置进度</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="px-3 py-1 rounded-lg bg-[var(--accent-vermilion)] text-white text-xs font-semibold cursor-pointer"
              >
                确认清空
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 rounded-lg border border-[var(--border-subtle)] text-xs cursor-pointer"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

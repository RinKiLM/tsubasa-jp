import { ArrowRightLeft, CheckCircle2, Sparkles, X } from 'lucide-react';
import { calculateStreakDays } from '../lib/storage';
import type { UserProgress } from '../types/curriculum';

interface SyncIncomingModalProps {
  local: UserProgress;
  incoming: UserProgress;
  onMerge: () => void;
  onOverwrite: () => void;
  onCancel: () => void;
}

export function SyncIncomingModal({
  local,
  incoming,
  onMerge,
  onOverwrite,
  onCancel
}: SyncIncomingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)] flex items-center justify-center shrink-0">
              <ArrowRightLeft className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold">发现跨设备学习进度</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                来自你刚扫描的二维码或打开的魔法同步链接
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="关闭"
            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 p-3 space-y-1">
            <div className="font-semibold text-[var(--text-secondary)]">当前设备进度</div>
            <div>已完成：{local.completedLessons.length} 课</div>
            <div>道场刷题：{local.dojoTotalAnswered} 题</div>
            <div>连续学习：{calculateStreakDays(local.studyDates)} 天</div>
          </div>
          <div className="rounded-xl border border-[var(--accent-indigo)]/40 bg-[var(--accent-indigo-soft)]/50 p-3 space-y-1">
            <div className="font-semibold text-[var(--accent-indigo)]">待导入进度</div>
            <div>已完成：{incoming.completedLessons.length} 课</div>
            <div>道场刷题：{incoming.dojoTotalAnswered} 题</div>
            <div>连续学习：{calculateStreakDays(incoming.studyDates)} 天</div>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--accent-matcha-soft)]/70 p-3 text-xs text-[var(--text-primary)] flex gap-2 leading-relaxed">
          <Sparkles className="w-4 h-4 text-[var(--accent-matcha)] shrink-0 mt-0.5" />
          <span>
            推荐使用<strong>智能合并</strong>：两端学过的课程、最高分、错题和打卡天数都会保留，不会覆盖彼此！
          </span>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onMerge}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-indigo-btn)] text-white py-2.5 text-sm font-semibold hover:opacity-92 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>智能合并两端进度（推荐）</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOverwrite}
              className="rounded-xl border border-[var(--border-subtle)] py-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--accent-vermilion)] hover:text-[var(--accent-vermilion)] cursor-pointer"
            >
              完全覆盖本设备
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[var(--border-subtle)] py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
            >
              暂不导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

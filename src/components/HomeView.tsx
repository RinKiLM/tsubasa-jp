import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Swords,
  AlertCircle,
  Sparkles,
  Compass
} from 'lucide-react';
import { ALL_LESSONS, ROADMAP_STAGES } from '../data/curriculum';
import { calculateStreakDays } from '../lib/storage';
import type { UserProgress } from '../types/curriculum';

interface HomeViewProps {
  progress: UserProgress;
  onOpenLesson: (lessonId: string) => void;
  onNavigate: (tab: 'lessons' | 'dojo' | 'review') => void;
}

export function HomeView({ progress, onOpenLesson, onNavigate }: HomeViewProps) {
  const totalLessons = ALL_LESSONS.length;
  const completedCount = progress.completedLessons.filter((id) =>
    ALL_LESSONS.some((l) => l.id === id)
  ).length;
  const completionPct = Math.round((completedCount / totalLessons) * 100);
  const streakDays = calculateStreakDays(progress.studyDates);
  const dojoAccuracy =
    progress.dojoTotalAnswered > 0
      ? Math.round((progress.dojoTotalCorrect / progress.dojoTotalAnswered) * 100)
      : 0;

  const nextLesson =
    ALL_LESSONS.find((l) => !progress.completedLessons.includes(l.id)) ?? ALL_LESSONS[0];

  return (
    <div className="space-y-6">
      {/* Hero Progress Banner */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-indigo-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-indigo)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stage 0 · 语法破冰骨架进行中</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              把零散语感，组装成清晰的日语语法体系
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
              面向已掌握五十音的中文母语者：跳过枯燥死背，用结构拆解、动词变形道场与双轨例句，从零语法稳步走向日本自由行与 JLPT N1。
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenLesson(nextLesson.id)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-indigo-btn)] px-5 py-3 text-sm font-semibold text-white hover:opacity-92 active:scale-[0.99] transition cursor-pointer shrink-0 shadow-xs"
          >
            <span>
              {completedCount === 0
                ? '开始第 01 课'
                : completedCount === totalLessons
                ? '复习 Stage 0'
                : `继续第 ${nextLesson.number} 课`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-[var(--text-secondary)]">
              Stage 0 完成进度（{completedCount} / {totalLessons} 课）
            </span>
            <span className="font-bold text-[var(--accent-indigo)]">{completionPct}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[var(--bg-subtle)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent-indigo)] transition-all duration-500"
              style={{ width: `${Math.max(completionPct, completedCount > 0 ? 6 : 0)}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs text-[var(--text-secondary)]">
            下一节推荐：<span className="font-medium text-[var(--text-primary)]">第 {nextLesson.number} 课 · {nextLesson.title}</span>
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 sm:p-4">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[var(--text-secondary)] whitespace-nowrap">
            <Flame className="w-3.5 h-3.5 text-[var(--accent-vermilion)] shrink-0" />
            <span>连续学习</span>
          </div>
          <div className="mt-1.5 text-lg sm:text-2xl font-bold whitespace-nowrap">
            {streakDays}
            <span className="text-[11px] sm:text-xs font-normal text-[var(--text-secondary)] ml-1">天</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 sm:p-4">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[var(--text-secondary)] whitespace-nowrap">
            <Swords className="w-3.5 h-3.5 text-[var(--accent-matcha)] shrink-0" />
            <span>道场正确率</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold">
              {progress.dojoTotalAnswered > 0 ? `${dojoAccuracy}%` : '--'}
            </span>
            <span className="text-[11px] sm:text-xs font-normal text-[var(--text-secondary)]">
              {progress.dojoTotalAnswered > 0 ? `${progress.dojoTotalAnswered}题` : '待开启'}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 sm:p-4">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[var(--text-secondary)] whitespace-nowrap">
            <AlertCircle className="w-3.5 h-3.5 text-[var(--accent-ochre)] shrink-0" />
            <span>待消错题</span>
          </div>
          <div className="mt-1.5 text-lg sm:text-2xl font-bold whitespace-nowrap">
            {progress.mistakes.length}
            <span className="text-[11px] sm:text-xs font-normal text-[var(--text-secondary)] ml-1">条</span>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="grid sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('lessons')}
          className="group text-left rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 hover:border-[var(--accent-indigo)] transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
          </div>
          <h2 className="mt-3.5 text-base font-bold">Stage 0 语法课本</h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            8 节结构化破冰课：语序、は/が本质、7 大格助词、形容词、动词分类、礼貌/普通体、て形音便与长句定语。
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('dojo')}
          className="group text-left rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 hover:border-[var(--accent-matcha)] transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)] flex items-center justify-center">
              <Swords className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:translate-x-1 transition-transform" />
          </div>
          <h2 className="mt-3.5 text-base font-bold">动词 & 形容词变形道场</h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            内置 44 个高频核心词与“伪一段/いい/きれい”陷阱词，支持单手速选或罗马音拼写，每天 3 分钟练成肌肉记忆。
          </p>
        </button>
      </section>

      {/* Long-term Roadmap */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-[var(--accent-indigo)]" />
          <h2 className="text-base font-bold">从零语法到 N1 + 自由行的完整路线</h2>
        </div>
        <div className="space-y-3">
          {ROADMAP_STAGES.map((item) => {
            const isActive = item.status === 'active';
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 ${
                  isActive
                    ? 'border-[var(--accent-indigo)]/40 bg-[var(--accent-indigo-soft)]/50'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 opacity-85'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-[var(--accent-indigo)] text-white'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {item.stage}
                    </span>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)] inline-flex items-center gap-1">
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-matcha)]" />}
                    {item.level}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.summary}
                </p>
                <p className="mt-1 text-xs font-medium text-[var(--text-primary)]">
                  目标效果：{item.milestone}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

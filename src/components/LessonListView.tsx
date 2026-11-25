import { CheckCircle2, Clock, ChevronRight, Award } from 'lucide-react';
import { ALL_LESSONS } from '../data/curriculum';
import type { UserProgress } from '../types/curriculum';

interface LessonListViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

export function LessonListView({ progress, onSelectLesson }: LessonListViewProps) {
  const completedCount = progress.completedLessons.filter((id) =>
    ALL_LESSONS.some((l) => l.id === id)
  ).length;

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Stage 0 · 日语语法破冰骨架</h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]">
            已完成 {completedCount} / {ALL_LESSONS.length}
          </span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          建议按顺序每天精读 1 课 + 完成课后自测，并在学完第 5–7 课后配合「变形道场」刷成肌肉记忆。
        </p>
      </header>

      <div className="space-y-3">
        {ALL_LESSONS.map((lesson) => {
          const isCompleted = progress.completedLessons.includes(lesson.id);
          const bestScore = progress.quizBestScores[lesson.id];

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onSelectLesson(lesson.id)}
              className="w-full text-left group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 hover:border-[var(--accent-indigo)] transition shadow-2xs cursor-pointer"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isCompleted
                      ? 'bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)]'
                      : 'bg-[var(--bg-subtle)] text-[var(--accent-indigo)]'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : lesson.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-bold group-hover:text-[var(--accent-indigo)] transition-colors">
                      第 {lesson.number} 课 · {lesson.title}
                    </h2>
                    <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2">
                    {lesson.subtitle}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-[var(--text-secondary)]">
                      <Clock className="w-3.5 h-3.5" />
                      约 {lesson.estimatedMinutes} 分钟
                    </span>
                    {bestScore !== undefined && (
                      <span className="inline-flex items-center gap-1 text-[var(--accent-matcha)] font-medium">
                        <Award className="w-3.5 h-3.5" />
                        自测最高 {bestScore}%
                      </span>
                    )}
                    {lesson.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

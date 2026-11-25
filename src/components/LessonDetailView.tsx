import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  Palette,
  RotateCcw,
  XCircle
} from 'lucide-react';
import { ALL_LESSONS } from '../data/curriculum';
import {
  tokensToPlainJapanese,
  type Lesson,
  type MistakeRecord,
  type QuizQuestion,
  type UserSettings
} from '../types/curriculum';
import { RoleLegend, RubyText } from './RubyText';
import { SpeakButton } from './SpeakButton';

interface LessonDetailViewProps {
  lesson: Lesson;
  isCompleted: boolean;
  settings: UserSettings;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onCompleteLesson: (lessonId: string, quizScorePct?: number) => void;
  onRecordMistake: (mistake: Omit<MistakeRecord, 'timestamp'>) => void;
}

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[var(--text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function LessonDetailView({
  lesson,
  isCompleted,
  settings,
  onUpdateSettings,
  onBack,
  onSelectLesson,
  onCompleteLesson,
  onRecordMistake
}: LessonDetailViewProps) {
  const [trackFilter, setTrackFilter] = useState<'all' | 'practical' | 'jlpt'>('all');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTrackFilter('all');
    setRevealedIds({});
    setQuizAnswers({});
    setQuizChecked({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  const currentIdx = ALL_LESSONS.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIdx > 0 ? ALL_LESSONS[currentIdx - 1] : null;
  const nextLesson = currentIdx < ALL_LESSONS.length - 1 ? ALL_LESSONS[currentIdx + 1] : null;

  const filteredExamples = lesson.examples.filter((ex) =>
    trackFilter === 'all' ? true : ex.track === trackFilter
  );

  const checkQuiz = (q: QuizQuestion, chosen: string | string[]) => {
    setQuizAnswers((prev) => ({ ...prev, [q.id]: chosen }));
    setQuizChecked((prev) => {
      const nextChecked = { ...prev, [q.id]: true };
      const isRight = Array.isArray(q.answer)
        ? Array.isArray(chosen) && chosen.join('') === q.answer.join('')
        : chosen === q.answer;

      if (!isRight) {
        onRecordMistake({
          id: `lesson-${q.id}`,
          source: 'lesson',
          title: `第 ${lesson.number} 课 · ${lesson.title}`,
          prompt: q.prompt,
          expected: Array.isArray(q.answer) ? q.answer.join(' ') : q.answer,
          userAnswer: Array.isArray(chosen) ? chosen.join(' ') : chosen,
          explanation: q.explanation
        });
      }

      // Compute score if all questions answered
      const allAnswered = lesson.quizzes.every((item) => nextChecked[item.id]);
      if (allAnswered) {
        const correctCount = lesson.quizzes.reduce((acc, item) => {
          const val = item.id === q.id ? chosen : quizAnswers[item.id];
          const ok = Array.isArray(item.answer)
            ? Array.isArray(val) && val.join('') === item.answer.join('')
            : val === item.answer;
          return acc + (ok ? 1 : 0);
        }, 0);
        const pct = Math.round((correctCount / lesson.quizzes.length) * 100);
        onCompleteLesson(lesson.id, pct);
      }
      return nextChecked;
    });
  };

  const toggleOrderToken = (q: QuizQuestion, token: string) => {
    if (quizChecked[q.id]) return;
    const current = (quizAnswers[q.id] as string[] | undefined) ?? [];
    if (current.includes(token)) {
      setQuizAnswers((prev) => ({
        ...prev,
        [q.id]: current.filter((t) => t !== token)
      }));
    } else {
      setQuizAnswers((prev) => ({
        ...prev,
        [q.id]: [...current, token]
      }));
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Sticky Reader Control Bar */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-2.5 bg-[var(--bg-canvas)]/92 backdrop-blur-md border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>目录</span>
        </button>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onUpdateSettings({ showFurigana: !settings.showFurigana })}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
              settings.showFurigana
                ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            振假名 {settings.showFurigana ? '开' : '关'}
          </button>
          <button
            type="button"
            onClick={() => onUpdateSettings({ highlightRoles: !settings.highlightRoles })}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
              settings.highlightRoles
                ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>色块</span>
          </button>
          <button
            type="button"
            onClick={() => onUpdateSettings({ showTranslation: !settings.showTranslation })}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
              settings.showTranslation
                ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            {settings.showTranslation ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span>译文</span>
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ speechRate: settings.speechRate < 0.9 ? 0.98 : 0.75 })
            }
            className="px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            {settings.speechRate < 0.9 ? '0.75x 慢速' : '1.0x 常速'}
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-indigo)] text-white font-semibold">
            {lesson.stage} · 第 {lesson.number} 课
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              已学完
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
          {lesson.title}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">{lesson.subtitle}</p>

        {/* Core Insight Card */}
        <div className="rounded-2xl border border-[var(--accent-indigo)]/25 bg-[var(--accent-indigo-soft)]/60 p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-[var(--accent-indigo)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--accent-indigo)] uppercase tracking-wider">
              一句话打通底层逻辑
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              {lesson.coreInsight}
            </p>
          </div>
        </div>
      </header>

      {/* Structured Sections */}
      <div className="space-y-4">
        {lesson.sections.map((section, idx) => (
          <section
            key={idx}
            className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3.5"
          >
            <h2 className="text-base sm:text-lg font-bold">{section.heading}</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {section.summary}
            </p>

            {section.formula && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {section.formula.map((block, bIdx) => (
                  <div
                    key={bIdx}
                    className={`rounded-xl px-3 py-2 border border-[var(--border-subtle)] ${
                      block.role === 'plain' ? 'bg-[var(--bg-subtle)]' : `role-${block.role}`
                    }`}
                  >
                    <div className="text-[11px] opacity-80">{block.label}</div>
                    <div className="font-jp font-bold text-sm sm:text-base mt-0.5">{block.jp}</div>
                  </div>
                ))}
              </div>
            )}

            <ul className="space-y-2 text-sm leading-relaxed">
              {section.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex gap-2.5 whitespace-pre-line">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-indigo)] mt-2 shrink-0" />
                  <span>{renderInlineBold(pt)}</span>
                </li>
              ))}
            </ul>

            {section.table && (
              <div className="overflow-x-auto -mx-1 px-1 pt-1">
                <table className="w-full text-xs sm:text-sm border-collapse min-w-[460px]">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70">
                      {section.table.headers.map((h, hIdx) => (
                        <th key={hIdx} className="text-left py-2.5 px-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="border-b border-[var(--border-subtle)]/70 last:border-b-0"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-2.5 px-3 ${cIdx === 0 ? 'font-semibold' : 'font-jp'}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Chinese Learner Pitfall Callout */}
      <section className="rounded-2xl border border-[var(--accent-vermilion)]/30 bg-[var(--accent-vermilion-soft)]/60 p-5 space-y-2.5">
        <div className="flex items-center gap-2 text-[var(--accent-vermilion)] font-bold text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{lesson.pitfall.title}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm font-jp">
          <div className="rounded-xl bg-[var(--bg-surface)]/80 px-3 py-2 border border-[var(--accent-vermilion)]/25">
            <span className="text-xs font-sans font-semibold text-[var(--accent-vermilion)] block mb-0.5">
              ❌ 常见误用
            </span>
            {lesson.pitfall.wrong}
          </div>
          <div className="rounded-xl bg-[var(--bg-surface)]/80 px-3 py-2 border border-[var(--accent-matcha)]/30">
            <span className="text-xs font-sans font-semibold text-[var(--accent-matcha)] block mb-0.5">
              ✅ 地道表达
            </span>
            {lesson.pitfall.right}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
          {renderInlineBold(lesson.pitfall.reason)}
        </p>
      </section>

      {/* Dual-Track Interactive Examples */}
      <section className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold">双轨实战例句</h2>
          <div className="inline-flex rounded-xl bg-[var(--bg-subtle)] p-1 text-xs">
            {[
              { id: 'all', label: '全部' },
              { id: 'practical', label: '日常 / 旅行' },
              { id: 'jlpt', label: 'JLPT 规范' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTrackFilter(tab.id as 'all' | 'practical' | 'jlpt')}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  trackFilter === tab.id
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {settings.highlightRoles && <RoleLegend />}

        <div className="space-y-3">
          {filteredExamples.map((ex) => {
            const plainJp = tokensToPlainJapanese(ex.tokens);
            const showTrans = settings.showTranslation || revealedIds[ex.id];
            return (
              <div
                key={ex.id}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      ex.track === 'practical'
                        ? 'bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)]'
                        : 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                    }`}
                  >
                    {ex.contextTag}
                  </span>
                  <SpeakButton text={plainJp} rate={settings.speechRate} label="朗读" />
                </div>

                <div className="text-base sm:text-lg">
                  <RubyText
                    tokens={ex.tokens}
                    showFurigana={settings.showFurigana}
                    highlightRoles={settings.highlightRoles}
                  />
                </div>

                {showTrans ? (
                  <div className="pt-2 border-t border-[var(--border-subtle)]/70 space-y-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {ex.translation}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      拆解：{ex.breakdown}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRevealedIds((p) => ({ ...p, [ex.id]: true }))}
                    className="text-xs text-[var(--accent-indigo)] hover:underline cursor-pointer"
                  >
                    点击查看中文翻译与结构拆解
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Lesson Quizzes */}
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">课后即时自测（{lesson.quizzes.length} 题）</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              完成全部自测将自动标记本课完成，错题会自动收入错题本。
            </p>
          </div>
          {!isCompleted && (
            <button
              type="button"
              onClick={() => onCompleteLesson(lesson.id)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent-matcha)] hover:text-[var(--accent-matcha)] cursor-pointer"
            >
              直接标记已读
            </button>
          )}
        </div>

        <div className="space-y-6">
          {lesson.quizzes.map((q, qIdx) => {
            const checked = quizChecked[q.id];
            const chosen = quizAnswers[q.id];
            const isCorrect = checked
              ? Array.isArray(q.answer)
                ? Array.isArray(chosen) && chosen.join('') === q.answer.join('')
                : chosen === q.answer
              : false;

            return (
              <div
                key={q.id}
                className="pt-4 first:pt-0 border-t first:border-t-0 border-[var(--border-subtle)] space-y-3"
              >
                <div className="text-sm font-semibold">
                  <span className="text-[var(--accent-indigo)] mr-1.5">Q{qIdx + 1}.</span>
                  {q.prompt}
                </div>

                {q.sentence && (
                  <div className="rounded-xl bg-[var(--bg-subtle)]/70 px-4 py-2.5 text-base">
                    <RubyText
                      tokens={q.sentence}
                      showFurigana={settings.showFurigana}
                      highlightRoles={false}
                    />
                  </div>
                )}

                {q.type === 'choice' ? (
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt) => {
                      const selected = chosen === opt;
                      const isAns = opt === q.answer;
                      let btnStyle =
                        'border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-indigo)]';
                      if (checked) {
                        if (isAns) {
                          btnStyle =
                            'border-[var(--accent-matcha)] bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)] font-semibold';
                        } else if (selected && !isAns) {
                          btnStyle =
                            'border-[var(--accent-vermilion)] bg-[var(--accent-vermilion-soft)] text-[var(--accent-vermilion)]';
                        } else {
                          btnStyle = 'border-[var(--border-subtle)] opacity-60';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={checked}
                          onClick={() => checkQuiz(q, opt)}
                          className={`text-left px-3.5 py-2.5 rounded-xl border text-sm font-jp transition cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Sentence Order Builder */
                  <div className="space-y-3">
                    <div className="min-h-[48px] rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 p-2.5 flex flex-wrap gap-2 items-center">
                      {((chosen as string[] | undefined) ?? []).length === 0 ? (
                        <span className="text-xs text-[var(--text-secondary)]">
                          依次点击下方词块拼出完整日语句子...
                        </span>
                      ) : (
                        ((chosen as string[]) ?? []).map((tok) => (
                          <button
                            key={tok}
                            type="button"
                            disabled={checked}
                            onClick={() => toggleOrderToken(q, tok)}
                            className="px-3 py-1.5 rounded-lg bg-[var(--accent-indigo)] text-white text-sm font-jp font-medium cursor-pointer disabled:cursor-default"
                          >
                            {tok}
                          </button>
                        ))
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {q.options.map((tok) => {
                        const used = ((chosen as string[] | undefined) ?? []).includes(tok);
                        return (
                          <button
                            key={tok}
                            type="button"
                            disabled={checked || used}
                            onClick={() => toggleOrderToken(q, tok)}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-jp transition cursor-pointer ${
                              used
                                ? 'border-[var(--border-subtle)] opacity-30 cursor-default'
                                : 'border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-indigo)]'
                            }`}
                          >
                            {tok}
                          </button>
                        );
                      })}
                    </div>

                    {!checked && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={((chosen as string[] | undefined) ?? []).length !== q.options.length}
                          onClick={() => checkQuiz(q, (chosen as string[]) ?? [])}
                          className="px-4 py-1.5 rounded-lg bg-[var(--accent-indigo-btn)] text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
                        >
                          提交语序
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuizAnswers((p) => ({ ...p, [q.id]: [] }))}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          重置
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {checked && (
                  <div
                    className={`rounded-xl p-3 text-xs sm:text-sm flex gap-2.5 ${
                      isCorrect
                        ? 'bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)]'
                        : 'bg-[var(--accent-vermilion-soft)] text-[var(--accent-vermilion)]'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-bold">
                        {isCorrect
                          ? '回答正确！'
                          : `正确答案：${Array.isArray(q.answer) ? q.answer.join(' ') : q.answer}`}
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Prev / Next Lesson Footer */}
      <footer className="flex items-center justify-between gap-3 pt-2">
        {prevLesson ? (
          <button
            type="button"
            onClick={() => onSelectLesson(prevLesson.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent-indigo)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>第 {prevLesson.number} 课</span>
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            type="button"
            onClick={() => onSelectLesson(nextLesson.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-indigo-btn)] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-92 cursor-pointer"
          >
            <span>下一课：第 {nextLesson.number} 课</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-matcha)] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-92 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Stage 0 全部完成，返回目录</span>
          </button>
        )}
      </footer>
    </div>
  );
}

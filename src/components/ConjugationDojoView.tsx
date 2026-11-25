import { useCallback, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Keyboard,
  MousePointerClick,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  XCircle
} from 'lucide-react';
import {
  CONJUGATION_FORMS,
  DOJO_WORDS,
  conjugateWord,
  normalizeUserInputToHiragana,
  type ConjugationFormId,
  type DojoWord,
  type WordCategory
} from '../lib/conjugation';
import type { MistakeRecord, UserProgress } from '../types/curriculum';
import { SpeakButton } from './SpeakButton';

interface ConjugationDojoViewProps {
  progress: UserProgress;
  onRecordDojoAttempt: (correct: boolean, currentStreak: number) => void;
  onRecordMistake: (mistake: Omit<MistakeRecord, 'timestamp'>) => void;
}

const CATEGORY_OPTIONS: { id: WordCategory; label: string }[] = [
  { id: 'godan', label: '五段动词' },
  { id: 'ichidan', label: '一段动词' },
  { id: 'irregular', label: '不规则动词' },
  { id: 'i-adj', label: 'い形容词' },
  { id: 'na-adj', label: 'な形容词' }
];

interface DrillItem {
  word: DojoWord;
  formId: ConjugationFormId;
  choices: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ConjugationDojoView({
  progress,
  onRecordDojoAttempt,
  onRecordMistake
}: ConjugationDojoViewProps) {
  const [mode, setMode] = useState<'choice' | 'typing'>('choice');
  const [showFilters, setShowFilters] = useState(false);
  const [trickyOnly, setTrickyOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<WordCategory[]>([
    'godan',
    'ichidan',
    'irregular',
    'i-adj',
    'na-adj'
  ]);
  const [selectedForms, setSelectedForms] = useState<ConjugationFormId[]>([
    'masu',
    'nai',
    'te',
    'ta'
  ]);

  const [streak, setStreak] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  const [typingInput, setTypingInput] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const validPairs = useMemo(() => {
    const words = DOJO_WORDS.filter(
      (w) => selectedCategories.includes(w.category) && (!trickyOnly || w.tricky)
    );
    const pairs: { word: DojoWord; formId: ConjugationFormId }[] = [];
    for (const w of words) {
      for (const fId of selectedForms) {
        const meta = CONJUGATION_FORMS.find((f) => f.id === fId);
        if (meta && meta.appliesTo.includes(w.category)) {
          pairs.push({ word: w, formId: fId });
        }
      }
    }
    return pairs;
  }, [selectedCategories, selectedForms, trickyOnly]);

  const buildDrill = useCallback(
    (excludeKey?: string): DrillItem | null => {
      if (!validPairs.length) return null;
      const pool =
        validPairs.length > 1 && excludeKey
          ? validPairs.filter((p) => `${p.word.id}-${p.formId}` !== excludeKey)
          : validPairs;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const res = conjugateWord(picked.word, picked.formId);
      const choices = shuffle([res.readingForm, ...res.distractors]);
      return {
        word: picked.word,
        formId: picked.formId,
        choices
      };
    },
    [validPairs]
  );

  const [currentDrill, setCurrentDrill] = useState<DrillItem | null>(() => buildDrill());

  // Keep drill synced if filters invalidate current drill
  const activeDrill = useMemo(() => {
    if (!validPairs.length) return null;
    if (
      currentDrill &&
      validPairs.some(
        (p) => p.word.id === currentDrill.word.id && p.formId === currentDrill.formId
      )
    ) {
      return currentDrill;
    }
    return buildDrill();
  }, [currentDrill, validPairs, buildDrill]);

  const activeResult = activeDrill ? conjugateWord(activeDrill.word, activeDrill.formId) : null;
  const activeFormMeta = activeDrill
    ? CONJUGATION_FORMS.find((f) => f.id === activeDrill.formId)
    : null;

  const nextQuestion = () => {
    const excludeKey = activeDrill ? `${activeDrill.word.id}-${activeDrill.formId}` : undefined;
    setCurrentDrill(buildDrill(excludeKey));
    setTypingInput('');
    setSubmittedAnswer(null);
    setIsCorrect(null);
  };

  const evaluateAnswer = (rawAnswer: string) => {
    if (!activeDrill || !activeResult || !activeFormMeta || submittedAnswer !== null) return;
    const normalized = normalizeUserInputToHiragana(rawAnswer);
    if (!normalized) return;

    const ok =
      normalized === activeResult.readingForm ||
      rawAnswer.trim() === activeResult.kanjiForm;

    const nextStreak = ok ? streak + 1 : 0;
    setSubmittedAnswer(rawAnswer.trim());
    setIsCorrect(ok);
    setStreak(nextStreak);
    setSessionAnswered((n) => n + 1);
    if (ok) setSessionCorrect((n) => n + 1);
    onRecordDojoAttempt(ok, nextStreak);

    if (!ok) {
      onRecordMistake({
        id: `dojo-${activeDrill.word.id}-${activeDrill.formId}`,
        source: 'dojo',
        title: `变形道场 · ${activeDrill.word.kanji}（${activeDrill.word.meaning}）`,
        prompt: `将 ${activeDrill.word.kanji}（${activeDrill.word.reading}）变为【${activeFormMeta.shortLabel}】`,
        expected: `${activeResult.kanjiForm}（${activeResult.readingForm}）`,
        userAnswer: normalized,
        explanation: activeResult.ruleSteps
      });
    }
  };

  const toggleCategory = (cat: WordCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.length > 1
          ? prev.filter((c) => c !== cat)
          : prev
        : [...prev, cat]
    );
    setSubmittedAnswer(null);
    setIsCorrect(null);
  };

  const toggleForm = (fId: ConjugationFormId) => {
    setSelectedForms((prev) =>
      prev.includes(fId)
        ? prev.length > 1
          ? prev.filter((f) => f !== fId)
          : prev
        : [...prev, fId]
    );
    setSubmittedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="space-y-5">
      {/* Header & Mode Switch */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">动词 & 形容词变形道场</h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            把变形规律刷成条件反射，通勤路上每天 3 分钟见效。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-[var(--bg-subtle)] p-1 text-xs">
            <button
              type="button"
              onClick={() => setMode('choice')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                mode === 'choice'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>速选</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('typing')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                mode === 'typing'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>拼写</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition ${
              showFilters
                ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>题库范围</span>
          </button>
        </div>
      </header>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-secondary)]">词类范围</span>
              <button
                type="button"
                onClick={() => {
                  setTrickyOnly((v) => !v);
                  setSubmittedAnswer(null);
                  setIsCorrect(null);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                  trickyOnly
                    ? 'border-[var(--accent-vermilion)] bg-[var(--accent-vermilion-soft)] text-[var(--accent-vermilion)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>只刷陷阱特例词（帰る / 行く / いい / きれい 等）</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[var(--text-secondary)]">练习形态</span>
            <div className="flex flex-wrap gap-2">
              {CONJUGATION_FORMS.map((f) => {
                const active = selectedForms.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleForm(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'border-[var(--accent-matcha)] bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)]'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {f.shortLabel}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            当前组合共有 <span className="font-bold text-[var(--text-primary)]">{validPairs.length}</span> 道变化题池。
          </p>
        </section>
      )}

      {/* Session Stats Strip */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent-vermilion)]">
            <Flame className="w-3.5 h-3.5" />
            当前连击 {streak}
          </span>
          <span className="text-[var(--text-secondary)]">
            最高连击 {Math.max(progress.dojoBestStreak, streak)}
          </span>
        </div>
        <span className="text-[var(--text-secondary)]">
          本次 {sessionCorrect} / {sessionAnswered} 正确
        </span>
      </div>

      {/* Main Drill Card */}
      {activeDrill && activeResult && activeFormMeta ? (
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-xs space-y-6">
          {/* Prompt Top */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                {activeDrill.word.categoryLabel}
              </span>
              {activeDrill.word.tricky && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-ochre-soft)] text-[var(--accent-ochre)]">
                  高频陷阱词
                </span>
              )}
            </div>
            <SpeakButton
              text={activeDrill.word.kanji}
              rate={progress.settings.speechRate}
              label="听原形"
            />
          </div>

          {/* Center Word & Target Form */}
          <div className="text-center space-y-2 py-2">
            <div className="font-jp text-3xl sm:text-4xl font-bold tracking-wider">
              {progress.settings.showFurigana && activeDrill.word.kanji !== activeDrill.word.reading ? (
                <ruby>
                  {activeDrill.word.kanji}
                  <rt>{activeDrill.word.reading}</rt>
                </ruby>
              ) : (
                activeDrill.word.kanji
              )}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              {activeDrill.word.meaning}
              {!progress.settings.showFurigana && activeDrill.word.kanji !== activeDrill.word.reading
                ? `（${activeDrill.word.reading}）`
                : ''}
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-indigo-soft)] px-4 py-2 text-sm font-bold text-[var(--accent-indigo)]">
                <span>请变形为：{activeFormMeta.label}</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{activeFormMeta.description}</p>
          </div>

          {/* Answer Input Area */}
          {mode === 'choice' ? (
            <div className="grid grid-cols-2 gap-3">
              {activeDrill.choices.map((opt) => {
                const isAns = opt === activeResult.readingForm;
                const isPicked = submittedAnswer === opt;
                let style =
                  'border-[var(--border-subtle)] bg-[var(--bg-canvas)] hover:border-[var(--accent-indigo)]';
                if (submittedAnswer !== null) {
                  if (isAns) {
                    style =
                      'border-[var(--accent-matcha)] bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)] font-bold';
                  } else if (isPicked && !isAns) {
                    style =
                      'border-[var(--accent-vermilion)] bg-[var(--accent-vermilion-soft)] text-[var(--accent-vermilion)]';
                  } else {
                    style = 'border-[var(--border-subtle)] opacity-45';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={submittedAnswer !== null}
                    onClick={() => evaluateAnswer(opt)}
                    className={`rounded-xl border py-3.5 px-3 text-base sm:text-lg font-jp transition cursor-pointer disabled:cursor-default ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (submittedAnswer !== null) {
                  nextQuestion();
                } else {
                  evaluateAnswer(typingInput);
                }
              }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typingInput}
                  disabled={submittedAnswer !== null}
                  onChange={(e) => setTypingInput(e.target.value)}
                  placeholder="输入平假名或罗马音（如 katte / たべて）..."
                  className="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-4 py-3 text-base font-jp focus:outline-none focus:border-[var(--accent-indigo)]"
                />
                {submittedAnswer === null && (
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[var(--accent-indigo-btn)] text-white text-sm font-semibold cursor-pointer shrink-0"
                  >
                    确认
                  </button>
                )}
              </div>
              {typingInput && submittedAnswer === null && (
                <div className="text-xs text-[var(--text-secondary)]">
                  识别假名预览：
                  <span className="font-jp font-semibold text-[var(--text-primary)] ml-1">
                    {normalizeUserInputToHiragana(typingInput)}
                  </span>
                </div>
              )}
            </form>
          )}

          {/* Feedback Panel */}
          {submittedAnswer !== null && (
            <div
              className={`rounded-2xl p-4 space-y-3 ${
                isCorrect
                  ? 'bg-[var(--accent-matcha-soft)] border border-[var(--accent-matcha)]/30'
                  : 'bg-[var(--accent-vermilion-soft)] border border-[var(--accent-vermilion)]/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`flex items-center gap-2 font-bold text-sm sm:text-base ${
                    isCorrect ? 'text-[var(--accent-matcha)]' : 'text-[var(--accent-vermilion)]'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span>
                    {isCorrect ? '完美变形！' : '差一点，看推导规则：'}
                    {' '}
                    <span className="font-jp">
                      {activeResult.kanjiForm}（{activeResult.readingForm}）
                    </span>
                  </span>
                </div>
                <SpeakButton
                  text={activeResult.kanjiForm}
                  rate={progress.settings.speechRate}
                  label="听答案"
                />
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                推导：{activeResult.ruleSteps}
              </p>
              {activeDrill.word.hint && (
                <p className="text-xs text-[var(--accent-ochre)] font-medium">
                  💡 提醒：{activeDrill.word.hint}
                </p>
              )}

              <button
                type="button"
                onClick={nextQuestion}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-indigo-btn)] text-white py-2.5 text-sm font-semibold hover:opacity-92 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>下一题</span>
              </button>
            </div>
          )}
        </section>
      ) : (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-sm text-[var(--text-secondary)]">
          当前筛选条件没有匹配的题目（例如形容词不含可能形/意志形），请点击「题库范围」调整筛选。
        </div>
      )}
    </div>
  );
}

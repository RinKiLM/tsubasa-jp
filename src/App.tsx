import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ClipboardList,
  Cloud,
  Home,
  MessageSquareHeart,
  Moon,
  Sun,
  Swords
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { ALL_LESSONS } from './data/curriculum';
import {
  DEFAULT_PROGRESS,
  addMistake,
  clearSyncParamFromUrl,
  extractSyncFromCurrentUrl,
  loadProgress,
  mergeProgress,
  recordStudyToday,
  saveProgress,
  touchProgress
} from './lib/storage';
import {
  getSupabaseClient,
  pullCloudProgress,
  pushCloudProgress
} from './lib/cloudSync';
import { stopSpeaking } from './lib/speech';
import type { MistakeRecord, UserProgress, UserSettings } from './types/curriculum';
import { HomeView } from './components/HomeView';
import { LessonListView } from './components/LessonListView';
import { LessonDetailView } from './components/LessonDetailView';
import { ConjugationDojoView } from './components/ConjugationDojoView';
import { ReviewAndSyncView } from './components/ReviewAndSyncView';
import { SyncIncomingModal } from './components/SyncIncomingModal';
import { BetaInviteAndFeedbackModal } from './components/BetaInviteAndFeedbackModal';

type TabId = 'home' | 'lessons' | 'dojo' | 'review';

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-[var(--accent-indigo-btn)] flex items-center justify-center shadow-xs shrink-0">
        <svg viewBox="0 0 64 64" className="w-5 h-5" fill="none">
          <path d="M12 48C18 32 30 18 52 12C46 25 38 36 25 42L12 48Z" fill="#FAF9F6" />
          <path
            d="M19 51C29 45 41 37 50 25C47 38 38 48 24 53L19 51Z"
            fill="#93C5FD"
            fillOpacity="0.9"
          />
          <circle cx="50" cy="14" r="2.2" fill="#C84B31" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight flex items-center gap-1.5">
          <span>言翼</span>
          <span className="text-xs font-medium text-[var(--accent-indigo)]">Tsubasa</span>
        </div>
        <div className="text-[11px] text-[var(--text-secondary)]">日语语法结构自习室</div>
      </div>
    </div>
  );
}

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Incoming URL Magic Sync modal
  const [incomingSync, setIncomingSync] = useState<UserProgress | null>(() =>
    extractSyncFromCurrentUrl()
  );

  // Beta Invite & Feedback modal
  const [betaModal, setBetaModal] = useState<{ open: boolean; tab: 'invite' | 'feedback' }>({
    open: false,
    tab: 'invite'
  });

  // Cloud Sync (Supabase) state
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>(
    'idle'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const skipNextPushRef = useRef(false);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const root = document.documentElement;
    if (progress.settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [progress.settings.darkMode]);

  useEffect(() => {
    stopSpeaking();
  }, [activeTab, activeLessonId]);

  const syncWithCloudNow = useCallback(async (user: User) => {
    setCloudSyncStatus('syncing');
    const remote = await pullCloudProgress(user.id);
    const merged = remote ? mergeProgress(progressRef.current, remote) : progressRef.current;

    skipNextPushRef.current = true;
    setProgress(merged);
    saveProgress(merged);

    const pushRes = await pushCloudProgress(user.id, merged);
    if (pushRes.ok) {
      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
    } else {
      setCloudSyncStatus('error');
    }
  }, []);

  // Listen to Supabase auth state if configured
  useEffect(() => {
    const sb = getSupabaseClient();
    if (!sb) return;

    sb.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCloudUser(data.user);
        syncWithCloudNow(data.user);
      }
    });

    const {
      data: { subscription }
    } = sb.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setCloudUser(nextUser);
      if (nextUser) {
        syncWithCloudNow(nextUser);
      } else {
        setCloudSyncStatus('idle');
        setLastSyncedAt(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncWithCloudNow]);

  // Debounced auto-push whenever progress changes while signed in
  useEffect(() => {
    if (!cloudUser) return;
    if (skipNextPushRef.current) {
      skipNextPushRef.current = false;
      return;
    }

    const timer = window.setTimeout(async () => {
      setCloudSyncStatus('syncing');
      const res = await pushCloudProgress(cloudUser.id, progress);
      if (res.ok) {
        setCloudSyncStatus('synced');
        setLastSyncedAt(
          new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        );
      } else {
        setCloudSyncStatus('error');
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [progress, cloudUser]);

  const updateSettings = (patch: Partial<UserSettings>) => {
    setProgress((prev) =>
      touchProgress({
        ...prev,
        settings: { ...prev.settings, ...patch }
      })
    );
  };

  const handleOpenLesson = (lessonId: string) => {
    setActiveTab('lessons');
    setActiveLessonId(lessonId);
  };

  const handleCompleteLesson = (lessonId: string, quizScorePct?: number) => {
    setProgress((prev) => {
      const next = recordStudyToday(prev);
      const completedLessons = next.completedLessons.includes(lessonId)
        ? next.completedLessons
        : [...next.completedLessons, lessonId];
      const quizBestScores = { ...next.quizBestScores };
      if (quizScorePct !== undefined) {
        quizBestScores[lessonId] = Math.max(quizBestScores[lessonId] ?? 0, quizScorePct);
      }
      return { ...next, completedLessons, quizBestScores, updatedAt: Date.now() };
    });
  };

  const handleRecordDojoAttempt = (correct: boolean, currentStreak: number) => {
    setProgress((prev) => {
      const next = recordStudyToday(prev);
      return {
        ...next,
        dojoTotalAnswered: next.dojoTotalAnswered + 1,
        dojoTotalCorrect: next.dojoTotalCorrect + (correct ? 1 : 0),
        dojoBestStreak: Math.max(next.dojoBestStreak, currentStreak),
        updatedAt: Date.now()
      };
    });
  };

  const handleRecordMistake = (mistake: Omit<MistakeRecord, 'timestamp'>) => {
    setProgress((prev) => addMistake(recordStudyToday(prev), mistake));
  };

  const handleRemoveMistake = (id: string) => {
    setProgress((prev) =>
      touchProgress({
        ...prev,
        mistakes: prev.mistakes.filter((m) => m.id !== id)
      })
    );
  };

  const activeLesson = activeLessonId
    ? ALL_LESSONS.find((l) => l.id === activeLessonId) ?? null
    : null;

  const contextPageLabel =
    activeTab === 'home'
      ? '首页总览'
      : activeTab === 'dojo'
      ? '动词 & 形容词变形道场'
      : activeTab === 'review'
      ? '错题复习与跨端同步'
      : activeLesson
      ? `第 ${activeLesson.number} 课 · ${activeLesson.title}`
      : 'Stage 0 语法课本目录';

  const navItems: { id: TabId; label: string; icon: typeof Home; badge?: number }[] = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'lessons', label: '课本', icon: BookOpen },
    { id: 'dojo', label: '道场', icon: Swords },
    {
      id: 'review',
      label: '错题与同步',
      icon: ClipboardList,
      badge: progress.mistakes.length > 0 ? progress.mistakes.length : undefined
    }
  ];

  const handleNavClick = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== 'lessons') {
      setActiveLessonId(null);
    } else if (activeTab === 'lessons') {
      setActiveLessonId(null);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-6 justify-between">
        <div className="space-y-6">
          <div className="px-2">
            <BrandMark />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-vermilion-soft)] text-[var(--accent-vermilion)]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {cloudUser && (
            <div className="mx-2 rounded-xl bg-[var(--accent-matcha-soft)]/60 px-3 py-2 text-[11px] text-[var(--accent-matcha)] flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                云同步已开启{lastSyncedAt ? ` · ${lastSyncedAt}` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Footer Controls */}
        <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setBetaModal({ open: true, tab: 'invite' })}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/70 py-2 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-indigo)] cursor-pointer"
          >
            <MessageSquareHeart className="w-3.5 h-3.5 text-[var(--accent-vermilion)]" />
            <span>邀请内测 / 提交反馈</span>
          </button>

          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-[var(--text-secondary)]">振假名显示</span>
            <button
              type="button"
              onClick={() => updateSettings({ showFurigana: !progress.settings.showFurigana })}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                progress.settings.showFurigana
                  ? 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              {progress.settings.showFurigana ? '开启' : '隐藏'}
            </button>
          </div>
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-[var(--text-secondary)]">外观主题</span>
            <button
              type="button"
              onClick={() => updateSettings({ darkMode: !progress.settings.darkMode })}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-subtle)] text-xs font-medium cursor-pointer"
            >
              {progress.settings.darkMode ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
              <span>{progress.settings.darkMode ? '深夜' : '和纸'}</span>
            </button>
          </div>
          <div className="px-2 text-[11px] text-[var(--text-secondary)]">
            v0.1.5 Beta · Crafted by tsubasa
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setBetaModal({ open: true, tab: 'feedback' })}
            aria-label="内测邀请与反馈"
            className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--accent-vermilion)] cursor-pointer"
          >
            <MessageSquareHeart className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => updateSettings({ showFurigana: !progress.settings.showFurigana })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
              progress.settings.showFurigana
                ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo)]'
                : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
            }`}
          >
            あ
          </button>
          <button
            type="button"
            aria-label="切换明暗主题"
            onClick={() => updateSettings({ darkMode: !progress.settings.darkMode })}
            className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] cursor-pointer"
          >
            {progress.settings.darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Column */}
      <main className="flex-1 md:pl-64 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          {activeTab === 'home' && (
            <HomeView
              progress={progress}
              onOpenLesson={handleOpenLesson}
              onNavigate={(tab) => handleNavClick(tab)}
            />
          )}

          {activeTab === 'lessons' &&
            (activeLesson ? (
              <LessonDetailView
                lesson={activeLesson}
                isCompleted={progress.completedLessons.includes(activeLesson.id)}
                settings={progress.settings}
                onUpdateSettings={updateSettings}
                onBack={() => setActiveLessonId(null)}
                onSelectLesson={(id) => setActiveLessonId(id)}
                onCompleteLesson={handleCompleteLesson}
                onRecordMistake={handleRecordMistake}
              />
            ) : (
              <LessonListView
                progress={progress}
                onSelectLesson={(id) => setActiveLessonId(id)}
              />
            ))}

          {activeTab === 'dojo' && (
            <ConjugationDojoView
              progress={progress}
              onRecordDojoAttempt={handleRecordDojoAttempt}
              onRecordMistake={handleRecordMistake}
            />
          )}

          {activeTab === 'review' && (
            <ReviewAndSyncView
              progress={progress}
              cloudUser={cloudUser}
              cloudSyncStatus={cloudSyncStatus}
              lastSyncedAt={lastSyncedAt}
              onManualCloudSync={() => cloudUser && syncWithCloudNow(cloudUser)}
              onRemoveMistake={handleRemoveMistake}
              onUpdateSettings={updateSettings}
              onReplaceProgress={(next) => setProgress(touchProgress(next))}
              onResetProgress={() => setProgress(touchProgress(DEFAULT_PROGRESS))}
              onOpenBetaModal={(tab) => setBetaModal({ open: true, tab })}
            />
          )}
        </div>
      </main>

      {/* Mobile iOS-style Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md px-2 pt-2 pb-safe">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative flex flex-col items-center justify-center py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
                  isActive
                    ? 'text-[var(--accent-indigo)] font-semibold'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{item.id === 'review' ? '错题/同步' : item.label}</span>
                {item.badge !== undefined && (
                  <span className="absolute top-0.5 right-3 min-w-[16px] h-4 px-1 rounded-full bg-[var(--accent-vermilion)] text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Incoming Magic Sync Modal */}
      {incomingSync && (
        <SyncIncomingModal
          local={progress}
          incoming={incomingSync}
          onMerge={() => {
            setProgress((prev) => mergeProgress(prev, incomingSync));
            clearSyncParamFromUrl();
            setIncomingSync(null);
          }}
          onOverwrite={() => {
            setProgress(touchProgress(incomingSync));
            clearSyncParamFromUrl();
            setIncomingSync(null);
          }}
          onCancel={() => {
            clearSyncParamFromUrl();
            setIncomingSync(null);
          }}
        />
      )}

      {/* Beta Invite & Feedback Modal */}
      {betaModal.open && (
        <BetaInviteAndFeedbackModal
          initialTab={betaModal.tab}
          contextPageLabel={contextPageLabel}
          darkMode={progress.settings.darkMode}
          onClose={() => setBetaModal((m) => ({ ...m, open: false }))}
        />
      )}
    </div>
  );
}

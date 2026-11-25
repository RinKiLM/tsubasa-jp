import type { MistakeRecord, UserProgress, UserSettings } from '../types/curriculum';

const STORAGE_KEY = 'tsubasa_jp_progress_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  showFurigana: true,
  showTranslation: true,
  highlightRoles: true,
  darkMode: false,
  speechRate: 0.95
};

export const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  quizBestScores: {},
  dojoTotalAnswered: 0,
  dojoTotalCorrect: 0,
  dojoBestStreak: 0,
  studyDates: [],
  mistakes: [],
  settings: DEFAULT_SETTINGS,
  updatedAt: 0
};

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings ?? {})
      }
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function touchProgress(progress: UserProgress): UserProgress {
  return { ...progress, updatedAt: Date.now() };
}

export function recordStudyToday(progress: UserProgress): UserProgress {
  const today = getTodayKey();
  const studyDates = progress.studyDates.includes(today)
    ? progress.studyDates
    : [...progress.studyDates, today].slice(-90);
  return {
    ...progress,
    studyDates,
    updatedAt: Date.now()
  };
}

export function addMistake(
  progress: UserProgress,
  mistake: Omit<MistakeRecord, 'timestamp'>
): UserProgress {
  const filtered = progress.mistakes.filter((m) => m.id !== mistake.id);
  return {
    ...progress,
    mistakes: [{ ...mistake, timestamp: Date.now() }, ...filtered].slice(0, 60),
    updatedAt: Date.now()
  };
}

export function calculateStreakDays(studyDates: string[]): number {
  if (!studyDates.length) return 0;
  const set = new Set(studyDates);
  let streak = 0;
  const cursor = new Date();

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  if (!set.has(fmt(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (set.has(fmt(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Intelligently merges two device progress snapshots without losing study records from either side.
 */
export function mergeProgress(local: UserProgress, incoming: UserProgress): UserProgress {
  const completedSet = new Set([...local.completedLessons, ...incoming.completedLessons]);

  const quizBestScores: Record<string, number> = { ...local.quizBestScores };
  for (const [lessonId, score] of Object.entries(incoming.quizBestScores)) {
    quizBestScores[lessonId] = Math.max(quizBestScores[lessonId] ?? 0, score);
  }

  const datesSet = new Set([...local.studyDates, ...incoming.studyDates]);
  const studyDates = Array.from(datesSet).sort().slice(-90);

  // Deduplicate mistakes keeping the latest timestamp per id
  const mistakeMap = new Map<string, MistakeRecord>();
  for (const m of [...local.mistakes, ...incoming.mistakes]) {
    const existing = mistakeMap.get(m.id);
    if (!existing || m.timestamp > existing.timestamp) {
      mistakeMap.set(m.id, m);
    }
  }
  const mistakes = Array.from(mistakeMap.values())
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 60);

  // Keep the more progressed dojo stats (avoid double-counting identical sessions)
  const useIncomingDojo = incoming.dojoTotalAnswered > local.dojoTotalAnswered;
  const dojoTotalAnswered = useIncomingDojo ? incoming.dojoTotalAnswered : local.dojoTotalAnswered;
  const dojoTotalCorrect = useIncomingDojo ? incoming.dojoTotalCorrect : local.dojoTotalCorrect;
  const dojoBestStreak = Math.max(local.dojoBestStreak, incoming.dojoBestStreak);

  // Prefer the newer settings snapshot while preserving local theme comfort if incoming is older
  const localTs = local.updatedAt ?? 0;
  const incomingTs = incoming.updatedAt ?? 0;
  const settings = incomingTs > localTs ? { ...local.settings, ...incoming.settings } : local.settings;

  return {
    completedLessons: Array.from(completedSet),
    quizBestScores,
    dojoTotalAnswered,
    dojoTotalCorrect,
    dojoBestStreak,
    studyDates,
    mistakes,
    settings,
    updatedAt: Math.max(localTs, incomingTs, Date.now())
  };
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(code: string): string {
  const normalized = code.trim().replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const bin = atob(normalized + pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function exportSyncCode(progress: UserProgress): string {
  return toBase64Url(JSON.stringify(progress));
}

export function importSyncCode(code: string): UserProgress | null {
  try {
    const json = fromBase64Url(code);
    const parsed = JSON.parse(json) as Partial<UserProgress>;
    if (!Array.isArray(parsed.completedLessons)) return null;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings ?? {})
      }
    };
  } catch {
    return null;
  }
}

/**
 * Builds a compact Magic Sync URL suitable for QR codes (caps mistakes to 12 most recent if needed to keep QR crisp).
 */
export function buildMagicSyncUrl(progress: UserProgress, baseUrlOverride?: string): string {
  const compact: UserProgress = {
    ...progress,
    mistakes: progress.mistakes.slice(0, 12)
  };
  const payload = exportSyncCode(compact);
  const base =
    baseUrlOverride?.trim() ||
    `${window.location.origin}${window.location.pathname}`;
  const cleanBase = base.split('?')[0].split('#')[0];
  return `${cleanBase}?sync=${payload}`;
}

export function extractSyncFromCurrentUrl(): UserProgress | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const syncParam = params.get('sync');
  if (!syncParam) return null;
  return importSyncCode(syncParam);
}

export function clearSyncParamFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has('sync')) return;
  url.searchParams.delete('sync');
  window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
}

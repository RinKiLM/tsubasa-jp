// Robust Japanese Speech Synthesis helper with iOS Safari / PWA workarounds

let cachedJapaneseVoice: SpeechSynthesisVoice | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let isInitialized = false;

function selectBestJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const jaVoices = voices.filter(
    (v) => v.lang.toLowerCase().startsWith('ja') || v.lang.toLowerCase().includes('jp')
  );
  if (!jaVoices.length) return null;

  // Prefer natural-sounding voices across Apple / Edge / Chrome
  const preferredNames = ['Kyoko', 'O-Ren', 'Otoya', 'Nanami', 'Haruka', 'Google 日本語', 'Microsoft Nanami'];
  for (const name of preferredNames) {
    const match = jaVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  return jaVoices[0];
}

export function initSpeechEngine(): void {
  if (isInitialized || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  isInitialized = true;
  cachedJapaneseVoice = selectBestJapaneseVoice();
  if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      cachedJapaneseVoice = selectBestJapaneseVoice();
    };
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakJapanese(
  text: string,
  rate = 0.95,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (!isSpeechSupported()) return false;
  initSpeechEngine();

  // Clean blanks/markers before reading aloud
  const cleanText = text.replace(/[（(]\s*[）)]/g, '、').trim();
  if (!cleanText) return false;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = Math.min(Math.max(rate, 0.5), 1.4);
    utterance.pitch = 1.0;

    if (!cachedJapaneseVoice) {
      cachedJapaneseVoice = selectBestJapaneseVoice();
    }
    if (cachedJapaneseVoice) {
      utterance.voice = cachedJapaneseVoice;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };
    utterance.onerror = () => {
      activeUtterance = null;
      onEnd?.();
    };

    // Keep global reference to prevent WebKit GC mid-utterance
    activeUtterance = utterance;
    window.speechSynthesis.speak(activeUtterance);
    return true;
  } catch {
    onEnd?.();
    return false;
  }
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

import { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { isSpeechSupported, speakJapanese, stopSpeaking } from '../lib/speech';

interface SpeakButtonProps {
  text: string;
  rate: number;
  size?: 'sm' | 'md';
  label?: string;
}

export function SpeakButton({ text, rate, size = 'sm', label }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  if (!isSpeechSupported()) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    speakJapanese(
      text,
      rate,
      () => setSpeaking(true),
      () => setSpeaking(false)
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`朗读日语：${text}`}
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
        speaking
          ? 'border-[var(--accent-indigo)] bg-[var(--accent-indigo)] text-white'
          : 'border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-indigo)] hover:text-[var(--accent-indigo)]'
      } ${size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}
    >
      {speaking ? (
        <Square className={size === 'sm' ? 'w-3 h-3 fill-current' : 'w-3.5 h-3.5 fill-current'} />
      ) : (
        <Volume2 className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      )}
      {label && <span>{speaking ? '停止' : label}</span>}
    </button>
  );
}

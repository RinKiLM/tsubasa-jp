import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeBoxProps {
  value: string;
  size?: number;
  caption?: string;
}

export function QrCodeBox({ value, size = 180, caption }: QrCodeBoxProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 2,
      color: {
        dark: '#1C2331',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (active) {
          setDataUrl(url);
          setError(null);
        }
      })
      .catch(() => {
        if (active) setError('内容过长，建议使用下方“复制链接”方式同步');
      });
    return () => {
      active = false;
    };
  }, [value, size]);

  if (error) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-4 text-center text-xs text-[var(--text-secondary)]">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-2xl bg-white p-2.5 shadow-xs border border-[var(--border-subtle)] inline-block">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={caption ?? '二维码'}
            width={size}
            height={size}
            className="block rounded-lg"
          />
        ) : (
          <div
            style={{ width: size, height: size }}
            className="rounded-lg bg-slate-100 animate-pulse"
          />
        )}
      </div>
      {caption && <p className="text-[11px] text-[var(--text-secondary)] text-center">{caption}</p>}
    </div>
  );
}

import { useState } from 'react';
import { Cloud, CloudOff, Loader2, LogOut, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import {
  isCloudSyncConfigured,
  signInWithEmail,
  signOutCloud,
  signUpWithEmail
} from '../lib/cloudSync';

interface CloudSyncCardProps {
  cloudUser: User | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string | null;
  onManualSync: () => void;
}

export function CloudSyncCard({
  cloudUser,
  syncStatus,
  lastSyncedAt,
  onManualSync
}: CloudSyncCardProps) {
  const configured = isCloudSyncConfigured();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      setNotice({ ok: false, text: '请输入有效邮箱，且密码不少于 6 位。' });
      return;
    }
    setLoading(true);
    setNotice(null);

    if (authMode === 'signup') {
      const res = await signUpWithEmail(email, password);
      if (res.error) {
        setNotice({ ok: false, text: `注册失败：${res.error}` });
      } else if (res.needsConfirm) {
        setNotice({ ok: true, text: '注册成功！请打开邮箱点击验证链接后再登录。' });
      } else {
        setNotice({ ok: true, text: '注册并登录成功！你的进度将自动云端同步。' });
      }
    } else {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setNotice({ ok: false, text: `登录失败：${res.error}` });
      } else {
        setNotice({ ok: true, text: '登录成功，正在智能合并云端进度...' });
      }
    }
    setLoading(false);
  };

  if (!configured) {
    return (
      <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <CloudOff className="w-4.5 h-4.5 text-[var(--text-secondary)]" />
            <div>
              <h2 className="text-base font-bold">云端账号实时自动同步（可选进阶）</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                当前未连接云端数据库，你可直接使用下方的「手机扫码 / 魔法同步链接」实现零配置跨端同步。
              </p>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] shrink-0">
            待配置
          </span>
        </div>
        <div className="rounded-xl bg-[var(--bg-subtle)]/60 p-3.5 text-xs text-[var(--text-secondary)] leading-relaxed space-y-1">
          <p className="font-semibold text-[var(--text-primary)]">
            想实现「电脑学完、出门打开 iPhone 自动出现最新进度」？
          </p>
          <p>
            项目已内置完整的 <strong>Supabase 免费云同步引擎</strong>（500MB 免费额度，你和朋友均可独立注册账号）。只需在免费 Supabase 控制台执行项目中的{' '}
            <code className="px-1 py-0.5 rounded bg-[var(--bg-surface)]">supabase/schema.sql</code>，并将两个密钥填入 GitHub Secrets 即可自动激活！
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--accent-indigo)]/30 bg-[var(--bg-surface)] p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-[var(--accent-indigo)]" />
          <div>
            <h2 className="text-base font-bold">云端实时自动同步</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              登录同一账号后，PC 与 iPhone 出门在外自动合并保存最新进度。
            </p>
          </div>
        </div>
        {cloudUser && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--accent-matcha-soft)] text-[var(--accent-matcha)]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            已连接
          </span>
        )}
      </div>

      {cloudUser ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-[var(--bg-subtle)]/70 p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <div className="text-[var(--text-secondary)]">当前同步账号</div>
              <div className="font-semibold text-sm text-[var(--text-primary)] mt-0.5">
                {cloudUser.email}
              </div>
              {lastSyncedAt && (
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  上次同步：{lastSyncedAt}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={syncStatus === 'syncing'}
                onClick={onManualSync}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-indigo-btn)] text-white px-3.5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {syncStatus === 'syncing' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>{syncStatus === 'syncing' ? '同步中...' : '立即同步'}</span>
              </button>
              <button
                type="button"
                onClick={() => signOutCloud()}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-vermilion)] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>退出</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="inline-flex rounded-xl bg-[var(--bg-subtle)] p-1 text-xs">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              登录已有账号
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`px-3 py-1 rounded-lg font-medium cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              注册新账号
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱地址"
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--accent-indigo)]"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码（至少 6 位）"
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--accent-indigo)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-indigo-btn)] text-white px-5 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{authMode === 'login' ? '登录并自动同步' : '注册并开启云同步'}</span>
          </button>

          {notice && (
            <p
              className={`text-xs font-medium ${
                notice.ok ? 'text-[var(--accent-matcha)]' : 'text-[var(--accent-vermilion)]'
              }`}
            >
              {notice.text}
            </p>
          )}
        </form>
      )}
    </section>
  );
}

import type { GrammarRole, RubyToken } from '../types/curriculum';

interface RubyTextProps {
  tokens: RubyToken[];
  showFurigana: boolean;
  highlightRoles: boolean;
  className?: string;
}

const ROLE_CLASS: Record<GrammarRole, string> = {
  topic: 'role-topic px-1 py-0.5 rounded-md',
  particle: 'role-particle px-1 py-0.5 rounded-md font-semibold',
  predicate: 'role-predicate px-1 py-0.5 rounded-md',
  modifier: 'role-modifier px-1 py-0.5 rounded-md',
  plain: ''
};

export function RubyText({
  tokens,
  showFurigana,
  highlightRoles,
  className = ''
}: RubyTextProps) {
  return (
    <span className={`font-jp leading-[2.2] tracking-wide ${className}`}>
      {tokens.map((token, idx) => {
        const roleCls = highlightRoles && token.role ? ROLE_CLASS[token.role] : '';
        const content =
          token.ruby && showFurigana ? (
            <ruby>
              {token.text}
              <rt>{token.ruby}</rt>
            </ruby>
          ) : (
            token.text
          );

        return (
          <span key={idx} className={roleCls ? `${roleCls} mx-[1px] inline-block` : ''}>
            {content}
          </span>
        );
      })}
    </span>
  );
}

export function RoleLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-[var(--text-secondary)]">结构色块：</span>
      <span className="role-topic px-2 py-0.5 rounded-md font-medium">主题 / 主语</span>
      <span className="role-particle px-2 py-0.5 rounded-md font-medium">助词</span>
      <span className="role-modifier px-2 py-0.5 rounded-md font-medium">修饰 / 状语</span>
      <span className="role-predicate px-2 py-0.5 rounded-md font-medium">谓语 / 变形</span>
    </div>
  );
}

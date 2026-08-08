import { Fragment, ReactNode } from 'react';

// Markup format from the alquran.cloud "quran-tajweed" edition: [tag[content]
// or [tag:id[content]. Verified against live ayahs before mapping colors —
// tags confirmed by observation: g=ghunnah, f=ikhfa, q=qalqalah,
// n/m/p=madd variants, a=idgham+ghunnah, u=idgham w/o ghunnah,
// h=hamzat al-wasl, l=lam shamsiyyah, o=silent small letters.
const TAG_PATTERN = /\[(\w+)(?::(\d+))?\[([^[\]]*)\]/g;

const TAG_COLORS: Record<string, string> = {
  g: '#22c55e', // Ghunnah - green
  a: '#22c55e', // Idgham with ghunnah - green
  f: '#3b82f6', // Ikhfa - blue
  q: '#f5c75d', // Qalqalah - gold
  n: '#ef4444', // Madd (natural) - red
  m: '#ef4444', // Madd (lazim) - red
  p: '#ef4444', // Madd (arid lissukoon) - red
};

const MUTED_TAGS = new Set(['h', 'l', 'o', 'u']);

// Strips the bracket-tag markup down to plain Arabic text (content only,
// no color) — for a clean black-and-white classical Mushaf rendering.
export function stripTajweedTags(raw: string): string {
  return raw.replace(TAG_PATTERN, (_match, _tag, _id, content) => content);
}

export function renderTajweedText(raw: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  TAG_PATTERN.lastIndex = 0;
  while ((match = TAG_PATTERN.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={key++}>{raw.slice(lastIndex, match.index)}</Fragment>);
    }
    const [, tag, , content] = match;
    const color = TAG_COLORS[tag];
    if (color) {
      nodes.push(
        <span key={key++} style={{ color, fontWeight: 700 }}>
          {content}
        </span>
      );
    } else if (MUTED_TAGS.has(tag)) {
      nodes.push(
        <span key={key++} style={{ opacity: 0.55 }}>
          {content}
        </span>
      );
    } else {
      nodes.push(<Fragment key={key++}>{content}</Fragment>);
    }
    lastIndex = TAG_PATTERN.lastIndex;
  }
  if (lastIndex < raw.length) {
    nodes.push(<Fragment key={key++}>{raw.slice(lastIndex)}</Fragment>);
  }
  return nodes;
}

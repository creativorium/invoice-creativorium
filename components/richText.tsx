import React from 'react';

/**
 * Tiny markup for user-authored note text.
 *
 * Invoice data can arrive from a shareable `?d=` URL, so note content is
 * untrusted. Everything here parses into React elements — no HTML string is
 * ever built or injected — and colors are validated before use.
 *
 * Syntax:
 *   **bold**            __underline__       ~~strikethrough~~      *italic*
 *   [color=#ff0000]text[/color]             [theme]text[/theme]
 */

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const NAMED_COLORS = new Set([
  'black', 'blue', 'brown', 'crimson', 'darkblue', 'darkgreen', 'gold', 'gray',
  'green', 'grey', 'indigo', 'maroon', 'navy', 'orange', 'pink', 'purple',
  'red', 'teal', 'tomato', 'white', 'yellow',
]);

const safeColor = (raw: string): string | null => {
  const value = raw.trim().toLowerCase();
  if (HEX_COLOR.test(value)) return value;
  if (NAMED_COLORS.has(value)) return value;
  return null;
};

interface Rule {
  re: RegExp;
  /** Which capture group holds the text to keep parsing. */
  content: number;
  wrap: (children: React.ReactNode, match: RegExpExecArray, key: string) => React.ReactNode;
}

/* Order matters: `**` must be tried before `*` so bold wins over italic.
   Markers must hug non-space text, so `5 * 3 * 2` stays plain arithmetic. */
const RULES: Rule[] = [
  { re: /\*\*(\S|\S[\s\S]*?\S)\*\*/, content: 1, wrap: (c, _m, key) => <strong key={key}>{c}</strong> },
  { re: /__(\S|\S[\s\S]*?\S)__/, content: 1, wrap: (c, _m, key) => <u key={key}>{c}</u> },
  { re: /~~(\S|\S[\s\S]*?\S)~~/, content: 1, wrap: (c, _m, key) => <s key={key}>{c}</s> },
  { re: /\*(\S|\S[\s\S]*?\S)\*/, content: 1, wrap: (c, _m, key) => <em key={key}>{c}</em> },
  {
    re: /\[theme\]([\s\S]+?)\[\/theme\]/i,
    content: 1,
    wrap: (c, _m, key) => <span key={key} style={{ color: 'var(--theme-color)' }}>{c}</span>,
  },
  {
    re: /\[color=([^\]\s]+)\]([\s\S]+?)\[\/color\]/i,
    content: 2,
    wrap: (c, m, key) => {
      const color = safeColor(m[1]);
      // Unrecognised color: render the text plainly rather than dropping it.
      return color ? <span key={key} style={{ color }}>{c}</span> : <span key={key}>{c}</span>;
    },
  },
];

const parse = (text: string, keyPrefix: string): React.ReactNode[] => {
  let best: { rule: Rule; match: RegExpExecArray } | null = null;

  for (const rule of RULES) {
    const match = rule.re.exec(text);
    if (!match) continue;
    if (!best || match.index < best.match.index) best = { rule, match };
  }

  if (!best) return text ? [text] : [];

  const { rule, match } = best;
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  const key = `${keyPrefix}-${match.index}`;

  return [
    ...(before ? [before] : []),
    rule.wrap(parse(match[rule.content], `${key}i`), match, key),
    ...parse(after, `${key}a`),
  ];
};

/** Renders note markup as React nodes. Newlines are preserved by the
 *  container's `white-space: pre-wrap`. */
export const renderRichText = (text?: string): React.ReactNode => {
  if (!text) return null;
  return parse(text, 'rt');
};

export const RICH_TEXT_HINT = '**bold**  *italic*  __underline__  ~~strike~~  [color=#ff0000]red[/color]  [theme]theme color[/theme]';

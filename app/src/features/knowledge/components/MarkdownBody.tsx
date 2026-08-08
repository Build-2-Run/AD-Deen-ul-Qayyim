import { Fragment, ReactNode } from 'react';
import { Heading } from '../../../design/typography/Heading';
import { Body, Code } from '../../../design/typography/BasicText';

interface ListItem {
  text: string;
  children: ListItem[];
}

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'hr' }
  | { kind: 'table'; lines: string[] }
  | { kind: 'list'; lines: string[] }
  | { kind: 'paragraph'; text: string; lead: boolean };

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const LIST_ITEM_RE = /^(\s*)-\s+(.*)$/;
const INLINE_RE = /(\*\*.+?\*\*|`.+?`|\*.+?\*)/g;

function parseInline(text: string): ReactNode[] {
  return text.split(INLINE_RE).filter(Boolean).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-[#f5c75d]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <Code key={idx} className="text-[#f5c75d] bg-white/10 px-1.5 py-0.5 rounded">{part.slice(1, -1)}</Code>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} className="italic text-white/80">{part.slice(1, -1)}</em>;
    }
    return <Fragment key={idx}>{part}</Fragment>;
  });
}

function parseBlocks(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;
  let sawParagraph = false;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.trim() === '---') {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      blocks.push({ kind: 'heading', text: headingMatch[2].trim() });
      i++;
      continue;
    }

    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      blocks.push({ kind: 'table', lines: tableLines });
      continue;
    }

    if (LIST_ITEM_RE.test(line)) {
      const listLines: string[] = [];
      while (i < lines.length && LIST_ITEM_RE.test(lines[i])) {
        listLines.push(lines[i]);
        i++;
      }
      blocks.push({ kind: 'list', lines: listLines });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      lines[i].trim() !== '---' &&
      !HEADING_RE.test(lines[i]) &&
      !lines[i].trim().startsWith('|') &&
      !LIST_ITEM_RE.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push({ kind: 'paragraph', text: paraLines.join(' ').trim(), lead: !sawParagraph });
    sawParagraph = true;
  }

  return blocks;
}

function buildList(lines: string[]): ListItem[] {
  const root: ListItem[] = [];
  const stack: { indent: number; item: ListItem }[] = [];

  for (const raw of lines) {
    const match = raw.match(LIST_ITEM_RE);
    if (!match) continue;
    const indent = match[1].length;
    const item: ListItem = { text: match[2], children: [] };

    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();

    if (stack.length === 0) {
      root.push(item);
    } else {
      stack[stack.length - 1].item.children.push(item);
    }
    stack.push({ indent, item });
  }

  return root;
}

function renderList(items: ListItem[], depth = 0): ReactNode {
  return (
    <ul className={depth === 0 ? 'list-disc pl-5 space-y-1.5' : 'list-[circle] pl-5 mt-1 space-y-1'}>
      {items.map((item, idx) => (
        <li key={idx} className="text-sm leading-relaxed text-white/90">
          {parseInline(item.text)}
          {item.children.length > 0 && renderList(item.children, depth + 1)}
        </li>
      ))}
    </ul>
  );
}

function parseTableRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
}

function renderTable(lines: string[], key: number): ReactNode {
  const rows = lines.map(parseTableRow);
  const headerRow = rows[0];
  const isSeparator = (row: string[]) => row.every(c => /^:?-{1,}:?$/.test(c));
  const bodyRows = isSeparator(rows[1] ?? []) ? rows.slice(2) : rows.slice(1);

  return (
    <div key={key} className="overflow-x-auto rounded-xl border border-[#f5c75d]/30 my-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-[#f5c75d]/10 border-b border-[#f5c75d]/30">
            {headerRow.map((cell, idx) => (
              <th key={idx} className="text-left px-3.5 py-2.5 font-bold text-[#f5c75d] text-xs uppercase tracking-wider whitespace-nowrap">
                {parseInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ridx) => (
            <tr key={ridx} className="border-b border-white/10 last:border-0 hover:bg-white/5">
              {row.map((cell, cidx) => (
                <td key={cidx} className="px-3.5 py-2.5 text-white/90 align-top">
                  {parseInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface MarkdownBodyProps {
  content?: string;
}

export function MarkdownBody({ content }: MarkdownBodyProps) {
  if (!content || !content.trim()) return null;

  const blocks = parseBlocks(content);

  return (
    <div className="flex flex-col gap-3 text-white/90">
      {blocks.map((block, idx) => {
        switch (block.kind) {
          case 'heading':
            return (
              <Heading
                key={idx}
                level={4}
                size="sm"
                className="uppercase tracking-wider text-[#f5c75d] font-bold text-sm mt-3 mb-1 first:mt-0"
              >
                {parseInline(block.text)}
              </Heading>
            );
          case 'hr':
            return <hr key={idx} className="border-white/10 my-2" />;
          case 'table':
            return renderTable(block.lines, idx);
          case 'list':
            return <div key={idx}>{renderList(buildList(block.lines))}</div>;
          case 'paragraph':
            return (
              <Body
                key={idx}
                size={block.lead ? 'lg' : 'sm'}
                className={block.lead ? 'leading-relaxed text-white font-medium' : 'leading-relaxed text-white/90'}
              >
                {parseInline(block.text)}
              </Body>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

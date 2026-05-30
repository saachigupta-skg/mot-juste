import { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  ['Adage', 'Proverb', 'Aphorism'],
  ['Idiom', 'Mot Juste', 'Maxim'],
  ['Loanword', 'Epigram', 'Euphemism'],
];

// Muted dot colors for unearned cells
const CATEGORY_COLORS: Record<string, string> = {
  'Adage': '#7a6e5f',
  'Proverb': '#5f7a6e',
  'Aphorism': '#6e5f7a',
  'Idiom': '#7a6a5f',
  'Mot Juste': '#8a7040',
  'Maxim': '#5f6e7a',
  'Loanword': '#7a5f6a',
  'Epigram': '#6a7a5f',
  'Euphemism': '#7a5f5f',
};

const DEFINITIONS: Record<string, string> = {
  'Adage': 'A short, widely known saying that expresses a general truth.',
  'Proverb': 'A brief popular saying offering practical wisdom.',
  'Aphorism': 'A pithy observation that contains a general truth.',
  'Idiom': 'A phrase whose meaning can\'t be deduced from its literal words.',
  'Mot Juste': 'The exact right word for a situation — no more, no less.',
  'Maxim': 'A short statement expressing a general rule of conduct.',
  'Loanword': 'A word adopted from another language with little modification.',
  'Epigram': 'A witty, concise remark or poem.',
  'Euphemism': 'A mild or indirect word used in place of a blunt one.',
};

// Vibrant fill colors when a square is earned
const EARNED_COLORS: Record<string, string> = {
  'Adage': '#b8874a',
  'Proverb': '#3d8c72',
  'Aphorism': '#7a5aaa',
  'Idiom': '#c07040',
  'Mot Juste': '#b88b18',
  'Maxim': '#3d6e9e',
  'Loanword': '#a04878',
  'Epigram': '#4d8c48',
  'Euphemism': '#a85858',
};

const STORAGE_KEY = 'motjuste_earned_categories';

interface BingoBoardProps {
  newlyEarned?: string[];
}

export default function BingoBoard({ newlyEarned = [] }: BingoBoardProps) {
  const [earned, setEarned] = useState<Set<string>>(new Set());
  const [popping, setPopping] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEarned(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (newlyEarned.length === 0) return;
    setEarned(prev => {
      const next = new Set(prev);
      newlyEarned.forEach(c => next.add(c));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
    setPopping(new Set(newlyEarned));
    const t = setTimeout(() => setPopping(new Set()), 600);
    return () => clearTimeout(t);
  }, [newlyEarned]);

  const allEarned = CATEGORIES.flat().every(c => earned.has(c));
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3px',
          maxWidth: '320px',
          margin: '0 auto',
        }}
      >
        {CATEGORIES.flat().map(category => {
          const isEarned = earned.has(category);
          const dotColor = CATEGORY_COLORS[category] ?? '#8a7560';
          const earnedBg = EARNED_COLORS[category] ?? '#b88b18';
          const isNew = popping.has(category);
          const isHovered = hovered === category;
          const definition = DEFINITIONS[category];
          return (
            <div
              key={category}
              className={`bingo-cell${isEarned ? ' bingo-cell--earned' : ''}${isNew ? ' bingo-cell--new' : ''}`}
              style={{
                padding: '0.6rem 0.25rem',
                backgroundColor: isEarned ? earnedBg : undefined,
                position: 'relative',
                cursor: 'default',
              }}
              onMouseEnter={() => setHovered(category)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isEarned ? 'rgba(255,255,255,0.6)' : dotColor,
                  marginBottom: '0.2rem',
                  opacity: isEarned ? 1 : 0.5,
                }}
              />
              <span
                className="bingo-cell__name"
                style={{ color: isEarned ? '#fff' : '#3d3020' }}
              >
                {category}
              </span>
              {isHovered && definition && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 6px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1a1208',
                    color: '#f7f3eb',
                    fontFamily: '"EB Garamond", serif',
                    fontSize: '0.78rem',
                    lineHeight: '1.5',
                    padding: '0.4rem 0.6rem',
                    width: '140px',
                    textAlign: 'center',
                    zIndex: 20,
                    pointerEvents: 'none',
                    fontStyle: 'italic',
                  }}
                >
                  {definition}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {allEarned && (
        <p
          style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontFamily: '"EB Garamond", serif',
            fontSize: '1rem',
            color: '#b85c38',
            fontStyle: 'italic',
          }}
        >
          You've collected all nine.
        </p>
      )}
    </div>
  );
}

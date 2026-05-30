import { useState, useEffect } from 'react';

const CATEGORIES = [
  ['Adage', 'Proverb', 'Aphorism'],
  ['Idiom', 'Mot Juste', 'Maxim'],
  ['Loanword', 'Epigram', 'Euphemism'],
];

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

const STORAGE_KEY = 'motjuste_earned_categories';

interface BingoBoardProps {
  newlyEarned?: string[];
}

export default function BingoBoard({ newlyEarned = [] }: BingoBoardProps) {
  const [earned, setEarned] = useState<Set<string>>(new Set());

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
  }, [newlyEarned]);

  const allEarned = CATEGORIES.flat().every(c => earned.has(c));

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
          const color = CATEGORY_COLORS[category] ?? '#8a7560';
          return (
            <div
              key={category}
              className={`bingo-cell${isEarned ? ' bingo-cell--earned' : ''}`}
              style={{ padding: '0.6rem 0.25rem' }}
            >
              {isEarned && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isEarned ? '#1a1208' : color,
                    marginBottom: '0.2rem',
                    opacity: isEarned ? 0.5 : 0.6,
                  }}
                />
              )}
              {!isEarned && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    marginBottom: '0.2rem',
                    opacity: 0.5,
                  }}
                />
              )}
              <span
                className="bingo-cell__name"
                style={{ color: isEarned ? '#1a1208' : '#9a8f80', opacity: isEarned ? 1 : 0.7 }}
              >
                {category}
              </span>
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

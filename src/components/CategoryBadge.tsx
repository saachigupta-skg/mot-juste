import { useState } from 'react';

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

const CATEGORY_DEFINITIONS: Record<string, string> = {
  'Adage': 'A traditional saying accepted as truth through long use',
  'Proverb': 'Folk wisdom, anonymous, passed across cultures',
  'Aphorism': 'A witty, attributed observation — a specific person said it',
  'Idiom': 'A phrase meaning something different from its literal words',
  'Mot Juste': 'The single precise word that does what a phrase cannot',
  'Maxim': 'A rule for living, pithy and prescriptive',
  'Loanword': 'Borrowed whole from another language because English had no equivalent',
  'Epigram': 'Short, pointed, often ironic — Oscar Wilde territory',
  'Euphemism': 'Softened language that obscures a harsher truth',
};

interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const color = CATEGORY_COLORS[category] ?? '#8a7560';
  const definition = CATEGORY_DEFINITIONS[category] ?? '';

  return (
    <div className="relative inline-block">
      <button
        className="category-badge"
        style={{ color }}
        onClick={() => setTooltipOpen(v => !v)}
        onBlur={() => setTooltipOpen(false)}
        aria-label={`${category}: ${definition}`}
        type="button"
      >
        <span className="category-dot" style={{ backgroundColor: color }} />
        <span>{category}</span>
      </button>

      {tooltipOpen && (
        <div
          className="absolute right-0 top-full mt-1 z-10 rounded-sm shadow-md"
          style={{
            backgroundColor: '#1a1208',
            color: '#f7f3eb',
            padding: '0.5rem 0.75rem',
            width: '200px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.75rem',
            lineHeight: '1.5',
          }}
        >
          <strong style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.6rem', marginBottom: '0.25rem', color }}>
            {category}
          </strong>
          {definition}
        </div>
      )}
    </div>
  );
}

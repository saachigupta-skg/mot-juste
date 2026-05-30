import CategoryBadge from './CategoryBadge';

interface Card {
  id: string;
  category: string;
  story: string;
  answer: string;
  distractors: string[];
  example: string;
}

interface RevealCardProps {
  card: Card;
  correct: boolean;
  onNext: () => void;
  isLast: boolean;
}

export default function RevealCard({ card, correct, onNext, isLast }: RevealCardProps) {
  return (
    <div className="card-surface" style={{ paddingTop: '1.5rem' }}>
      {/* Status line */}
      <div className="fade-in-delay-1" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        {correct ? (
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#b85c38',
            }}
          >
            You found it.
          </span>
        ) : (
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8a7560',
            }}
          >
            Not quite — here's the story.
          </span>
        )}
      </div>

      {/* Large revealed phrase */}
      <div className="fade-in-delay-2" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <p
          style={{
            fontFamily: '"EB Garamond", serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: '1.2',
            color: '#1a1208',
            margin: 0,
            fontWeight: 400,
          }}
        >
          {card.answer}
        </p>
      </div>

      {/* Category badge + definition */}
      <div className="fade-in-delay-3" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <CategoryBadge category={card.category} />
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.8rem',
            color: '#8a7560',
            marginTop: '0.4rem',
            marginBottom: 0,
            letterSpacing: '0.02em',
          }}
        >
          {getCategoryDefinition(card.category)}
        </p>
      </div>

      {/* Example sentence */}
      <div className="fade-in-delay-4" style={{ marginBottom: '2rem' }}>
        <p
          style={{
            fontFamily: '"EB Garamond", serif',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            color: '#8a7560',
            lineHeight: '1.7',
            textAlign: 'center',
            margin: 0,
            borderTop: '1px solid #cfc6b5',
            paddingTop: '1rem',
          }}
        >
          {card.example}
        </p>
      </div>

      {/* Next button */}
      <div className="fade-in-delay-5" style={{ textAlign: 'center' }}>
        <button
          onClick={onNext}
          type="button"
          style={{
            fontFamily: '"EB Garamond", serif',
            fontSize: '1.1rem',
            color: '#f7f3eb',
            backgroundColor: '#1a1208',
            border: 'none',
            padding: '0.75rem 2.5rem',
            cursor: 'pointer',
            letterSpacing: '0.02em',
            transition: 'background-color 300ms ease-out',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b85c38'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a1208'; }}
        >
          {isLast ? 'See results.' : 'Another?'}
        </button>
      </div>
    </div>
  );
}

function getCategoryDefinition(category: string): string {
  const defs: Record<string, string> = {
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
  return defs[category] ?? '';
}

import { useState, useEffect, useCallback, useRef } from 'react';
import AnswerChoice from './AnswerChoice';
import CategoryBadge from './CategoryBadge';
import RevealCard from './RevealCard';
import BingoBoard from './BingoBoard';
import cardsData from '../data/cards.json';

interface Card {
  id: string;
  category: string;
  story: string;
  answer: string;
  distractors: string[];
  example: string;
}

type Phase = 'quiz' | 'reveal' | 'summary';
type AnswerState = 'default' | 'selected' | 'correct' | 'wrong' | 'disabled-correct';

const SESSION_SIZE = 10;
const STORAGE_KEY_STREAK = 'motjuste_streak';
const STORAGE_KEY_LAST_PLAYED = 'motjuste_last_played';
const STORAGE_KEY_EARNED = 'motjuste_earned_categories';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildChoices(card: Card): string[] {
  return shuffleArray([card.answer, ...card.distractors]);
}

function getSessionCards(): Card[] {
  const shuffled = shuffleArray(cardsData as Card[]);
  return shuffled.slice(0, SESSION_SIZE);
}

function numberToWords(n: number): string {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  if (n < words.length) return words[n];
  return String(n);
}

interface StreakData {
  count: number;
  lastPlayed: string;
}

function getStreak(): StreakData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_STREAK);
    const lastPlayed = localStorage.getItem(STORAGE_KEY_LAST_PLAYED) ?? '';
    const count = stored ? parseInt(stored, 10) : 0;
    return { count: isNaN(count) ? 0 : count, lastPlayed };
  } catch {
    return { count: 0, lastPlayed: '' };
  }
}

function updateStreak(): number {
  try {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem(STORAGE_KEY_LAST_PLAYED) ?? '';
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const storedCount = localStorage.getItem(STORAGE_KEY_STREAK);
    let count = storedCount ? parseInt(storedCount, 10) : 0;

    if (lastPlayed === today) {
      return count;
    } else if (lastPlayed === yesterday) {
      count += 1;
    } else {
      count = 1;
    }

    localStorage.setItem(STORAGE_KEY_STREAK, String(count));
    localStorage.setItem(STORAGE_KEY_LAST_PLAYED, today);
    return count;
  } catch {
    return 0;
  }
}

interface Toast {
  id: number;
  message: string;
}

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [sessionCards] = useState<Card[]>(getSessionCards);
  const [choices, setChoices] = useState<string[]>(() => buildChoices(sessionCards[0]));
  const [cardIndex, setCardIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState<Card[]>([]);
  const [sessionEarned, setSessionEarned] = useState<string[]>([]);
  const [cardAnimation, setCardAnimation] = useState<'none' | 'correct' | 'wrong'>('none');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [streak, setStreak] = useState(0);
  const [earnedCategories, setEarnedCategories] = useState<Set<string>>(new Set());
  const toastIdRef = useRef(0);

  useEffect(() => {
    const { count } = getStreak();
    setStreak(count);
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EARNED);
      if (stored) {
        setEarnedCategories(new Set(JSON.parse(stored)));
      }
    } catch {}
  }, []);

  const addToast = useCallback((message: string) => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  const currentCard = sessionCards[cardIndex];

  const handleAnswer = useCallback((choice: string) => {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);

    const isCorrect = choice === currentCard.answer;
    setCardAnimation(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setCorrectCount(c => c + 1);
      setSessionCorrect(prev => [...prev, currentCard]);

      const alreadyEarned = earnedCategories.has(currentCard.category);
      if (!alreadyEarned) {
        const next = new Set(earnedCategories);
        next.add(currentCard.category);
        setEarnedCategories(next);
        setSessionEarned(prev => {
          const updated = [...prev, currentCard.category];
          return updated;
        });
        addToast(`First ${currentCard.category}.`);
        try {
          localStorage.setItem(STORAGE_KEY_EARNED, JSON.stringify([...next]));
        } catch {}
      }
    }

    setTimeout(() => {
      setCardAnimation('none');
      setPhase('reveal');
    }, 600);
  }, [answered, currentCard, earnedCategories, addToast]);

  const handleNext = useCallback(() => {
    if (cardIndex + 1 >= SESSION_SIZE) {
      const newStreak = updateStreak();
      setStreak(newStreak);
      setPhase('summary');
      return;
    }
    const nextIndex = cardIndex + 1;
    setCardIndex(nextIndex);
    setChoices(buildChoices(sessionCards[nextIndex]));
    setSelected(null);
    setAnswered(false);
    setCardAnimation('none');
    setPhase('quiz');
  }, [cardIndex, sessionCards]);

  const getChoiceState = (choice: string): AnswerState => {
    if (!answered) {
      return choice === selected ? 'selected' : 'default';
    }
    if (choice === currentCard.answer) return 'correct';
    if (choice === selected) return 'wrong';
    return 'disabled-correct';
  };

  const streakLabel = streak > 0
    ? `${numberToWords(streak).charAt(0).toUpperCase() + numberToWords(streak).slice(1)} ${streak === 1 ? 'day' : 'days'} running.`
    : null;

  if (phase === 'summary') {
    return (
      <SummaryScreen
        correctCount={correctCount}
        sessionCorrect={sessionCorrect}
        sessionEarned={sessionEarned}
        streak={streak}
        onRestart={() => window.location.reload()}
      />
    );
  }

  if (phase === 'reveal') {
    return (
      <div style={{ position: 'relative' }}>
        <RevealCard
          card={currentCard}
          correct={selected === currentCard.answer}
          onNext={handleNext}
          isLast={cardIndex + 1 >= SESSION_SIZE}
        />
        {toasts.map(t => (
          <ToastNotification key={t.id} message={t.message} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Card animation overlay */}
      {cardAnimation === 'correct' && (
        <div
          className="animate-amber-pulse"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(240, 192, 96, 0.20)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
      {cardAnimation === 'wrong' && (
        <div
          className="animate-wrong-flash"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      <div className="card-surface">
        {/* Header row: progress dots + category badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
          }}
        >
          <ProgressDots total={SESSION_SIZE} current={cardIndex} />
          <CategoryBadge category={currentCard.category} />
        </div>

        {/* Story text */}
        <div style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontFamily: '"EB Garamond", serif',
              fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)',
              lineHeight: '1.8',
              color: '#1a1208',
              margin: 0,
            }}
          >
            {currentCard.story}
          </p>
        </div>

        {/* Answer choices */}
        <div
          style={{
            borderTop: '1px solid #cfc6b5',
            paddingTop: '0.75rem',
          }}
        >
          {choices.map(choice => (
            <AnswerChoice
              key={choice}
              text={choice}
              state={getChoiceState(choice)}
              disabled={answered}
              onClick={() => handleAnswer(choice)}
            />
          ))}
        </div>
      </div>

      {toasts.map(t => (
        <ToastNotification key={t.id} message={t.message} />
      ))}
    </div>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center', paddingTop: '3px' }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: i <= current ? '#1a1208' : '#cfc6b5',
            transition: 'background-color 400ms ease-out',
          }}
        />
      ))}
    </div>
  );
}

function ToastNotification({ message }: { message: string }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#c8922a',
        color: '#1a1208',
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '0.5rem 1rem',
        whiteSpace: 'nowrap',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}

interface SummaryScreenProps {
  correctCount: number;
  sessionCorrect: Card[];
  sessionEarned: string[];
  streak: number;
  onRestart: () => void;
}

function SummaryScreen({ correctCount, sessionCorrect, sessionEarned, streak, onRestart }: SummaryScreenProps) {
  function numberToWords(n: number): string {
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    if (n < words.length) return words[n];
    return String(n);
  }

  const streakLabel = streak > 0
    ? `${numberToWords(streak).charAt(0).toUpperCase() + numberToWords(streak).slice(1)} ${streak === 1 ? 'day' : 'days'} running.`
    : null;

  const shareText = `Mot Juste — ${correctCount} of 10\n${streakLabel ?? ''}\nmotjuste.saachigupta.net`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
  };

  return (
    <div className="card-surface animate-fade-in">
      {/* Score */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p
          style={{
            fontFamily: '"EB Garamond", serif',
            fontSize: 'clamp(3rem, 8vw, 4.5rem)',
            lineHeight: '1',
            color: '#1a1208',
            margin: 0,
          }}
        >
          {correctCount} of {SESSION_SIZE}
        </p>
        {streakLabel && (
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8a7560',
              marginTop: '0.5rem',
              marginBottom: 0,
            }}
          >
            {streakLabel}
          </p>
        )}
      </div>

      {/* Correct phrases list */}
      {sessionCorrect.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8a7560',
              marginBottom: '0.75rem',
              marginTop: 0,
            }}
          >
            You found these:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sessionCorrect.map(card => (
              <li
                key={card.id}
                style={{
                  fontFamily: '"EB Garamond", serif',
                  fontSize: '1.1rem',
                  color: '#1a1208',
                  lineHeight: '1.6',
                  borderLeft: '3px solid #b85c38',
                  paddingLeft: '0.75rem',
                  marginBottom: '0.35rem',
                }}
              >
                {card.answer}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Newly earned categories */}
      {sessionEarned.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8a7560',
              marginBottom: '0.5rem',
              marginTop: 0,
            }}
          >
            Earned this session:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {sessionEarned.map(cat => (
              <span
                key={cat}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  backgroundColor: '#c8922a',
                  color: '#1a1208',
                  padding: '0.25rem 0.6rem',
                  fontWeight: 500,
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bingo board */}
      <div style={{ marginBottom: '2rem' }}>
        <BingoBoard newlyEarned={sessionEarned} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={onRestart}
          type="button"
          style={{
            fontFamily: '"EB Garamond", serif',
            fontSize: '1.1rem',
            color: '#f7f3eb',
            backgroundColor: '#1a1208',
            border: 'none',
            padding: '0.75rem 2.5rem',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '320px',
            letterSpacing: '0.02em',
            transition: 'background-color 300ms ease-out',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b85c38'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a1208'; }}
        >
          Another?
        </button>
        <button
          onClick={handleShare}
          type="button"
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8a7560',
            backgroundColor: 'transparent',
            border: 'none',
            padding: '0.5rem',
            cursor: 'pointer',
            transition: 'color 300ms ease-out',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1208'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#8a7560'; }}
        >
          Challenge someone.
        </button>
      </div>
    </div>
  );
}

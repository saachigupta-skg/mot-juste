import cardsData from '../data/cards.json';

const STORAGE_KEY = 'motjuste_card_progress';

export type CardRecord = {
  correct: number;
  wrong: number;
  lastSeen: string; // ISO date string
  usedInRealLife: number;
};

export type CardProgressMap = Record<string, CardRecord>;

export function getCardProgress(): CardProgressMap {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function updateCardProgress(cardId: string, isCorrect: boolean, bonusUsage = false): CardProgressMap {
  const progress = getCardProgress();
  const existing = progress[cardId] ?? { correct: 0, wrong: 0, lastSeen: '', usedInRealLife: 0 };
  const updated: CardRecord = {
    correct: isCorrect ? existing.correct + 1 : existing.correct,
    wrong: isCorrect ? existing.wrong : existing.wrong + 1,
    lastSeen: new Date().toISOString(),
    usedInRealLife: bonusUsage ? existing.usedInRealLife + 1 : existing.usedInRealLife,
  };
  const next = { ...progress, [cardId]: updated };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function markUsedInRealLife(cardId: string): void {
  const progress = getCardProgress();
  const existing = progress[cardId];
  if (!existing) return;
  const next = {
    ...progress,
    [cardId]: { ...existing, usedInRealLife: existing.usedInRealLife + 1 },
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

// A card is mastered if correct >= 2
export function getMasteredCount(progress: CardProgressMap): number {
  return Object.values(progress).filter(r => r.correct >= 2).length;
}

export const LINGUIST_LEVELS = [
  { min: 0,  name: 'Apprentice',  bio: '' },
  { min: 5,  name: 'Haas',        bio: 'Mary Haas — pioneered study of Native American languages' },
  { min: 10, name: 'Fromkin',     bio: 'Victoria Fromkin — revealed the structure in speech errors' },
  { min: 16, name: 'Lakoff',      bio: 'Robin Lakoff — language, power, and gender' },
  { min: 22, name: 'Tannen',      bio: 'Deborah Tannen — how we talk past each other' },
  { min: 29, name: 'Bresnan',     bio: 'Joan Bresnan — syntax as it actually works in the mind' },
  { min: 35, name: 'Mot Juste',   bio: 'All 35 words mastered. The exact right word, every time.' },
];

export function getLinguistLevel(masteredCount: number) {
  let level = LINGUIST_LEVELS[0];
  for (const l of LINGUIST_LEVELS) {
    if (masteredCount >= l.min) level = l;
  }
  return level;
}

interface Card {
  id: string;
  category: string;
  story: string;
  answer: string;
  distractors: string[];
  example: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildSmartSession(size = 10): Card[] {
  const progress = getCardProgress();
  const allCards = cardsData as Card[];

  // Bucket cards
  const needsReview: Card[] = [];   // wrong > 0
  const fresh: Card[] = [];          // never seen
  const spacedReview: Card[] = [];   // seen and correct, not recent

  for (const card of shuffleArray(allCards)) {
    const rec = progress[card.id];
    if (!rec) {
      fresh.push(card);
    } else if (rec.wrong > 0) {
      needsReview.push(card);
    } else {
      spacedReview.push(card);
    }
  }

  const session: Card[] = [];

  // 1. Up to half the session from cards that need review
  const reviewSlots = Math.min(needsReview.length, Math.floor(size / 2));
  session.push(...needsReview.slice(0, reviewSlots));

  // 2. Fill the rest with fresh cards
  const freshSlots = Math.min(fresh.length, size - session.length);
  session.push(...fresh.slice(0, freshSlots));

  // 3. If still short, pull from spaced review
  if (session.length < size) {
    const needed = size - session.length;
    session.push(...spacedReview.slice(0, needed));
  }

  // 4. If still short (tiny deck), allow repeats from review bucket
  if (session.length < size) {
    const needed = size - session.length;
    session.push(...shuffleArray([...needsReview, ...spacedReview]).slice(0, needed));
  }

  return shuffleArray(session).slice(0, size);
}

interface AnswerChoiceProps {
  text: string;
  state: 'default' | 'selected' | 'correct' | 'wrong' | 'disabled-correct';
  disabled: boolean;
  onClick: () => void;
}

export default function AnswerChoice({ text, state, disabled, onClick }: AnswerChoiceProps) {
  let className = 'answer-item';
  if (state === 'selected') className += ' answer-item--selected';
  if (state === 'correct' || state === 'disabled-correct') className += ' answer-item--correct';
  if (state === 'wrong') className += ' answer-item--wrong';
  if (disabled) className += ' answer-item--disabled';

  return (
    <button
      className={className}
      onClick={disabled ? undefined : onClick}
      type="button"
      disabled={disabled}
    >
      {text}
    </button>
  );
}

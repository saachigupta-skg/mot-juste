interface AnswerChoiceProps {
  text: string;
  state: 'default' | 'selected' | 'correct' | 'wrong' | 'disabled-correct';
  disabled: boolean;
  wasSelected?: boolean;
  onClick: () => void;
}

export default function AnswerChoice({ text, state, disabled, wasSelected, onClick }: AnswerChoiceProps) {
  let className = 'answer-item';
  if (state === 'selected') className += ' answer-item--selected';
  if (state === 'correct') className += ' answer-item--correct';
  if (state === 'disabled-correct') className += ' answer-item--disabled-neutral';
  if (state === 'wrong') className += ' answer-item--wrong';
  if (disabled) className += ' answer-item--disabled';

  return (
    <button
      className={className}
      onClick={disabled ? undefined : onClick}
      type="button"
      disabled={disabled}
    >
      <span>{text}</span>
      {wasSelected && disabled && (
        <span className="answer-item__you-label">your answer</span>
      )}
    </button>
  );
}

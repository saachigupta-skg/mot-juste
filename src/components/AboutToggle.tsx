import { useState } from 'react';

export default function AboutToggle() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #e0d8ca', paddingTop: '1.25rem' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'block',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#8a7560',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>Why this exists</span>
        <span style={{ fontSize: '1rem', lineHeight: 1, transition: 'transform 300ms ease-out', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
      </button>

      {open && (
        <p
          style={{
            fontFamily: '"EB Garamond", serif',
            fontSize: '1.05rem',
            lineHeight: '1.75',
            color: '#5a4f3e',
            marginTop: '1rem',
            marginBottom: 0,
          }}
          className="animate-fade-in"
        >
          I learned English in third grade, and vocabulary felt like discovering a secret language —
          a word for <em>exactly</em> that thing. Adage. Epigram. Loanword. There's something a little
          precocious about caring this much about the right word, but precision feels like a kind of power.
          The mot juste: the exact right word. This is for people who feel the same way.
        </p>
      )}
    </div>
  );
}

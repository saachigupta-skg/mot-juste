import { useState } from 'react';
import { saveFeedback } from '../lib/supabase';

type WidgetState = 'idle' | 'open' | 'submitting' | 'done';

export default function FeedbackWidget() {
  const [state, setState] = useState<WidgetState>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setState('submitting');
    await saveFeedback(message.trim(), email.trim() || undefined);
    setState('done');
    setTimeout(() => {
      setState('idle');
      setMessage('');
      setEmail('');
    }, 2500);
  };

  const handleClose = () => {
    setState('idle');
    setMessage('');
    setEmail('');
  };

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setState('open')}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#8a7560',
          background: 'transparent',
          border: '1px solid #cfc6b5',
          padding: '0.4rem 0.75rem',
          cursor: 'pointer',
          transition: 'color 200ms ease-out, border-color 200ms ease-out',
          zIndex: 50,
          display: state === 'idle' ? 'block' : 'none',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = '#1a1208';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#8a7560';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = '#8a7560';
          (e.currentTarget as HTMLButtonElement).style.borderColor = '#cfc6b5';
        }}
      >
        Feedback
      </button>

      {/* Modal backdrop */}
      {(state === 'open' || state === 'submitting' || state === 'done') && (
        <div
          onClick={state === 'open' ? handleClose : undefined}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(26, 18, 8, 0.3)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0 1rem 2rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#f7f3eb',
              width: '100%',
              maxWidth: '480px',
              padding: '1.5rem',
            }}
          >
            {state === 'done' ? (
              <p
                style={{
                  fontFamily: '"EB Garamond", Georgia, serif',
                  fontSize: '1.1rem',
                  color: '#1a1208',
                  margin: 0,
                  textAlign: 'center',
                  padding: '0.5rem 0',
                }}
              >
                Thank you.
              </p>
            ) : (
              <form onSubmit={handleSubmit}>
                <p
                  style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#8a7560',
                    margin: '0 0 1rem',
                  }}
                >
                  Send feedback
                </p>

                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  style={{
                    display: 'block',
                    width: '100%',
                    fontFamily: '"EB Garamond", Georgia, serif',
                    fontSize: '1rem',
                    color: '#1a1208',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #cfc6b5',
                    padding: '0 0 0.5rem',
                    marginBottom: '1rem',
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                />

                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email (optional — if you want a reply)"
                  style={{
                    display: 'block',
                    width: '100%',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: '0.8rem',
                    color: '#1a1208',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid #cfc6b5',
                    padding: '0 0 0.4rem',
                    marginBottom: '1.25rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleClose}
                    style={{
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#8a7560',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!message.trim() || state === 'submitting'}
                    style={{
                      fontFamily: '"EB Garamond", Georgia, serif',
                      fontSize: '1rem',
                      color: '#f7f3eb',
                      backgroundColor: message.trim() ? '#1a1208' : '#cfc6b5',
                      border: 'none',
                      padding: '0.5rem 1.5rem',
                      cursor: message.trim() ? 'pointer' : 'default',
                      transition: 'background-color 200ms ease-out',
                    }}
                  >
                    {state === 'submitting' ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

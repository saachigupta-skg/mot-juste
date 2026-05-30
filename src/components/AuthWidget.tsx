import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const style = {
  wrap: { textAlign: 'center' as const, marginTop: '0.75rem' },
  small: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#8a7560',
  },
  ghostBtn: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.65rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: '#8a7560',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid #cfc6b5',
    cursor: 'pointer',
    padding: '0 0 1px',
  },
  input: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.85rem',
    padding: '0.4rem 0.75rem',
    border: '1px solid #cfc6b5',
    backgroundColor: '#f7f3eb',
    color: '#1a1208',
    width: '220px',
    outline: 'none',
  },
  sendBtn: {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.65rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#f7f3eb',
    backgroundColor: '#1a1208',
    border: 'none',
    padding: '0.4rem 1rem',
    cursor: 'pointer',
  },
};

export default function AuthWidget() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const sendLink = async () => {
    if (!email) return;
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setSent(true);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <div style={style.wrap}>
        <span style={style.small}>Synced · {user.email}</span>
        {' '}
        <button onClick={signOut} style={{ ...style.small, background: 'none', border: 'none', borderBottom: '1px solid #cfc6b5', cursor: 'pointer', padding: '0 0 1px' }}>
          Sign out
        </button>
      </div>
    );
  }

  if (sent) {
    return (
      <p style={{ textAlign: 'center', fontFamily: '"EB Garamond", serif', fontStyle: 'italic', fontSize: '0.95rem', color: '#8a7560', marginTop: '0.75rem' }}>
        Check your email.
      </p>
    );
  }

  if (open) {
    return (
      <div style={{ ...style.wrap, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={style.input}
          onKeyDown={e => { if (e.key === 'Enter') sendLink(); }}
          autoFocus
        />
        <button
          onClick={sendLink}
          disabled={!email || loading}
          style={{ ...style.sendBtn, opacity: !email || loading ? 0.5 : 1 }}
        >
          Send link
        </button>
      </div>
    );
  }

  return (
    <div style={style.wrap}>
      <button onClick={() => setOpen(true)} style={style.ghostBtn}>
        Sync across devices
      </button>
    </div>
  );
}

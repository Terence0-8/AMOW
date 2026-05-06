import { useAuth } from '../hooks/useAuth';
import React, { useState, useRef, useEffect } from 'react';
import { Delete, ArrowLeft } from 'lucide-react';

// Composant cases PIN style OTP
const PinInput = ({ value, onChange, label, isDark, t }) => {
  const inputRefs = useRef([]);
  const digits = value.split('');

  const handleKey = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const newPin = value.slice(0, index) + value.slice(index + 1);
        onChange(newPin);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newPin = value.slice(0, index - 1) + value.slice(index);
        onChange(newPin);
      }
    }
  };

  const handleInput = (index, e) => {
    const digit = e.target.value.replace(/\D/, '').slice(-1);
    if (!digit) return;
    const arr = [...digits];
    arr[index] = digit;
    const newPin = arr.join('').slice(0, 6);
    onChange(newPin);
    if (index < 5 && newPin.length > index) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className={`text-sm font-medium uppercase tracking-widest ${t.textMuted}`}>{label}</p>
      <div className="flex gap-3">
        {[0,1,2,3,4,5].map(i => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={digits[i] || ''}
            onChange={e => handleInput(i, e)}
            onKeyDown={e => handleKey(i, e)}
            onFocus={e => e.target.select()}
            className={`w-11 h-14 text-center text-xl font-semibold rounded-2xl border-2 outline-none transition-all duration-300
              ${digits[i]
                ? (isDark
                    ? 'bg-purple-500/30 border-purple-400 text-white shadow-[0_0_10px_rgba(192,132,252,0.3)]'
                    : 'bg-[#F0EBEF] border-[#593C60] text-[#2D1B2E] shadow-sm')
                : (isDark
                    ? 'bg-white/5 border-white/20 text-white'
                    : 'bg-white border-[#D1C8D4] text-[#2D1B2E]')
              }
              focus:border-[#8E6494] focus:scale-105`}
          />
        ))}
      </div>
    </div>
  );
};

export default function AuthScreen({ onAuth, isDark }) {
  // pages: 'welcome' | 'login' | 'register-name' | 'register-pin' | 'register-confirm'
  const [page, setPage] = useState('welcome');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth(); // à importer depuis useAuth

  const t = isDark ? {
    textMain: 'text-white',
    textMuted: 'text-white/60',
    cardBase: 'bg-white/5 border border-white/10 shadow-lg backdrop-blur-md',
    btnPrimary: 'bg-gradient-to-r from-[#6b3074] to-[#4A2545] text-white shadow-lg shadow-purple-900/50',
    btnSecondary: 'bg-white/10 text-white border-white/20 hover:bg-white/20',
    inputBg: 'bg-black/20 border-white/10 focus:border-purple-400 text-white placeholder-white/40',
  } : {
    textMain: 'text-[#2D1B2E]',
    textMuted: 'text-[#756677]',
    cardBase: 'bg-white border border-[#EAE5E0] shadow-sm',
    btnPrimary: 'bg-gradient-to-r from-[#593C60] to-[#7D5385] text-white shadow-md shadow-purple-200',
    btnSecondary: 'bg-white text-[#593C60] border-[#EAE5E0] hover:bg-[#F0EBEF]',
    inputBg: 'bg-[#F9F8F6] border-[#EAE5E0] focus:border-[#8E6494] text-[#2D1B2E] placeholder-[#756677]/60',
  };

  const resetError = () => setError('');

  // PAGE 1 — Accueil
  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-bubble px-8">
      <div className="text-center">
        <h1 className="text-6xl amow-font tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#593C60] via-[#8E6494] to-[#593C60] font-bold drop-shadow-sm">
          AMOW
        </h1>
        <p className={`${t.textMuted} mt-2 text-xs uppercase tracking-widest font-bold`}>
          Votre carnet d'aventures
        </p>
      </div>

      <div className="w-full space-y-3 mt-4">
        <button
          onClick={() => { resetError(); setPage('login'); }}
          className={`w-full py-4 rounded-[1.5rem] font-medium text-base active:scale-95 transition-all ${t.btnPrimary}`}
        >
          J'ai déjà un compte
        </button>
        <button
          onClick={() => { resetError(); setPage('register-name'); }}
          className={`w-full py-4 rounded-[1.5rem] font-medium text-base active:scale-95 transition-all border ${t.btnSecondary}`}
        >
          Créer mon compte
        </button>
      </div>
    </div>
  );

  // PAGE 2 — Connexion (PIN 4-6 cases)
  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-bubble px-8">
      <div className="text-center">
        <h2 className={`text-3xl amow-font ${t.textMain}`}>Bon retour 👋</h2>
        <p className={`${t.textMuted} text-sm mt-2 font-light`}>Saisis ton code secret</p>
      </div>

      <PinInput value={pin} onChange={setPin} label="Ton PIN" isDark={isDark} t={t} />

      {error && (
        <p className="text-red-400 text-sm text-center animate-in fade-in">{error}</p>
      )}

      <button
        disabled={pin.length < 4 || loading}
        onClick={async () => {
          setLoading(true);
          const result = await login(pin);
         if (result.error) setError(result.error);
        else onAuth();
        }}
        className={`w-full py-4 rounded-[1.5rem] font-medium text-base active:scale-95 transition-all ${pin.length >= 4 ? t.btnPrimary : 'opacity-40 grayscale bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        {loading ? 'Vérification...' : 'Se connecter'}
      </button>
    </div>
  );

  // PAGE 3 — Inscription : Nom
  const renderRegisterName = () => (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-bubble px-8">
      <div className="text-center">
        <h2 className={`text-3xl amow-font ${t.textMain}`}>Comment tu t'appelles ?</h2>
        <p className={`${t.textMuted} text-sm mt-2 font-light`}>Le prénom qui apparaîtra dans l'app</p>
      </div>

      <input
        type="text"
        placeholder="Ton prénom..."
        value={name}
        onChange={e => { setName(e.target.value); resetError(); }}
        autoFocus
        className={`w-full p-4 rounded-2xl text-center text-lg font-medium border outline-none transition-all ${t.inputBg}`}
      />

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        disabled={name.trim().length < 2}
        onClick={() => {
          if (name.trim().length < 2) { setError('Minimum 2 caractères.'); return; }
          resetError(); setPage('register-pin');
        }}
        className={`w-full py-4 rounded-[1.5rem] font-medium text-base active:scale-95 transition-all ${name.trim().length >= 2 ? t.btnPrimary : 'opacity-40 grayscale bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        Continuer →
      </button>
    </div>
  );

  // PAGE 4 — Inscription : Choisir PIN
  const renderRegisterPin = () => (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-bubble px-8">
      <div className="text-center">
        <h2 className={`text-3xl amow-font ${t.textMain}`}>Choisis ton PIN</h2>
        <p className={`${t.textMuted} text-sm mt-2 font-light`}>Entre 4 et 6 chiffres — retiens-le bien !</p>
      </div>

      <PinInput value={pin} onChange={setPin} label="Ton code secret" isDark={isDark} t={t} />

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        disabled={pin.length < 4}
        onClick={() => { resetError(); setPinConfirm(''); setPage('register-confirm'); }}
        className={`w-full py-4 rounded-[1.5rem] font-medium text-base active:scale-95 transition-all ${pin.length >= 4 ? t.btnPrimary : 'opacity-40 grayscale bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        Continuer →
      </button>
    </div>
  );

  // PAGE 5 — Inscription : Confirmation PIN
  const renderRegisterConfirm = () => (
    <div className="flex flex-col items-center justify-center h-full gap-8 animate-bubble px-8">
      <div className="text-center">
        <h2 className={`text-3xl amow-font ${t.textMain}`}>Confirme ton PIN</h2>
        <p className={`${t.textMuted} text-sm mt-2 font-light`}>Saisis à nouveau ton code pour confirmer</p>
      </div>

      <PinInput value={pinConfirm} onChange={setPinConfirm} label="Confirmation" isDark={isDark} t={t} />

      {error && <p className="text-red-400 text-sm text-center animate-in fade-in">{error}</p>}

      <button
  disabled={pinConfirm.length < 4 || loading}
  onClick={async () => {
    // ✅ Vérification AVANT de passer en loading
    if (pin !== pinConfirm) {
      setError('Les PIN ne correspondent pas. Réessaie 🔒');
      return;
    }
    setLoading(true); // ← seulement ici, après la vérif
    const result = await register(name, pin);
    setLoading(false);
    if (result.error) setError(result.error);
    else onAuth();
  }}
  className={`w-full py-4 rounded-[1.5rem] font-medium text-base active:scale-95 transition-all ${
    pinConfirm.length >= 4 ? t.btnPrimary : 'opacity-40 grayscale bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  {loading ? 'Création...' : 'Créer mon compte 🎉'}
</button>
    </div>
  );

  const canGoBack = page !== 'welcome';
  const backMap = {
    'login': 'welcome',
    'register-name': 'welcome',
    'register-pin': 'register-name',
    'register-confirm': 'register-pin',
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Bouton retour */}
      {canGoBack && (
        <button
          onClick={() => { resetError(); setPin(''); setPinConfirm(''); setPage(backMap[page]); }}
          className={`absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all border active:scale-95 z-10 ${t.btnSecondary}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Contenu */}
      <div className="flex-1">
        {page === 'welcome'          && renderWelcome()}
        {page === 'login'            && renderLogin()}
        {page === 'register-name'    && renderRegisterName()}
        {page === 'register-pin'     && renderRegisterPin()}
        {page === 'register-confirm' && renderRegisterConfirm()}
      </div>
    </div>
  );
}
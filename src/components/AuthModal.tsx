import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface Props {
  onClose: () => void;
  onAuth: () => void;
}

export default function AuthModal({ onClose, onAuth }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth();
      onClose();
    } catch (err: any) {
      const code = err.code;
      if (code === 'auth/email-already-in-use') setError('Этот email уже зарегистрирован');
      else if (code === 'auth/invalid-email') setError('Некорректный email');
      else if (code === 'auth/weak-password') setError('Пароль должен быть не менее 6 символов');
      else if (code === 'auth/invalid-credential') setError('Неверный email или пароль');
      else if (code === 'auth/user-not-found') setError('Пользователь не найден');
      else setError('Что-то пошло не попробуй ещё раз');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">✨</div>
            <h2 className="text-xl font-bold">{mode === 'login' ? 'Вход в Lookbook' : 'Регистрация'}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {mode === 'login' ? 'Войди чтобы увидеть свои образы' : 'Создай аккаунт для синхронизации'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none" placeholder="your@email.com" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none" placeholder="Минимум 6 символов" />
            </div>
            {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠️ {error}</p>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-gray-500 rounded-lg text-sm font-medium transition">
              {loading ? '⏳ Подожди...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="text-xs text-purple-400 hover:text-purple-300 transition">
              {mode === 'login' ? 'Нет аккаунта? Зарегистрируйся' : 'Уже есть аккаунт? Войди'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { signOut, auth };

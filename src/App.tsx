import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import { LookEntry, Category } from './types';
import { getAllEntries, addEntry, updateEntry, deleteEntry } from './db';
import Gallery from './components/Gallery';
import AddEntry from './components/AddEntry';
import EntryModal from './components/EntryModal';
import AuthModal from './components/AuthModal';
import DeployGuide from './components/DeployGuide';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<LookEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LookEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAllEntries(user.uid);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: {
    photo: string;
    category: Category;
    brand: string;
    season: string;
    showName: string;
    notes: string;
    tags: string[];
  }) => {
    if (!user) return;
    const entry = await addEntry({
      ...data,
      createdAt: Date.now(),
    }, user.uid);
    setEntries(prev => [entry, ...prev]);
    setShowAdd(false);
  };

  const handleUpdate = async (updated: LookEntry) => {
    if (!user) return;
    await updateEntry(updated, user.uid);
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
    setSelectedEntry(updated);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteEntry(id, user.uid);
    setEntries(prev => prev.filter(e => e.id !== id));
    setSelectedEntry(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setEntries([]);
  };

  const stats = {
    total: entries.length,
    like: entries.filter(e => e.category === 'like').length,
    recreate: entries.filter(e => e.category === 'recreate').length,
    ideas: entries.filter(e => e.category === 'ideas').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-pulse">✨</div>
          <p className="text-gray-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent mb-2">
            Fashion Lookbook
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            Твой модный блокнот с синхронизацией между устройствами
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full text-sm font-medium transition shadow-lg shadow-purple-500/20"
          >
            Войти или зарегистрироваться
          </button>
          <p className="text-xs text-gray-600 mt-4">
            Создай аккаунт чтобы сохранять образы в облаке
          </p>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={() => {}} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                ✨ Fashion Lookbook
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.email} • Облако
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(true)}
                className="px-3 py-2 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50 rounded-full text-sm transition flex items-center gap-1.5"
                title="Инструкция"
              >
                <span>🚀</span>
                <span className="hidden sm:inline text-gray-300">Деплой</span>
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-full text-sm font-medium transition shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
              >
                <span className="text-lg leading-none">+</span>
                <span className="hidden sm:inline">Добавить образ</span>
              </button>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 border border-slate-700 hover:border-red-500/50 hover:bg-slate-800/50 rounded-full text-sm transition text-gray-400 hover:text-red-400"
                title="Выйти"
              >
                🚪
              </button>
            </div>
          </div>
          {entries.length > 0 && (
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="text-gray-500">
                Всего: <span className="text-gray-300 font-medium">{stats.total}</span>
              </span>
              <span className="text-purple-400">💜 {stats.like}</span>
              <span className="text-amber-400">🧶 {stats.recreate}</span>
              <span className="text-cyan-400">💡 {stats.ideas}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Gallery entries={entries} onSelect={setSelectedEntry} />
      </main>

      {entries.length === 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 shadow-xl max-w-sm text-center">
          <p className="text-sm text-gray-300">
            Нажми <span className="text-purple-400 font-medium">+ Добавить образ</span> чтобы начать 👗
          </p>
        </div>
      )}

      {showAdd && (
  <AddEntry
    onAdd={handleAdd}
    onClose={() => setShowAdd(false)}
    existingBrands={[...new Set(entries.map(e => e.brand).filter(Boolean))]}
    existingSeasons={[...new Set(entries.map(e => e.season).filter(Boolean))]}
  />
)}
      {selectedEntry && (
        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {showGuide && <DeployGuide onClose={() => setShowGuide(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={() => {}} />}
    </div>
  );
}

export default App;

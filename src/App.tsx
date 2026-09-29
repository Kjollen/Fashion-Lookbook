import { useState, useEffect } from 'react';
import { LookEntry, Category } from './types';
import { getAllEntries, addEntry, updateEntry, deleteEntry } from './db';
import Gallery from './components/Gallery';
import AddEntry from './components/AddEntry';
import EntryModal from './components/EntryModal';
import DeployGuide from './components/DeployGuide';

function App() {
  const [entries, setEntries] = useState<LookEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LookEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await getAllEntries();
      setEntries(data);
    } catch (err) {
      console.error('Failed to load entries:', err);
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
    const entry: LookEntry = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: Date.now(),
    };
    await addEntry(entry);
    setEntries(prev => [entry, ...prev]);
    setShowAdd(false);
  };

  const handleUpdate = async (updated: LookEntry) => {
    await updateEntry(updated);
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
    setSelectedEntry(updated);
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
    setSelectedEntry(null);
  };

  const stats = {
    total: entries.length,
    like: entries.filter(e => e.category === 'like').length,
    recreate: entries.filter(e => e.category === 'recreate').length,
    ideas: entries.filter(e => e.category === 'ideas').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                ✨ Fashion Lookbook
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Твой модный блокнот</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGuide(true)}
                className="px-3 py-2 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50 rounded-full text-sm transition flex items-center gap-1.5"
                title="Как выложить на GitHub + Vercel"
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-3 animate-pulse">✨</div>
              <p className="text-gray-500 text-sm">Загрузка...</p>
            </div>
          </div>
        ) : (
          <Gallery entries={entries} onSelect={setSelectedEntry} />
        )}
      </main>

      {entries.length === 0 && !loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 shadow-xl max-w-sm text-center">
          <p className="text-sm text-gray-300">
            Нажми <span className="text-purple-400 font-medium">+ Добавить образ</span> чтобы начать 👗
          </p>
        </div>
      )}

      {showAdd && <AddEntry onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {selectedEntry && (
        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {showGuide && <DeployGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}

export default App;

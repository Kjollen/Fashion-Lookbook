import { useState } from 'react';
import { LookEntry, Category, CATEGORY_INFO } from '../types';

interface Props {
  entries: LookEntry[];
  onSelect: (entry: LookEntry) => void;
}

export default function Gallery({ entries, onSelect }: Props) {
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');

  const filtered = entries.filter((entry) => {
    if (filter !== 'all' && entry.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        entry.brand.toLowerCase().includes(q) ||
        entry.season.toLowerCase().includes(q) ||
        entry.showName.toLowerCase().includes(q) ||
        entry.notes.toLowerCase().includes(q) ||
        entry.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const counts = {
    all: entries.length,
    like: entries.filter(e => e.category === 'like').length,
    recreate: entries.filter(e => e.category === 'recreate').length,
    ideas: entries.filter(e => e.category === 'ideas').length,
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👗</div>
        <h3 className="text-xl font-bold text-gray-300 mb-2">Пока пусто</h3>
        <p className="text-gray-500 text-sm">Добавь свой первый образ с показа!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по бренду, тегам, заметкам..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
              filter === 'all'
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-slate-700 text-gray-500 hover:text-gray-300'
            }`}
          >
            Все ({counts.all})
          </button>
          {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
                filter === cat
                  ? `${CATEGORY_INFO[cat].bg} ${CATEGORY_INFO[cat].color} ${CATEGORY_INFO[cat].border}`
                  : 'border-slate-700 text-gray-500 hover:text-gray-300'
              }`}
            >
              {CATEGORY_INFO[cat].emoji} {CATEGORY_INFO[cat].label} ({counts[cat]})
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => setViewMode('masonry')}
            className={`w-7 h-7 rounded flex items-center justify-center text-xs transition ${
              viewMode === 'masonry' ? 'bg-purple-600/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            ▦
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`w-7 h-7 rounded flex items-center justify-center text-xs transition ${
              viewMode === 'grid' ? 'bg-purple-600/30 text-purple-300' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            ▣
          </button>
        </div>
      </div>

      {search && (
        <p className="text-xs text-gray-500 mb-4">
          Найдено: {filtered.length} {filtered.length === 1 ? 'образ' : filtered.length < 5 ? 'образа' : 'образов'}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Ничего не найдено</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((entry) => (
            <GridCard key={entry.id} entry={entry} onClick={() => onSelect(entry)} />
          ))}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((entry) => (
            <MasonryCard key={entry.id} entry={entry} onClick={() => onSelect(entry)} />
          ))}
        </div>
      )}
    </div>
  );
}

function GridCard({ entry, onClick }: { entry: LookEntry; onClick: () => void }) {
  const catInfo = CATEGORY_INFO[entry.category];
  return (
    <div
      onClick={onClick}
      className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-slate-800 border border-slate-700/50 hover:border-purple-500/30 transition"
    >
      <img
        src={entry.photo}
        alt=""
        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full ${catInfo.bg} ${catInfo.border} border flex items-center justify-center text-xs`}>
        {catInfo.emoji}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition">
        {entry.brand && <p className="text-xs text-white font-medium truncate">{entry.brand}</p>}
        {entry.notes && <p className="text-xs text-gray-300 truncate mt-0.5">{entry.notes}</p>}
      </div>
    </div>
  );
}

function MasonryCard({ entry, onClick }: { entry: LookEntry; onClick: () => void }) {
  const catInfo = CATEGORY_INFO[entry.category];
  return (
    <div
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden cursor-pointer bg-slate-800 border border-slate-700/50 hover:border-purple-500/30 transition break-inside-avoid"
    >
      <img
        src={entry.photo}
        alt=""
        className="w-full object-cover group-hover:scale-105 transition duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full ${catInfo.bg} ${catInfo.border} border flex items-center justify-center text-xs`}>
        {catInfo.emoji}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition">
        {entry.brand && <p className="text-xs text-white font-medium truncate">{entry.brand}</p>}
        {entry.notes && <p className="text-xs text-gray-300 truncate mt-0.5">{entry.notes}</p>}
        {entry.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {entry.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] text-purple-300">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

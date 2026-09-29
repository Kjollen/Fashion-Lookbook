import { useState } from 'react';
import { LookEntry, Category, CATEGORY_INFO } from '../types';

interface Props {
  entry: LookEntry;
  onClose: () => void;
  onUpdate: (entry: LookEntry) => void;
  onDelete: (id: string) => void;
}

export default function EntryModal({ entry, onClose, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(entry.notes);
  const [tags, setTags] = useState(entry.tags.join(' '));
  const [brand, setBrand] = useState(entry.brand);
  const [season, setSeason] = useState(entry.season);
  const [showName, setShowName] = useState(entry.showName);
  const [category, setCategory] = useState<Category>(entry.category);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...entry,
      notes,
      tags: tags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean),
      brand,
      season,
      showName,
      category,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(entry.id);
    } else {
      setConfirmDelete(true);
    }
  };

  const catInfo = CATEGORY_INFO[entry.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={entry.photo}
            alt="Look"
            className="w-full max-h-[50vh] object-contain bg-black rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition"
          >
            ✕
          </button>
          <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-sm ${catInfo.bg} ${catInfo.color} border ${catInfo.border}`}>
            {catInfo.emoji} {catInfo.label}
          </div>
        </div>

        <div className="p-6">
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Категория</label>
                <div className="flex gap-2">
                  {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition ${
                        category === cat
                          ? `${CATEGORY_INFO[cat].bg} ${CATEGORY_INFO[cat].color} ${CATEGORY_INFO[cat].border}`
                          : 'border-slate-700 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {CATEGORY_INFO[cat].emoji} {CATEGORY_INFO[cat].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Бренд</label>
                  <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    placeholder="Chanel, Dior..."
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Сезон</label>
                  <input
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                    placeholder="FW 2026, SS 2025..."
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Показ</label>
                <input
                  value={showName}
                  onChange={(e) => setShowName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  placeholder="Название показа"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Заметки</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Что хочется повторить, какие материалы, идеи..."
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Теги (через пробел или запятую)</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
                  placeholder="вязание оверсайз бежевый..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setNotes(entry.notes);
                    setTags(entry.tags.join(' '));
                    setBrand(entry.brand);
                    setSeason(entry.season);
                    setShowName(entry.showName);
                    setCategory(entry.category);
                  }}
                  className="px-4 py-2 border border-slate-700 hover:bg-slate-800 rounded-lg text-sm transition"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.brand && (
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-gray-300">
                    👤 {entry.brand}
                  </span>
                )}
                {entry.season && (
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-gray-300">
                    📅 {entry.season}
                  </span>
                )}
                {entry.showName && (
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-gray-300">
                    🎭 {entry.showName}
                  </span>
                )}
              </div>

              {entry.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{entry.notes}</p>
                </div>
              )}

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {entry.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 mb-4">
                Добавлено: {new Date(entry.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setEditing(true)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition"
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={handleDelete}
                  className={`px-4 py-2 rounded-lg text-sm transition border ${
                    confirmDelete
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'border-slate-700 text-gray-400 hover:text-red-400 hover:border-red-500/30'
                  }`}
                >
                  {confirmDelete ? 'Точно удалить?' : '🗑️'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { Category, CATEGORY_INFO } from '../types';

interface Props {
  onAdd: (data: {
    photo: string;
    category: Category;
    brand: string;
    season: string;
    showName: string;
    notes: string;
    tags: string[];
  }) => void;
  onClose: () => void;
}

export default function AddEntry({ onAdd, onClose }: Props) {
  const [photo, setPhoto] = useState<string>('');
  const [category, setCategory] = useState<Category>('like');
  const [brand, setBrand] = useState('');
  const [season, setSeason] = useState('');
  const [showName, setShowName] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        break;
      }
    }
  };

  const handleSubmit = () => {
    if (!photo) return;
    onAdd({
      photo,
      category,
      brand: brand.trim(),
      season: season.trim(),
      showName: showName.trim(),
      notes: notes.trim(),
      tags: tags.split(/[\s,]+/).map(t => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onPaste={handlePaste}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-bold">✨ Новый образ</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 transition"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!photo ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                dragOver
                  ? 'border-purple-400 bg-purple-500/10'
                  : 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-4xl mb-3">📸</div>
              <p className="text-gray-300 text-sm mb-1">Нажми, перетащи или вставь фото</p>
              <p className="text-gray-500 text-xs">(Ctrl+V тоже работает)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          ) : (
            <div className="relative group">
              <img
                src={photo}
                alt="Preview"
                className="w-full max-h-64 object-contain bg-black rounded-xl"
              />
              <button
                onClick={() => setPhoto('')}
                className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Категория</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition text-center ${
                    category === cat
                      ? `${CATEGORY_INFO[cat].bg} ${CATEGORY_INFO[cat].color} ${CATEGORY_INFO[cat].border}`
                      : 'border-slate-700 text-gray-500 hover:text-gray-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-lg block mb-0.5">{CATEGORY_INFO[cat].emoji}</span>
                  {CATEGORY_INFO[cat].label}
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
                placeholder="FW 2026..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Показ</label>
            <input
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              placeholder="Название показа (необязательно)"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Заметки</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Что нравится, какие материалы, идеи для повторения..."
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Теги (через пробел)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              placeholder="вязание оверсайз бежевый многослойность..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!photo}
            className={`w-full py-3 rounded-xl font-medium text-sm transition ${
              photo
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {photo ? '✨ Сохранить образ' : 'Добавь фото'}
          </button>
        </div>
      </div>
    </div>
  );
}

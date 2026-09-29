import { useState, useRef, useEffect } from 'react';
import { Category, CATEGORY_INFO } from '../types';

interface Props {
  onAdd: ( {
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

  // Глобальный обработчик вставки из буфера
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
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
              <p className="text-gray-500 text-xs">(Ctrl+V работает откуда угодно)</p>
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
                className="absolute top-2 right-2

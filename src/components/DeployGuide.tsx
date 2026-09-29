import { useState } from 'react';

interface Props {
  onClose: () => void;
}

interface Step {
  id: string;
  emoji: string;
  title: string;
  description: string;
  tip?: string;
  link?: { url: string; label: string };
  substeps?: string[];
}

const steps: Step[] = [
  {
    id: 'github-account',
    emoji: '🐙',
    title: 'Создай аккаунт на GitHub',
    description: 'Если ещё нет — зарегистрируйся на github.com. Это бесплатно.',
    link: { url: 'https://github.com/signup', label: 'github.com/signup' },
    tip: 'Выбери короткий и понятный ник',
  },
  {
    id: 'vercel-account',
    emoji: '▲',
    title: 'Зарегистрируйся на Vercel',
    description: 'Vercel — платформа для хостинга. Заходи через GitHub.',
    link: { url: 'https://vercel.com/signup', label: 'vercel.com/signup' },
    tip: 'Нажми "Continue with GitHub"',
  },
  {
    id: 'create-repo',
    emoji: '📦',
    title: 'Создай репозиторий',
    description: 'На GitHub нажми "New repository". Имя: fashion-lookbook. НЕ ставь галочку "Add README".',
    link: { url: 'https://github.com/new', label: 'github.com/new' },
  },
  {
    id: 'upload-files',
    emoji: '📁',
    title: 'Создай файлы проекта',
    description: 'Создавай файлы через "Add file → Create new file" прямо на GitHub.',
    substeps: [
      'Нажми "Add file → Create new file"',
      'Введи имя файла (например: package.json)',
      'Вставь код в большое поле',
      'Нажми "Commit new file"',
      'Повтори для каждого файла',
    ],
    tip: 'Можешь спросить у меня код для любого файла!',
  },
  {
    id: 'vercel-import',
    emoji: '🚀',
    title: 'Подключи Vercel',
    description: 'Vercel возьмёт код и сделает сайт.',
    substeps: [
      'Зайди на vercel.com/new',
      'Найди свой репозиторий',
      'Нажми "Import"',
      'Нажми "Deploy"',
      'Подожди 1-2 минуты',
    ],
    tip: 'Vercel даст ссылку вида fashion-lookbook.vercel.app',
    link: { url: 'https://vercel.com/new', label: 'vercel.com/new' },
  },
  {
    id: 'done',
    emoji: '🎉',
    title: 'Готово!',
    description: 'Твой сайт в интернете! Делись с друзьями.',
    tip: 'Для обновления — редактируй файлы на GitHub, Vercel подхватит сам!',
  },
];

export default function DeployGuide({ onClose }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleStep = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((completed.size / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 p-5 z-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">🚀 Выкладываем сайт в интернет</h2>
              <p className="text-xs text-gray-500 mt-0.5">Без Git и терминалов — всё через браузер</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 hover:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 transition">✕</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">{completed.size}/{steps.length} {progress === 100 ? '🎉' : ''}</span>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {steps.map((step, index) => {
            const isDone = completed.has(step.id);
            return (
              <div key={step.id} className={`border rounded-xl p-4 transition ${isDone ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800/30 border-slate-700/50'}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleStep(step.id)} className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition mt-0.5 ${isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-600 hover:border-purple-500'}`}>
                    {isDone && <span className="text-xs">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
                      <span className="text-lg">{step.emoji}</span>
                      <h3 className={`font-bold text-sm ${isDone ? 'text-gray-400 line-through' : 'text-white'}`}>{step.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-2">{step.description}</p>
                    {step.substeps && (
                      <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3 mb-2 space-y-2">
                        {step.substeps.map((sub, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                            <span className="text-purple-400 font-mono flex-shrink-0 mt-px">{i + 1}.</span>
                            <span>{sub}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {step.link && (
                      <a href={step.link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition mb-2">
                        🔗 {step.link.label} <span className="text-[10px]">↗</span>
                      </a>
                    )}
                    {step.tip && (
                      <p className="text-xs text-amber-300/70 flex items-start gap-1.5 mt-1">
                        <span className="flex-shrink-0">💡</span>
                        <span>{step.tip}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 p-4">
          {progress === 100 ? (
            <div className="text-center">
              <p className="text-green-400 font-medium text-sm">🎉 Всё готово! Твой сайт в интернете!</p>
            </div>
          ) : (
            <p className="text-center text-xs text-gray-500">Отмечай шаги по мере выполнения ✨</p>
          )}
        </div>
      </div>
    </div>
  );
}

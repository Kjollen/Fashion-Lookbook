export type Category = 'like' | 'recreate' | 'ideas';

export interface LookEntry {
  id: string;
  photo: string;
  category: Category;
  brand: string;
  season: string;
  showName: string;
  notes: string;
  tags: string[];
  createdAt: number;
}

export const CATEGORY_INFO: Record<Category, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  like: {
    label: 'Нравится',
    emoji: '💜',
    color: 'text-purple-300',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
  },
  recreate: {
    label: 'Хочу повторить',
    emoji: '🧶',
    color: 'text-amber-300',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/30',
  },
  ideas: {
    label: 'Идеи и стилизации',
    emoji: '💡',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
  },
};

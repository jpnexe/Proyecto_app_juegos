import React from 'react';
import { Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  categories: { id: string; label: string; count: number }[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-primary to-y2k-cyan text-y2k-bg shadow-neon-blue font-extrabold scale-105'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:border-y2k-chrome/40 hover:text-white'
            }`}
          >
            {isActive && <Sparkles className="w-3 h-3 text-y2k-bg" />}
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-y2k-bg/30 text-y2k-bg' : 'bg-white/10 text-gray-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

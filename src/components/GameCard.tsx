import React from 'react';
import { Play, Star, Users, Flame } from 'lucide-react';
import type { GameItem } from '../types/game';

interface GameCardProps {
  game: GameItem;
  onPlay: (game: GameItem) => void;
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  hard: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
};

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <article className="y2k-glass rounded-2xl overflow-hidden border border-y2k-chrome/30 hover:border-y2k-cyan transition-all duration-300 hover:-translate-y-1.5 hover:shadow-neon-cyan flex flex-col group">
      {/* Thumbnail Header */}
      <div className="relative h-44 w-full overflow-hidden bg-black/40">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-85 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-y2k-bg via-transparent to-black/40" />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/60 border border-white/20 text-white backdrop-blur-sm">
            {game.releaseYear}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${
              difficultyColors[game.difficulty] || 'bg-white/20 text-white'
            }`}
          >
            {game.difficulty}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/70 border border-amber-400/40 text-amber-300 backdrop-blur-sm">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span>{game.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-y2k-cyan font-bold tracking-wider uppercase mb-1">
            <Flame className="w-3 h-3" />
            <span>{game.category}</span>
          </div>
          <h2 className="text-base font-extrabold text-white group-hover:text-y2k-cyan transition-colors mb-1.5 line-clamp-1">
            {game.title}
          </h2>
          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-4">
            {game.description}
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>{game.playsCount.toLocaleString()} jugadas</span>
          </div>

          <button
            type="button"
            onClick={() => onPlay(game)}
            className="y2k-btn-bubble px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Jugar</span>
          </button>
        </div>
      </div>
    </article>
  );
};

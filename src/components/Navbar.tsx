import React from 'react';
import { Gamepad2, Sparkles, Search, X } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenGlobalLeaderboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenGlobalLeaderboard,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full y2k-glass border-b border-y2k-chrome/20 backdrop-blur-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-y2k-cyan to-y2k-accent p-0.5 shadow-neon-blue flex items-center justify-center">
            <div className="w-full h-full bg-y2k-bg rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-y2k-cyan" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider chrome-gradient">
                RETROPLAY
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-y2k-cyan font-bold uppercase tracking-widest">
                Y2K
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono tracking-tight">
              SITIO ESTÁTICO DE VIDEOJUEGOS RETRO
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título o etiqueta..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-sm bg-white/5 border border-y2k-chrome/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-y2k-cyan focus:ring-1 focus:ring-y2k-cyan transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Global Leaderboard CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenGlobalLeaderboard}
            className="y2k-btn-bubble px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-neon-cyan"
          >
            <Sparkles className="w-3.5 h-3.5 text-y2k-cyan animate-spin" />
            <span>TOP JUGADORES</span>
          </button>
        </div>
      </div>
    </header>
  );
};

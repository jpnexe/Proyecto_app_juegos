import React from 'react';
import { Gamepad2, Sparkles, Terminal, Flame } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-y2k-bg text-y2k-white flex flex-col items-center justify-center p-6 selection:bg-y2k-cyan selection:text-y2k-bg">
      <div className="y2k-glass rounded-2xl p-8 max-w-xl w-full border border-y2k-chrome/30 shadow-chrome relative overflow-hidden text-center">
        {/* Glow corner effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-y2k-accent/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-y2k-cyan text-xs font-semibold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5 text-y2k-cyan animate-pulse" />
          Fase 1 Inicializada • Y2K Retro Arcade
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          <span className="chrome-gradient">RETROPLAY</span>{' '}
          <span className="text-y2k-cyan drop-shadow-[0_0_12px_rgba(125,249,255,0.7)]">ONLINE</span>
        </h1>

        <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed">
          Plataforma estática de videojuegos retro clásicos. Construida con React, TypeScript y estética cibernética Y2K.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-left">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-y2k-cyan/40 transition-colors">
            <Gamepad2 className="w-5 h-5 text-y2k-cyan mb-2" />
            <h3 className="text-xs font-bold text-white">10 Juegos</h3>
            <p className="text-[11px] text-gray-400">Catálogo retro</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors">
            <Terminal className="w-5 h-5 text-primary mb-2" />
            <h3 className="text-xs font-bold text-white">Jamstack</h3>
            <p className="text-[11px] text-gray-400">100% Estático</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-y2k-accent/40 transition-colors">
            <Flame className="w-5 h-5 text-y2k-accent mb-2" />
            <h3 className="text-xs font-bold text-white">Y2K Style</h3>
            <p className="text-[11px] text-gray-400">Cromado neón</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="y2k-btn-bubble px-6 py-2.5 rounded-xl font-bold text-sm text-white inline-flex items-center gap-2 cursor-pointer"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Setup Completado con Éxito</span>
        </button>
      </div>

      <footer className="mt-8 text-xs text-gray-500 font-mono">
        Vite + React 19 + TypeScript + Tailwind CSS
      </footer>
    </div>
  );
};

export default App;

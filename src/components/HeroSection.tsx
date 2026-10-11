import React from 'react';
import { Gamepad2, Sparkles, Terminal, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  totalGames: number;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ totalGames, onExplore }) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-12 px-4 text-center">
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        {/* Glow Badges */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full y2k-glass border border-y2k-cyan/40 text-y2k-cyan text-xs font-bold uppercase tracking-wider mb-6 shadow-neon-blue">
          <Sparkles className="w-4 h-4 text-y2k-cyan animate-pulse" />
          <span>ESTILO Y2K ARCADE • JAMSTACK EDGE</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-none">
          <span className="chrome-gradient">LOS MEJORES JUEGOS</span>
          <br />
          <span className="text-y2k-cyan drop-shadow-[0_0_20px_rgba(125,249,255,0.7)]">
            RETRO ONLINE
          </span>
        </h1>

        <p className="text-sm md:text-base text-gray-300 max-w-2xl mb-8 leading-relaxed">
          Revive la era dorada de los videojuegos de los años 80, 90 y 2000. Catálogo instantáneo sin inicio de sesión ni descargas, directamente desde tu navegador.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300 mb-8">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Gamepad2 className="w-4 h-4 text-y2k-cyan" />
            <span>{totalGames} Juegos Clásicos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Terminal className="w-4 h-4 text-primary" />
            <span>100% Estático Jamstack</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cero Registro Requerido</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onExplore}
          className="y2k-btn-bubble px-8 py-3 rounded-2xl text-sm font-black text-white inline-flex items-center gap-2 cursor-pointer shadow-neon-blue hover:scale-105 transition-transform"
        >
          <Gamepad2 className="w-5 h-5" />
          <span>EXPLORAR CATÁLOGO COMPLETO</span>
        </button>
      </div>
    </section>
  );
};

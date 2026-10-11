import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, Sparkles } from 'lucide-react';
import type { GameItem } from '../../types/game';

interface GenericRetroSimulatorProps {
  game: GameItem;
  onGameOver: (score: number) => void;
}

export const GenericRetroSimulator: React.FC<GenericRetroSimulatorProps> = ({
  game,
  onGameOver,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [combo, setCombo] = useState<number>(1);

  const startSession = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCombo(1);
  };

  const handleActionClick = () => {
    if (!isPlaying) return;
    setScore((prev) => prev + 150 * combo);
    setCombo((c) => Math.min(c + 1, 8));
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          onGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, score, onGameOver]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center justify-between w-full max-w-sm px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <span className="text-y2k-cyan font-bold">PUNTOS: {score}</span>
        <span className="text-amber-300 font-bold">COMBO: x{combo}</span>
        <span className="text-rose-400 font-bold">TIEMPO: {timeLeft}s</span>
      </div>

      <div className="relative w-full max-w-sm h-72 rounded-2xl overflow-hidden border-2 border-y2k-chrome/40 shadow-chrome bg-black flex flex-col justify-between p-4">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[1px]" style={{ backgroundImage: `url(${game.thumbnail})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

        <div className="relative z-10 flex justify-between items-center">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/40 border border-primary text-y2k-cyan uppercase">
            {game.title}
          </span>
          <span className="text-[10px] font-mono text-gray-400">ARCADE ENGINE V1</span>
        </div>

        <div className="relative z-10 text-center my-auto">
          {!isPlaying ? (
            <div className="flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-y2k-accent animate-bounce" />
              <p className="text-xs text-gray-200 max-w-xs">
                Modo Arcade interactivo. Presiona el botón de acción para acumular combos antes de que acabe el tiempo.
              </p>
              <button
                type="button"
                onClick={startSession}
                className="y2k-btn-bubble px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>INICIAR SIMULADOR</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-black chrome-gradient tracking-wider">
                {score} PTS
              </div>
              <button
                type="button"
                onClick={handleActionClick}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-y2k-cyan border-4 border-white/60 shadow-neon-cyan active:scale-95 transition-transform flex flex-col items-center justify-center text-y2k-bg font-black text-sm cursor-pointer"
              >
                <Zap className="w-6 h-6 mb-1" />
                ¡PULSAR!
              </button>
            </div>
          )}
        </div>

        {timeLeft === 0 && !isPlaying && (
          <div className="relative z-10 flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-xs text-y2k-accent font-bold">¡Partida concluida!</span>
            <button
              type="button"
              onClick={startSession}
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Repetir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

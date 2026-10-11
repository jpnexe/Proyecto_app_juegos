import React from 'react';
import { X, Trophy, Sparkles } from 'lucide-react';
import type { GameItem, GameScore } from '../types/game';

interface GlobalLeaderboardModalProps {
  games: GameItem[];
  onClose: () => void;
}

export const GlobalLeaderboardModal: React.FC<GlobalLeaderboardModalProps> = ({
  games,
  onClose,
}) => {
  const getStoredScores = (): GameScore[] => {
    try {
      const data = localStorage.getItem('retroplay_scores_v1');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const scores = getStoredScores()
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  const getGameTitle = (gameId: string): string => {
    const found = games.find((g) => g.id === gameId);
    return found ? found.title : gameId;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="y2k-glass rounded-3xl border border-y2k-chrome/40 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-chrome">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-y2k-accent animate-pulse" />
            <h2 className="text-base font-black text-white chrome-gradient">
              SALÓN DE LA FAMA RETRO (TOP GLOBAL)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {scores.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              <Sparkles className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p>Todavía no hay puntuaciones globales registradas.</p>
              <p className="mt-1 text-gray-500">¡Juega cualquier título del catálogo para inaugurar el podio!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scores.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold w-6 ${idx === 0 ? 'text-y2k-accent text-sm' : 'text-gray-400'}`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-white">{s.playerName}</p>
                      <p className="text-[10px] text-gray-400">{getGameTitle(s.gameId)}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-y2k-cyan text-sm">
                    {s.score.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

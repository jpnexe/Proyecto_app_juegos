import React, { useState } from 'react';
import { X, Trophy, Gamepad2, Info, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type { GameItem, GameScore, SubmitScoreDto } from '../types/game';
import { SnakeGame } from './games/SnakeGame';
import { PongGame } from './games/PongGame';
import { GenericRetroSimulator } from './games/GenericRetroSimulator';

interface GameModalProps {
  game: GameItem;
  leaderboard: GameScore[];
  onClose: () => void;
  onSubmitScore: (dto: SubmitScoreDto) => Promise<boolean>;
}

export const GameModal: React.FC<GameModalProps> = ({
  game,
  leaderboard,
  onClose,
  onSubmitScore,
}) => {
  const [activeTab, setActiveTab] = useState<'play' | 'info' | 'leaderboard'>('play');
  const [playerName, setPlayerName] = useState<string>('');
  const [latestScore, setLatestScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<{ text: string; error: boolean } | null>(null);

  const handleGameOver = (score: number) => {
    setLatestScore(score);
    if (score > 0) {
      setSubmitMessage({ text: `¡Puntaje registrado: ${score}! Ingresa tu apodo para guardarlo.`, error: false });
    }
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length < 2) {
      setSubmitMessage({ text: 'El nombre debe tener al menos 2 caracteres.', error: true });
      return;
    }
    setIsSubmitting(true);
    const success = await onSubmitScore({
      gameId: game.id,
      playerName: playerName.trim(),
      score: latestScore > 0 ? latestScore : 500,
    });
    setIsSubmitting(false);

    if (success) {
      setSubmitMessage({ text: '¡Puntuación guardada con éxito en el salón de la fama!', error: false });
      setPlayerName('');
      setActiveTab('leaderboard');
    } else {
      setSubmitMessage({ text: 'Error al enviar la puntuación. Inténtalo de nuevo.', error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="y2k-glass rounded-3xl border border-y2k-chrome/40 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-chrome">
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-y2k-cyan">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white chrome-gradient">{game.title}</h2>
              <span className="text-[11px] text-gray-400 font-mono">{game.releaseYear} • {game.category.toUpperCase()}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/20 px-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('play')}
            className={`py-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'play' ? 'border-y2k-cyan text-y2k-cyan' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" /> Jugar en Vivo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`py-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'leaderboard' ? 'border-y2k-cyan text-y2k-cyan' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Récords ({leaderboard.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'info' ? 'border-y2k-cyan text-y2k-cyan' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" /> Ficha Técnica
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'play' && (
            <div className="flex flex-col items-center">
              {game.slug === 'snake' ? (
                <SnakeGame onGameOver={handleGameOver} />
              ) : game.slug === 'pong' ? (
                <PongGame onGameOver={handleGameOver} />
              ) : (
                <GenericRetroSimulator game={game} onGameOver={handleGameOver} />
              )}

              {/* Submit score form */}
              <form onSubmit={handleScoreSubmit} className="mt-4 w-full max-w-sm p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tu apodo de jugador..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-black/40 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-y2k-cyan"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="y2k-btn-bubble px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    <span>Guardar</span>
                  </button>
                </div>
                {submitMessage && (
                  <p className={`text-[11px] flex items-center gap-1 ${submitMessage.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {submitMessage.error ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {submitMessage.text}
                  </p>
                )}
              </form>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-y2k-cyan flex items-center gap-2">
                <Trophy className="w-4 h-4 text-y2k-accent" />
                Tabla de Mejores Puntuaciones: {game.title}
              </h3>
              {leaderboard.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  Aún no hay récords guardados para este juego. ¡Sé el primero en jugar y registrar el tuyo!
                </p>
              ) : (
                <div className="space-y-1.5">
                  {leaderboard.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 text-center font-bold font-mono ${idx === 0 ? 'text-y2k-accent text-sm' : 'text-gray-400'}`}>
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-white">{item.playerName}</span>
                      </div>
                      <span className="font-mono font-bold text-y2k-cyan">{item.score.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 text-xs text-gray-300">
              <p className="leading-relaxed">{game.description}</p>
              <div>
                <h4 className="font-bold text-white mb-2">Instrucciones de Juego:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  {game.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Controles Asignados:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {game.controls.map((ctrl, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 flex justify-between">
                      <span className="font-mono text-y2k-cyan">{ctrl.key}</span>
                      <span className="text-gray-400">{ctrl.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

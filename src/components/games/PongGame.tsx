import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface PongGameProps {
  onGameOver: (score: number) => void;
}

export const PongGame: React.FC<PongGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const gameState = useRef({
    playerY: 150,
    aiY: 150,
    ballX: 180,
    ballY: 180,
    ballSpeedX: 4,
    ballSpeedY: 3,
    paddleHeight: 60,
    paddleWidth: 10,
  });

  const resetMatch = () => {
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setIsRunning(true);
    gameState.current.ballX = 180;
    gameState.current.ballY = 180;
    gameState.current.ballSpeedX = 4;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    gameState.current.playerY = Math.max(0, Math.min(canvas.height - 60, mouseY - 30));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const touchY = e.touches[0].clientY - rect.top;
    gameState.current.playerY = Math.max(0, Math.min(canvas.height - 60, touchY - 30));
  };

  const updateGame = useCallback(() => {
    const state = gameState.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Move Ball
    state.ballX += state.ballSpeedX;
    state.ballY += state.ballSpeedY;

    // Top and Bottom Wall bounce
    if (state.ballY <= 6 || state.ballY >= canvas.height - 6) {
      state.ballSpeedY = -state.ballSpeedY;
    }

    // AI Simple tracking
    const aiCenter = state.aiY + state.paddleHeight / 2;
    if (aiCenter < state.ballY - 15) {
      state.aiY += 3.2;
    } else if (aiCenter > state.ballY + 15) {
      state.aiY -= 3.2;
    }
    state.aiY = Math.max(0, Math.min(canvas.height - state.paddleHeight, state.aiY));

    // Player Paddle Collision (left)
    if (
      state.ballX <= 25 &&
      state.ballY >= state.playerY &&
      state.ballY <= state.playerY + state.paddleHeight
    ) {
      state.ballSpeedX = Math.abs(state.ballSpeedX) * 1.05;
      const deltaY = state.ballY - (state.playerY + state.paddleHeight / 2);
      state.ballSpeedY = deltaY * 0.2;
    }

    // AI Paddle Collision (right)
    if (
      state.ballX >= canvas.width - 25 &&
      state.ballY >= state.aiY &&
      state.ballY <= state.aiY + state.paddleHeight
    ) {
      state.ballSpeedX = -Math.abs(state.ballSpeedX);
    }

    // Point scoring
    if (state.ballX < 0) {
      setAiScore((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          setGameOver(true);
          setIsRunning(false);
          onGameOver(playerScore * 200);
        }
        return next;
      });
      state.ballX = canvas.width / 2;
      state.ballY = canvas.height / 2;
      state.ballSpeedX = 4;
    } else if (state.ballX > canvas.width) {
      setPlayerScore((prev) => {
        const next = prev + 1;
        if (next >= 5) {
          setGameOver(true);
          setIsRunning(false);
          onGameOver(next * 500);
        }
        return next;
      });
      state.ballX = canvas.width / 2;
      state.ballY = canvas.height / 2;
      state.ballSpeedX = -4;
    }
  }, [playerScore, onGameOver]);

  useEffect(() => {
    if (!isRunning || gameOver) return;
    const interval = setInterval(updateGame, 1000 / 60);
    return () => clearInterval(interval);
  }, [isRunning, gameOver, updateGame]);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = gameState.current;

    ctx.fillStyle = '#0a0a16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center dotted line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player Paddle (Cyan)
    ctx.fillStyle = '#7DF9FF';
    ctx.fillRect(15, s.playerY, s.paddleWidth, s.paddleHeight);

    // AI Paddle (Orange)
    ctx.fillStyle = '#ffa857';
    ctx.fillRect(canvas.width - 25, s.aiY, s.paddleWidth, s.paddleHeight);

    // Ball
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, 6, 0, Math.PI * 2);
    ctx.fill();
  }, [playerScore, aiScore]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-sm px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
        <span className="text-y2k-cyan font-bold">JUGADOR: {playerScore}</span>
        <span className="text-gray-400">PRIMERO A 5 PTS</span>
        <span className="text-y2k-accent font-bold">IA: {aiScore}</span>
      </div>

      <div className="relative border-2 border-primary/40 rounded-2xl overflow-hidden shadow-neon-blue">
        <canvas
          ref={canvasRef}
          width={360}
          height={320}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="block bg-[#0a0a16] cursor-ns-resize"
        />

        {!isRunning && !gameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-black text-white mb-2 chrome-gradient">PONG CLÁSICO 1972</h3>
            <p className="text-xs text-gray-300 text-center mb-4">Mueve el mouse o el dedo verticalmente para controlar la paleta.</p>
            <button
              type="button"
              onClick={resetMatch}
              className="y2k-btn-bubble px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>INICIAR PARTIDA</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <h3 className="text-xl font-black mb-1 text-y2k-cyan">
              {playerScore >= 5 ? '¡VICTORIA! 🏆' : '¡DERROTA! 👾'}
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              Marcador: {playerScore} - {aiScore}
            </p>
            <button
              type="button"
              onClick={resetMatch}
              className="y2k-btn-bubble px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>JUGAR DE NUEVO</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

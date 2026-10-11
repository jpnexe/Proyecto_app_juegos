import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Award } from 'lucide-react';

interface SnakeGameProps {
  onGameOver: (score: number) => void;
}

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const SnakeGame: React.FC<SnakeGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const collision = currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y);
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsRunning(true);
    setFood(spawnFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isRunning) return;
      const keyMap: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 },
        KeyW: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        KeyS: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        KeyA: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        KeyD: { x: 1, y: 0 },
      };

      const newDir = keyMap[e.code];
      if (newDir) {
        e.preventDefault();
        setDirection((prev) => {
          if (prev.x + newDir.x === 0 && prev.y + newDir.y === 0) return prev;
          return newDir;
        });
      }
    },
    [isRunning]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Main game tick
  useEffect(() => {
    if (!isRunning || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check Wall or Self Collision
        const hitWall = head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
        const hitSelf = prevSnake.some((p) => p.x === head.x && p.y === head.y);

        if (hitWall || hitSelf) {
          setGameOver(true);
          setIsRunning(false);
          onGameOver(score);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 100);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isRunning, gameOver, direction, food, score, onGameOver, spawnFood]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f0f1c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    const cellW = canvas.width / GRID_SIZE;
    const cellH = canvas.height / GRID_SIZE;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(canvas.width, i * cellH);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ffa857';
    ctx.shadowColor = '#ffa857';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      food.x * cellW + cellW / 2,
      food.y * cellH + cellH / 2,
      cellW / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    ctx.shadowColor = '#7DF9FF';
    ctx.shadowBlur = 8;
    snake.forEach((segment, idx) => {
      ctx.fillStyle = idx === 0 ? '#7DF9FF' : '#3B82F6';
      ctx.fillRect(
        segment.x * cellW + 1,
        segment.y * cellH + 1,
        cellW - 2,
        cellH - 2
      );
    });
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full max-w-sm px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
        <span className="text-gray-400">Puntos: <strong className="text-y2k-cyan text-sm">{score}</strong></span>
        <span className="text-gray-400">Velocidad: <strong className="text-white">Normal</strong></span>
      </div>

      <div className="relative border-2 border-y2k-cyan/40 rounded-2xl overflow-hidden shadow-neon-cyan">
        <canvas ref={canvasRef} width={360} height={360} className="block bg-[#0f0f1c]" />

        {!isRunning && !gameOver && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <h3 className="text-lg font-black text-white mb-2 chrome-gradient">SNAKE CLÁSICO</h3>
            <p className="text-xs text-gray-300 text-center mb-4">Usa WASD o las flechas para mover la serpiente.</p>
            <button
              type="button"
              onClick={resetGame}
              className="y2k-btn-bubble px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>INICIAR PARTIDA</span>
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <h3 className="text-xl font-black text-rose-400 mb-1">¡FIN DEL JUEGO!</h3>
            <p className="text-sm text-gray-300 mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-y2k-accent" />
              Puntaje final: <strong className="text-y2k-accent">{score} pts</strong>
            </p>
            <button
              type="button"
              onClick={resetGame}
              className="y2k-btn-bubble px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>JUGAR DE NUEVO</span>
            </button>
          </div>
        )}
      </div>

      {/* Touch D-Pad */}
      <div className="grid grid-cols-3 gap-2 w-48 pt-2">
        <div />
        <button
          type="button"
          onClick={() => setDirection({ x: 0, y: -1 })}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-y2k-cyan/20 active:scale-95 text-white font-bold text-sm border border-white/20"
        >
          ▲
        </button>
        <div />
        <button
          type="button"
          onClick={() => setDirection({ x: -1, y: 0 })}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-y2k-cyan/20 active:scale-95 text-white font-bold text-sm border border-white/20"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => setDirection({ x: 0, y: 1 })}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-y2k-cyan/20 active:scale-95 text-white font-bold text-sm border border-white/20"
        >
          ▼
        </button>
        <button
          type="button"
          onClick={() => setDirection({ x: 1, y: 0 })}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-y2k-cyan/20 active:scale-95 text-white font-bold text-sm border border-white/20"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

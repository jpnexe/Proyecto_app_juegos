import React, { useState, useMemo, useRef } from 'react';
import { Gamepad2, AlertCircle, RefreshCw } from 'lucide-react';
import { useGames } from './hooks/useGames';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { GameCard } from './components/GameCard';
import { GameModal } from './components/GameModal';
import { GlobalLeaderboardModal } from './components/GlobalLeaderboardModal';
import type { GameItem } from './types/game';

export const App: React.FC = () => {
  const {
    games,
    selectedGame,
    leaderboard,
    isLoading,
    error,
    activeCategory,
    loadGames,
    selectGame,
    submitScore,
    clearSelectedGame,
  } = useGames();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGlobalLeaderboard, setShowGlobalLeaderboard] = useState<boolean>(false);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(() => {
    const list = [
      { id: 'all', label: 'Todos los Juegos', count: games.length },
      { id: 'arcade', label: 'Arcade', count: games.filter((g) => g.category === 'arcade').length },
      { id: 'action', label: 'Acción', count: games.filter((g) => g.category === 'action').length },
      { id: 'puzzle', label: 'Puzzle & Lógica', count: games.filter((g) => g.category === 'puzzle').length },
      { id: 'classic', label: 'Clásicos 70s-80s', count: games.filter((g) => g.category === 'classic').length },
    ];
    return list;
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [games, searchQuery]);

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-y2k-bg text-y2k-white selection:bg-y2k-cyan selection:text-y2k-bg flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenGlobalLeaderboard={() => setShowGlobalLeaderboard(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-16">
        <HeroSection totalGames={games.length} onExplore={handleScrollToCatalog} />

        {/* Catalog Section */}
        <section ref={catalogRef} className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-y2k-cyan" />
                <span>CATÁLOGO DE JUEGOS</span>
              </h2>
              <p className="text-xs text-gray-400">
                Mostrando {filteredGames.length} de {games.length} videojuegos disponibles
              </p>
            </div>

            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={(id) => loadGames(id)}
            />
          </div>

          {/* Loading and Error States */}
          {isLoading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-y2k-cyan animate-spin" />
              <p className="text-xs font-mono text-gray-400">Cargando colección retro...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Grid of Games */}
          {!isLoading && filteredGames.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={(item: GameItem) => selectGame(item.id)}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredGames.length === 0 && (
            <div className="text-center py-16 y2k-glass rounded-2xl border border-white/10 p-8">
              <p className="text-sm text-gray-300 mb-2">No se encontraron juegos con tu búsqueda.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  loadGames('all');
                }}
                className="y2k-btn-bubble px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {selectedGame && (
        <GameModal
          game={selectedGame}
          leaderboard={leaderboard}
          onClose={clearSelectedGame}
          onSubmitScore={submitScore}
        />
      )}

      {showGlobalLeaderboard && (
        <GlobalLeaderboardModal
          games={games}
          onClose={() => setShowGlobalLeaderboard(false)}
        />
      )}

      {/* Footer */}
      <footer className="y2k-glass border-t border-y2k-chrome/20 py-6 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono">
            RETROPLAY © 2026 • Arquitectura Jamstack SSG • Cero BD en Runtime
          </p>
          <p className="text-gray-400">
            Diseño Y2K Aesthetic Cromado con React 19, TypeScript y Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

import { useState, useEffect, useCallback } from 'react';
import type { GameItem, GameScore, SubmitScoreDto } from '../types/game';
import * as gameController from '../controllers/gameController';

export interface UseGamesState {
  games: GameItem[];
  selectedGame: GameItem | null;
  leaderboard: GameScore[];
  isLoading: boolean;
  error: string | null;
  activeCategory: string;
}

export function useGames() {
  const [state, setState] = useState<UseGamesState>({
    games: [],
    selectedGame: null,
    leaderboard: [],
    isLoading: true,
    error: null,
    activeCategory: 'all',
  });

  const loadGames = useCallback(async (category?: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const response = category && category !== 'all'
      ? await gameController.handleGetGamesByCategory(category)
      : await gameController.handleGetAllGames();

    if (response.success && response.data) {
      setState((prev) => ({
        ...prev,
        games: response.data ?? [],
        isLoading: false,
        activeCategory: category ?? 'all',
      }));
    } else {
      setState((prev) => ({
        ...prev,
        error: response.error ?? 'Error cargando juegos',
        isLoading: false,
      }));
    }
  }, []);

  const selectGame = useCallback(async (gameId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const gameRes = await gameController.handleGetGameById(gameId);
    const leadRes = await gameController.handleGetLeaderboard(gameId);

    setState((prev) => ({
      ...prev,
      selectedGame: gameRes.data,
      leaderboard: leadRes.data ?? [],
      isLoading: false,
      error: gameRes.error ?? null,
    }));
  }, []);

  const submitScore = useCallback(async (dto: SubmitScoreDto): Promise<boolean> => {
    const res = await gameController.handleSubmitScore(dto);
    if (res.success && state.selectedGame?.id === dto.gameId) {
      const updatedLead = await gameController.handleGetLeaderboard(dto.gameId);
      setState((prev) => ({ ...prev, leaderboard: updatedLead.data ?? [] }));
      return true;
    }
    return false;
  }, [state.selectedGame]);

  useEffect(() => {
    let isMounted = true;
    gameController.handleGetAllGames().then((response) => {
      if (!isMounted) return;
      if (response.success && response.data) {
        setState((prev) => ({ ...prev, games: response.data ?? [], isLoading: false }));
      } else {
        setState((prev) => ({ ...prev, error: response.error ?? null, isLoading: false }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...state,
    loadGames,
    selectGame,
    submitScore,
    clearSelectedGame: () => setState((prev) => ({ ...prev, selectedGame: null })),
  };
}

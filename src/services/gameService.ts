import rawGames from '../content/games.json';
import type { GameItem, GameCategory, GameScore, SubmitScoreDto } from '../types/game';

const LOCAL_STORAGE_SCORES_KEY = 'retroplay_scores_v1';

export async function getAllGames(): Promise<GameItem[]> {
  try {
    return (rawGames as GameItem[]) || [];
  } catch (error) {
    console.error('Error al obtener lista de juegos:', error);
    throw new Error('No se pudo cargar la colección de juegos');
  }
}

export async function getGameById(id: string): Promise<GameItem | null> {
  try {
    const list = await getAllGames();
    const item = list.find((g) => g.id === id || g.slug === id);
    return item ?? null;
  } catch (error) {
    console.error(`Error al buscar juego con id ${id}:`, error);
    throw error;
  }
}

export async function getGamesByCategory(category: GameCategory): Promise<GameItem[]> {
  try {
    const list = await getAllGames();
    return list.filter((g) => g.category === category);
  } catch (error) {
    console.error(`Error filtrando categoría ${category}:`, error);
    throw error;
  }
}

export async function recordScore(dto: SubmitScoreDto): Promise<GameScore> {
  try {
    const newScore: GameScore = {
      id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      gameId: dto.gameId,
      playerName: dto.playerName.trim(),
      score: Math.floor(dto.score),
      createdAt: new Date().toISOString(),
    };

    const existingJson = localStorage.getItem(LOCAL_STORAGE_SCORES_KEY);
    const scores: GameScore[] = existingJson ? JSON.parse(existingJson) : [];
    scores.push(newScore);
    localStorage.setItem(LOCAL_STORAGE_SCORES_KEY, JSON.stringify(scores));

    return newScore;
  } catch (error) {
    console.error('Error al persistir récord de puntuación:', error);
    throw new Error('Error al registrar la puntuación en almacenamiento local');
  }
}

export async function getLeaderboardByGame(gameId: string): Promise<GameScore[]> {
  try {
    const existingJson = localStorage.getItem(LOCAL_STORAGE_SCORES_KEY);
    const scores: GameScore[] = existingJson ? JSON.parse(existingJson) : [];
    return scores
      .filter((s) => s.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  } catch (error) {
    console.error(`Error obteniendo tabla de líderes para ${gameId}:`, error);
    return [];
  }
}

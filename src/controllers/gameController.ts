import type { ApiResponse } from '../types/api';
import type { GameItem, GameCategory, GameScore, SubmitScoreDto } from '../types/game';
import { validateGameId, validateScoreInput } from '../utils/validator';
import { sanitizeTextInput } from '../utils/sanitizer';
import * as gameService from '../services/gameService';

export async function handleGetAllGames(): Promise<ApiResponse<GameItem[]>> {
  try {
    const games = await gameService.getAllGames();
    return {
      status: 200,
      success: true,
      data: games,
      message: 'Catálogo de juegos obtenido exitosamente',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error interno al consultar juegos';
    return {
      status: 500,
      success: false,
      data: null,
      error: errorMsg,
    };
  }
}

export async function handleGetGameById(id: string): Promise<ApiResponse<GameItem>> {
  try {
    const val = validateGameId(id);
    if (!val.isValid) {
      return { status: 400, success: false, data: null, error: val.error };
    }

    const game = await gameService.getGameById(id);
    if (!game) {
      return { status: 404, success: false, data: null, error: `Juego con ID "${id}" no encontrado` };
    }

    return { status: 200, success: true, data: game };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error al obtener juego';
    return { status: 500, success: false, data: null, error: errorMsg };
  }
}

export async function handleGetGamesByCategory(category: string): Promise<ApiResponse<GameItem[]>> {
  try {
    const validCategories: GameCategory[] = ['arcade', 'puzzle', 'action', 'classic', 'strategy'];
    if (!validCategories.includes(category as GameCategory)) {
      return {
        status: 400,
        success: false,
        data: null,
        error: `Categoría inválida: ${category}`,
      };
    }

    const games = await gameService.getGamesByCategory(category as GameCategory);
    return { status: 200, success: true, data: games };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error al filtrar juegos';
    return { status: 500, success: false, data: null, error: errorMsg };
  }
}

export async function handleSubmitScore(dto: SubmitScoreDto): Promise<ApiResponse<GameScore>> {
  try {
    const validation = validateScoreInput(dto);
    if (!validation.isValid) {
      return { status: 400, success: false, data: null, error: validation.error };
    }

    const game = await gameService.getGameById(dto.gameId);
    if (!game) {
      return { status: 404, success: false, data: null, error: `El juego ${dto.gameId} no existe` };
    }

    const sanitizedDto: SubmitScoreDto = {
      ...dto,
      playerName: sanitizeTextInput(dto.playerName),
    };

    const saved = await gameService.recordScore(sanitizedDto);
    return {
      status: 201,
      success: true,
      data: saved,
      message: 'Puntuación registrada satisfactoriamente',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error al guardar puntuación';
    return { status: 500, success: false, data: null, error: errorMsg };
  }
}

export async function handleGetLeaderboard(gameId: string): Promise<ApiResponse<GameScore[]>> {
  try {
    const val = validateGameId(gameId);
    if (!val.isValid) {
      return { status: 400, success: false, data: null, error: val.error };
    }

    const scores = await gameService.getLeaderboardByGame(gameId);
    return { status: 200, success: true, data: scores };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error al consultar tabla';
    return { status: 500, success: false, data: null, error: errorMsg };
  }
}

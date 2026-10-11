import type { SubmitScoreDto } from '../types/game';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateScoreInput(dto: SubmitScoreDto): ValidationResult {
  if (!dto || typeof dto !== 'object') {
    return { isValid: false, error: 'Cuerpo de solicitud inválido o inexistente' };
  }

  if (!dto.gameId || typeof dto.gameId !== 'string' || dto.gameId.trim().length === 0) {
    return { isValid: false, error: 'El campo "gameId" es obligatorio y debe ser una cadena válida' };
  }

  if (!dto.playerName || typeof dto.playerName !== 'string' || dto.playerName.trim().length < 2) {
    return { isValid: false, error: 'El nombre del jugador debe tener al menos 2 caracteres' };
  }

  if (typeof dto.score !== 'number' || isNaN(dto.score) || dto.score < 0) {
    return { isValid: false, error: 'La puntuación debe ser un número entero no negativo' };
  }

  return { isValid: true };
}

export function validateGameId(id: string): ValidationResult {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return { isValid: false, error: 'Identificador de juego requerido' };
  }
  return { isValid: true };
}

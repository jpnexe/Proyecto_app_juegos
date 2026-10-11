export type GameCategory =
  | 'arcade'
  | 'puzzle'
  | 'action'
  | 'classic'
  | 'strategy';

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface GameControlInfo {
  key: string;
  action: string;
}

export interface GameItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: GameCategory;
  releaseYear: number;
  difficulty: GameDifficulty;
  thumbnail: string;
  accentColor: string;
  instructions: string[];
  controls: GameControlInfo[];
  playsCount: number;
  rating: number;
  isPlayable: boolean;
}

export interface GameScore {
  id: string;
  gameId: string;
  playerName: string;
  score: number;
  createdAt: string;
}

export interface SubmitScoreDto {
  gameId: string;
  playerName: string;
  score: number;
}

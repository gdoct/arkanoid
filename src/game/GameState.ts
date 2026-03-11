export enum GamePhase {
  Ready = 'ready',
  Playing = 'playing',
  LevelComplete = 'level_complete',
  GameOver = 'game_over',
}

export interface GameStateData {
  phase: GamePhase;
  score: number;
  lives: number;
  currentLevel: number;
}

export function createInitialState(): GameStateData {
  return {
    phase: GamePhase.Ready,
    score: 0,
    lives: 3,
    currentLevel: 1,
  };
}

export function loseLife(state: GameStateData): GameStateData {
  const newLives = state.lives - 1;
  return {
    ...state,
    lives: newLives,
    phase: newLives <= 0 ? GamePhase.GameOver : GamePhase.Ready,
  };
}

export function addScore(state: GameStateData, points: number): GameStateData {
  return { ...state, score: state.score + points };
}

export function checkLevelComplete(aliveBrickCount: number, state: GameStateData): GameStateData {
  if (aliveBrickCount === 0) {
    return { ...state, phase: GamePhase.LevelComplete };
  }
  return state;
}

import { describe, it, expect } from 'vitest';
import {
  GamePhase,
  createInitialState,
  loseLife,
  addScore,
  checkLevelComplete,
} from '../game/GameState.ts';

describe('createInitialState', () => {
  it('returns correct defaults', () => {
    const state = createInitialState();
    expect(state.phase).toBe(GamePhase.Ready);
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.currentLevel).toBe(1);
  });
});

describe('loseLife', () => {
  it('decrements lives', () => {
    const state = createInitialState();
    const result = loseLife(state);
    expect(result.lives).toBe(2);
    expect(result.phase).toBe(GamePhase.Ready);
  });

  it('transitions to GameOver at 0 lives', () => {
    const state = { ...createInitialState(), lives: 1 };
    const result = loseLife(state);
    expect(result.lives).toBe(0);
    expect(result.phase).toBe(GamePhase.GameOver);
  });

  it('does not mutate original state', () => {
    const state = createInitialState();
    loseLife(state);
    expect(state.lives).toBe(3);
  });
});

describe('addScore', () => {
  it('adds points to score', () => {
    const state = createInitialState();
    const result = addScore(state, 10);
    expect(result.score).toBe(10);
  });

  it('accumulates score', () => {
    const state = { ...createInitialState(), score: 50 };
    const result = addScore(state, 25);
    expect(result.score).toBe(75);
  });
});

describe('checkLevelComplete', () => {
  it('transitions to LevelComplete when no bricks remain', () => {
    const state = { ...createInitialState(), phase: GamePhase.Playing };
    const result = checkLevelComplete(0, state);
    expect(result.phase).toBe(GamePhase.LevelComplete);
  });

  it('keeps current phase when bricks remain', () => {
    const state = { ...createInitialState(), phase: GamePhase.Playing };
    const result = checkLevelComplete(5, state);
    expect(result.phase).toBe(GamePhase.Playing);
  });
});

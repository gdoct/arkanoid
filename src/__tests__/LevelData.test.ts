import { describe, it, expect } from 'vitest';
import { buildBricksFromLevel } from '../levels/LevelData.ts';
import type { LevelConfig, GameConfig } from '../types.ts';

const testConfig: GameConfig = {
  canvasWidth: 480,
  canvasHeight: 640,
  paddleWidth: 80,
  paddleHeight: 12,
  paddleSpeed: 7,
  ballRadius: 5,
  ballSpeed: 4.5,
  brickWidth: 18,
  brickHeight: 14,
  brickPadding: 2,
  brickOffsetTop: 10,
  brickOffsetLeft: 0,
};

describe('buildBricksFromLevel', () => {
  it('creates bricks for all filled cells', () => {
    const level: LevelConfig = {
      name: 'test',
      grid: [
        [1, 1, 1],
        [1, 1, 1],
      ],
      brickRows: 2,
      brickCols: 3,
    };
    const bricks = buildBricksFromLevel(level, testConfig);
    expect(bricks).toHaveLength(6);
  });

  it('skips empty cells', () => {
    const level: LevelConfig = {
      name: 'test',
      grid: [
        [1, 0, 1],
        [0, 1, 0],
      ],
      brickRows: 2,
      brickCols: 3,
    };
    const bricks = buildBricksFromLevel(level, testConfig);
    expect(bricks).toHaveLength(3);
  });

  it('computes correct brick positions', () => {
    const level: LevelConfig = {
      name: 'test',
      grid: [[1, 0, 1]],
      brickRows: 1,
      brickCols: 3,
    };
    const bricks = buildBricksFromLevel(level, testConfig);
    expect(bricks[0].rect.x).toBe(0);
    expect(bricks[0].rect.y).toBe(10);
    expect(bricks[1].rect.x).toBe(40); // col 2: 2 * (18 + 2) = 40
    expect(bricks[1].rect.y).toBe(10);
  });

  it('creates all bricks as alive', () => {
    const level: LevelConfig = {
      name: 'test',
      grid: [[1, 1]],
      brickRows: 1,
      brickCols: 2,
    };
    const bricks = buildBricksFromLevel(level, testConfig);
    expect(bricks.every(b => b.alive)).toBe(true);
  });

  it('assigns green color to value 1', () => {
    const level: LevelConfig = {
      name: 'test',
      grid: [[1]],
      brickRows: 1,
      brickCols: 1,
    };
    const bricks = buildBricksFromLevel(level, testConfig);
    expect(bricks[0].color).toBe('#30b040');
  });
});

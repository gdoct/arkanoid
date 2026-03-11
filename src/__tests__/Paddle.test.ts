import { describe, it, expect } from 'vitest';
import { Paddle } from '../entities/Paddle.ts';

describe('Paddle', () => {
  it('moves left', () => {
    const paddle = new Paddle(200, 550, 80, 12, 7, 480);
    paddle.moveLeft(1);
    expect(paddle.x).toBe(193);
  });

  it('moves right', () => {
    const paddle = new Paddle(200, 550, 80, 12, 7, 480);
    paddle.moveRight(1);
    expect(paddle.x).toBe(207);
  });

  it('clamps to left wall', () => {
    const paddle = new Paddle(3, 550, 80, 12, 7, 480);
    paddle.moveLeft(1);
    expect(paddle.x).toBe(0);
  });

  it('clamps to right wall', () => {
    const paddle = new Paddle(397, 550, 80, 12, 7, 480);
    paddle.moveRight(1);
    expect(paddle.x).toBe(400);
  });

  it('returns correct rect', () => {
    const paddle = new Paddle(100, 550, 80, 12, 7, 480);
    expect(paddle.getRect()).toEqual({ x: 100, y: 550, width: 80, height: 12 });
  });
});

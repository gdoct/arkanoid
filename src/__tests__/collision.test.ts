import { describe, it, expect } from 'vitest';
import {
  ballRectCollision,
  reflect,
  ballPaddleCollision,
  ballWallCollision,
  nearestPointOnRect,
} from '../physics/collision.ts';

describe('nearestPointOnRect', () => {
  const rect = { x: 10, y: 10, width: 20, height: 10 };

  it('returns the point itself when inside the rect', () => {
    expect(nearestPointOnRect(rect, { x: 15, y: 15 })).toEqual({ x: 15, y: 15 });
  });

  it('clamps to left edge', () => {
    expect(nearestPointOnRect(rect, { x: 5, y: 15 })).toEqual({ x: 10, y: 15 });
  });

  it('clamps to right edge', () => {
    expect(nearestPointOnRect(rect, { x: 35, y: 15 })).toEqual({ x: 30, y: 15 });
  });

  it('clamps to top edge', () => {
    expect(nearestPointOnRect(rect, { x: 15, y: 5 })).toEqual({ x: 15, y: 10 });
  });

  it('clamps to corner', () => {
    expect(nearestPointOnRect(rect, { x: 0, y: 0 })).toEqual({ x: 10, y: 10 });
  });
});

describe('ballRectCollision', () => {
  const rect = { x: 50, y: 50, width: 40, height: 20 };

  it('returns null when ball is far from rect', () => {
    expect(ballRectCollision({ x: 0, y: 0 }, 5, rect)).toBeNull();
  });

  it('detects collision from top', () => {
    const result = ballRectCollision({ x: 70, y: 47 }, 5, rect);
    expect(result).not.toBeNull();
    expect(result!.normal.y).toBeLessThan(0);
  });

  it('detects collision from bottom', () => {
    const result = ballRectCollision({ x: 70, y: 73 }, 5, rect);
    expect(result).not.toBeNull();
    expect(result!.normal.y).toBeGreaterThan(0);
  });

  it('detects collision from left', () => {
    const result = ballRectCollision({ x: 47, y: 60 }, 5, rect);
    expect(result).not.toBeNull();
    expect(result!.normal.x).toBeLessThan(0);
  });

  it('detects collision from right', () => {
    const result = ballRectCollision({ x: 93, y: 60 }, 5, rect);
    expect(result).not.toBeNull();
    expect(result!.normal.x).toBeGreaterThan(0);
  });
});

describe('reflect', () => {
  it('reflects against horizontal surface (y-normal)', () => {
    const result = reflect({ x: 3, y: 4 }, { x: 0, y: -1 });
    expect(result.x).toBeCloseTo(3);
    expect(result.y).toBeCloseTo(-4);
  });

  it('reflects against vertical surface (x-normal)', () => {
    const result = reflect({ x: 3, y: 4 }, { x: -1, y: 0 });
    expect(result.x).toBeCloseTo(-3);
    expect(result.y).toBeCloseTo(4);
  });

  it('reflects against diagonal normal', () => {
    const n = Math.SQRT1_2;
    const result = reflect({ x: 1, y: 0 }, { x: -n, y: -n });
    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(-1);
  });
});

describe('ballPaddleCollision', () => {
  const paddleRect = { x: 200, y: 550, width: 80, height: 12 };

  it('returns null when ball misses paddle', () => {
    const result = ballPaddleCollision({ x: 100, y: 400 }, 5, paddleRect, 5);
    expect(result).toBeNull();
  });

  it('bounces straight up when hitting center', () => {
    const result = ballPaddleCollision({ x: 240, y: 547 }, 5, paddleRect, 5);
    expect(result).not.toBeNull();
    expect(result!.x).toBeCloseTo(0, 1);
    expect(result!.y).toBeLessThan(0);
  });

  it('bounces left when hitting left side', () => {
    const result = ballPaddleCollision({ x: 205, y: 547 }, 5, paddleRect, 5);
    expect(result).not.toBeNull();
    expect(result!.x).toBeLessThan(0);
    expect(result!.y).toBeLessThan(0);
  });

  it('bounces right when hitting right side', () => {
    const result = ballPaddleCollision({ x: 275, y: 547 }, 5, paddleRect, 5);
    expect(result).not.toBeNull();
    expect(result!.x).toBeGreaterThan(0);
    expect(result!.y).toBeLessThan(0);
  });

  it('preserves ball speed', () => {
    const speed = 5;
    const result = ballPaddleCollision({ x: 220, y: 547 }, 5, paddleRect, speed);
    expect(result).not.toBeNull();
    const magnitude = Math.sqrt(result!.x ** 2 + result!.y ** 2);
    expect(magnitude).toBeCloseTo(speed);
  });
});

describe('ballWallCollision', () => {
  it('bounces off left wall', () => {
    const result = ballWallCollision({ x: 2, y: 100 }, 5, { x: -3, y: 2 }, 480, 640);
    expect(result.velocity.x).toBeGreaterThan(0);
    expect(result.lost).toBe(false);
  });

  it('bounces off right wall', () => {
    const result = ballWallCollision({ x: 478, y: 100 }, 5, { x: 3, y: 2 }, 480, 640);
    expect(result.velocity.x).toBeLessThan(0);
    expect(result.lost).toBe(false);
  });

  it('bounces off top wall', () => {
    const result = ballWallCollision({ x: 100, y: 2 }, 5, { x: 2, y: -3 }, 480, 640);
    expect(result.velocity.y).toBeGreaterThan(0);
    expect(result.lost).toBe(false);
  });

  it('marks lost when ball goes below bottom', () => {
    const result = ballWallCollision({ x: 100, y: 638 }, 5, { x: 2, y: 3 }, 480, 640);
    expect(result.lost).toBe(true);
  });

  it('does not lose when ball is in play area', () => {
    const result = ballWallCollision({ x: 200, y: 300 }, 5, { x: 2, y: 3 }, 480, 640);
    expect(result.lost).toBe(false);
  });
});

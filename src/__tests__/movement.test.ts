import { describe, it, expect } from 'vitest';
import { moveBall, clampPaddlePosition, normalizeVelocity } from '../physics/movement.ts';

describe('moveBall', () => {
  it('moves ball by velocity * dt', () => {
    const result = moveBall({ x: 10, y: 20 }, { x: 3, y: -4 }, 1);
    expect(result).toEqual({ x: 13, y: 16 });
  });

  it('scales movement by dt', () => {
    const result = moveBall({ x: 0, y: 0 }, { x: 10, y: 10 }, 0.5);
    expect(result).toEqual({ x: 5, y: 5 });
  });

  it('handles zero velocity', () => {
    const result = moveBall({ x: 5, y: 5 }, { x: 0, y: 0 }, 1);
    expect(result).toEqual({ x: 5, y: 5 });
  });
});

describe('clampPaddlePosition', () => {
  it('clamps to left edge', () => {
    expect(clampPaddlePosition(-10, 80, 480)).toBe(0);
  });

  it('clamps to right edge', () => {
    expect(clampPaddlePosition(450, 80, 480)).toBe(400);
  });

  it('allows valid position in middle', () => {
    expect(clampPaddlePosition(100, 80, 480)).toBe(100);
  });
});

describe('normalizeVelocity', () => {
  it('normalizes to target speed', () => {
    const result = normalizeVelocity({ x: 3, y: 4 }, 10);
    const magnitude = Math.sqrt(result.x ** 2 + result.y ** 2);
    expect(magnitude).toBeCloseTo(10);
  });

  it('preserves direction', () => {
    const result = normalizeVelocity({ x: 3, y: 4 }, 5);
    expect(result.x).toBeCloseTo(3);
    expect(result.y).toBeCloseTo(4);
  });

  it('handles zero velocity by returning upward', () => {
    const result = normalizeVelocity({ x: 0, y: 0 }, 5);
    expect(result).toEqual({ x: 0, y: -5 });
  });

  it('enforces minimum vertical component when nearly horizontal', () => {
    const result = normalizeVelocity({ x: 10, y: 0.01 }, 5);
    const magnitude = Math.sqrt(result.x ** 2 + result.y ** 2);
    expect(magnitude).toBeCloseTo(5);
    expect(Math.abs(result.y)).toBeGreaterThanOrEqual(5 * 0.3 - 0.001);
  });

  it('preserves vertical sign when clamping', () => {
    const result = normalizeVelocity({ x: 10, y: -0.01 }, 5);
    expect(result.y).toBeLessThan(0);
  });
});

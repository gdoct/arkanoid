import { describe, it, expect } from 'vitest';
import { Ball } from '../entities/Ball.ts';

describe('Ball', () => {
  it('starts inactive', () => {
    const ball = new Ball(100, 100, 5, 4);
    expect(ball.active).toBe(false);
  });

  it('does not move when inactive', () => {
    const ball = new Ball(100, 100, 5, 4);
    ball.update(1);
    expect(ball.position).toEqual({ x: 100, y: 100 });
  });

  it('moves when active', () => {
    const ball = new Ball(100, 100, 5, 4);
    ball.active = true;
    ball.velocity = { x: 3, y: -4 };
    ball.update(1);
    expect(ball.position).toEqual({ x: 103, y: 96 });
  });

  it('launch sets active and gives upward velocity', () => {
    const ball = new Ball(100, 100, 5, 4);
    ball.launch();
    expect(ball.active).toBe(true);
    expect(ball.velocity.y).toBeLessThan(0);
    const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
    expect(speed).toBeCloseTo(4);
  });

  it('resetOnPaddle places ball above paddle and deactivates', () => {
    const ball = new Ball(100, 100, 5, 4);
    ball.active = true;
    ball.resetOnPaddle(200, 550, 80);
    expect(ball.active).toBe(false);
    expect(ball.position.x).toBe(240);
    expect(ball.position.y).toBe(544);
  });
});

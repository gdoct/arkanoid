import type { Vector2D } from '../types.ts';

export function moveBall(position: Vector2D, velocity: Vector2D, dt: number): Vector2D {
  return {
    x: position.x + velocity.x * dt,
    y: position.y + velocity.y * dt,
  };
}

export function clampPaddlePosition(x: number, paddleWidth: number, canvasWidth: number): number {
  return Math.max(0, Math.min(canvasWidth - paddleWidth, x));
}

const MIN_Y_RATIO = 0.3;

export function normalizeVelocity(velocity: Vector2D, speed: number): Vector2D {
  const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
  if (magnitude === 0) return { x: 0, y: -speed };

  let vx = velocity.x / magnitude;
  let vy = velocity.y / magnitude;

  // Prevent the ball from going too horizontal
  if (Math.abs(vy) < MIN_Y_RATIO) {
    vy = vy >= 0 ? MIN_Y_RATIO : -MIN_Y_RATIO;
    vx = Math.sign(vx) * Math.sqrt(1 - vy * vy);
  }

  return { x: vx * speed, y: vy * speed };
}

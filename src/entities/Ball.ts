import type { Vector2D } from '../types.ts';
import { moveBall, normalizeVelocity } from '../physics/movement.ts';

export class Ball {
  position: Vector2D;
  velocity: Vector2D;
  radius: number;
  speed: number;
  active: boolean;

  constructor(x: number, y: number, radius: number, speed: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: -speed };
    this.radius = radius;
    this.speed = speed;
    this.active = false;
  }

  update(dt: number): void {
    if (!this.active) return;
    this.position = moveBall(this.position, this.velocity, dt);
  }

  launch(): void {
    this.active = true;
    this.velocity = normalizeVelocity(
      { x: (Math.random() - 0.5) * 2, y: -1 },
      this.speed,
    );
  }

  resetOnPaddle(paddleX: number, paddleY: number, paddleWidth: number): void {
    this.position = { x: paddleX + paddleWidth / 2, y: paddleY - this.radius - 1 };
    this.velocity = { x: 0, y: -this.speed };
    this.active = false;
  }
}

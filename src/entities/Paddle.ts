import type { Rect } from '../types.ts';
import { clampPaddlePosition } from '../physics/movement.ts';

export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  private canvasWidth: number;

  constructor(x: number, y: number, width: number, height: number, speed: number, canvasWidth: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.canvasWidth = canvasWidth;
  }

  moveLeft(dt: number): void {
    this.x = clampPaddlePosition(this.x - this.speed * dt, this.width, this.canvasWidth);
  }

  moveRight(dt: number): void {
    this.x = clampPaddlePosition(this.x + this.speed * dt, this.width, this.canvasWidth);
  }

  getRect(): Rect {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}

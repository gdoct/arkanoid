import type { Vector2D, Rect, BrickData } from '../types.ts';
import { COLORS } from '../constants.ts';

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, width, height);
}

export function drawBall(ctx: CanvasRenderingContext2D, position: Vector2D, radius: number): void {
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.ball;
  ctx.fill();
  ctx.closePath();
}

export function drawPaddle(ctx: CanvasRenderingContext2D, rect: Rect): void {
  const cornerRadius = 4;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, cornerRadius);
  ctx.fillStyle = COLORS.paddle;
  ctx.fill();

  // highlight stripe
  ctx.fillStyle = COLORS.paddleHighlight;
  ctx.fillRect(rect.x + rect.width * 0.4, rect.y + 2, rect.width * 0.2, rect.height - 4);
}

export function drawBricks(ctx: CanvasRenderingContext2D, bricks: BrickData[]): void {
  for (const brick of bricks) {
    if (!brick.alive) continue;
    ctx.fillStyle = brick.color;
    ctx.fillRect(brick.rect.x, brick.rect.y, brick.rect.width, brick.rect.height);
    ctx.strokeStyle = COLORS.brickBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(brick.rect.x, brick.rect.y, brick.rect.width, brick.rect.height);
  }
}

export function drawUI(ctx: CanvasRenderingContext2D, score: number, lives: number, canvasWidth: number): void {
  ctx.fillStyle = COLORS.text;
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 10, canvasWidth > 600 ? 20 : 640 - 20);
  ctx.textAlign = 'right';
  ctx.fillText(`Lives: ${lives}`, canvasWidth - 10, canvasWidth > 600 ? 20 : 640 - 20);
  ctx.textAlign = 'left';
}

export function drawOverlay(ctx: CanvasRenderingContext2D, text: string, subText: string, width: number, height: number): void {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, height / 2 - 50, width, 100);

  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, width / 2, height / 2 - 5);

  ctx.font = '14px monospace';
  ctx.fillText(subText, width / 2, height / 2 + 25);
  ctx.textAlign = 'left';
}

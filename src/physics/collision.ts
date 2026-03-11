import type { Vector2D, Rect } from '../types.ts';

export interface CollisionResult {
  normal: Vector2D;
  penetration: number;
}

export function nearestPointOnRect(rect: Rect, point: Vector2D): Vector2D {
  return {
    x: Math.max(rect.x, Math.min(point.x, rect.x + rect.width)),
    y: Math.max(rect.y, Math.min(point.y, rect.y + rect.height)),
  };
}

export function ballRectCollision(
  ballPos: Vector2D,
  ballRadius: number,
  rect: Rect,
): CollisionResult | null {
  const nearest = nearestPointOnRect(rect, ballPos);
  const dx = ballPos.x - nearest.x;
  const dy = ballPos.y - nearest.y;
  const distSq = dx * dx + dy * dy;

  if (distSq >= ballRadius * ballRadius) return null;

  const dist = Math.sqrt(distSq);

  if (dist === 0) {
    const overlapX = ballPos.x - (rect.x + rect.width / 2);
    const overlapY = ballPos.y - (rect.y + rect.height / 2);
    if (Math.abs(overlapX) > Math.abs(overlapY)) {
      return {
        normal: { x: overlapX > 0 ? 1 : -1, y: 0 },
        penetration: ballRadius,
      };
    }
    return {
      normal: { x: 0, y: overlapY > 0 ? 1 : -1 },
      penetration: ballRadius,
    };
  }

  return {
    normal: { x: dx / dist, y: dy / dist },
    penetration: ballRadius - dist,
  };
}

export function reflect(velocity: Vector2D, normal: Vector2D): Vector2D {
  const dot = velocity.x * normal.x + velocity.y * normal.y;
  return {
    x: velocity.x - 2 * dot * normal.x,
    y: velocity.y - 2 * dot * normal.y,
  };
}

export function ballPaddleCollision(
  ballPos: Vector2D,
  ballRadius: number,
  paddleRect: Rect,
  ballSpeed: number,
): Vector2D | null {
  const collision = ballRectCollision(ballPos, ballRadius, paddleRect);
  if (!collision) return null;

  const paddleCenterX = paddleRect.x + paddleRect.width / 2;
  const hitFactor = (ballPos.x - paddleCenterX) / (paddleRect.width / 2);
  const clampedFactor = Math.max(-1, Math.min(1, hitFactor));

  const maxAngle = Math.PI / 3; // 60 degrees
  const angle = clampedFactor * maxAngle;

  return {
    x: ballSpeed * Math.sin(angle),
    y: -ballSpeed * Math.cos(angle),
  };
}

export interface WallCollisionResult {
  velocity: Vector2D;
  position: Vector2D;
  lost: boolean;
}

export function ballWallCollision(
  ballPos: Vector2D,
  ballRadius: number,
  ballVelocity: Vector2D,
  canvasWidth: number,
  canvasHeight: number,
): WallCollisionResult {
  let vx = ballVelocity.x;
  let vy = ballVelocity.y;
  let px = ballPos.x;
  let py = ballPos.y;
  let lost = false;

  if (px - ballRadius <= 0) {
    vx = Math.abs(vx);
    px = ballRadius;
  } else if (px + ballRadius >= canvasWidth) {
    vx = -Math.abs(vx);
    px = canvasWidth - ballRadius;
  }

  if (py - ballRadius <= 0) {
    vy = Math.abs(vy);
    py = ballRadius;
  } else if (py + ballRadius >= canvasHeight) {
    lost = true;
  }

  return {
    velocity: { x: vx, y: vy },
    position: { x: px, y: py },
    lost,
  };
}

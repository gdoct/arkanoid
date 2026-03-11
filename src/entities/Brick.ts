import type { BrickData } from '../types.ts';

export function isBrickAlive(brick: BrickData): boolean {
  return brick.alive;
}

export function destroyBrick(brick: BrickData): BrickData {
  return { ...brick, alive: false };
}

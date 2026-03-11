import type { LevelConfig, BrickData, GameConfig } from '../types.ts';

export function buildBricksFromLevel(level: LevelConfig, config: GameConfig): BrickData[] {
  const bricks: BrickData[] = [];
  for (let row = 0; row < level.grid.length; row++) {
    for (let col = 0; col < level.grid[row].length; col++) {
      const cellValue = level.grid[row][col];
      if (cellValue === 0) continue;

      const x = config.brickOffsetLeft + col * (config.brickWidth + config.brickPadding);
      const y = config.brickOffsetTop + row * (config.brickHeight + config.brickPadding);

      bricks.push({
        row,
        col,
        rect: { x, y, width: config.brickWidth, height: config.brickHeight },
        alive: true,
        color: cellValueToColor(cellValue),
      });
    }
  }
  return bricks;
}

function cellValueToColor(value: number): string {
  switch (value) {
    case 1: return '#30b040';
    case 2: return '#d04040';
    case 3: return '#4080d0';
    default: return '#30b040';
  }
}

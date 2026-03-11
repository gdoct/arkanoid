import type { LevelConfig } from '../types.ts';

const ROWS = 12;
const COLS = 24;
const CORRIDOR_LEFT = 11;
const CORRIDOR_RIGHT = 12;
const CORRIDOR_START_ROW = 3;

function generateLevel2Grid(): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: number[] = [];
    for (let c = 0; c < COLS; c++) {
      if ((c === CORRIDOR_LEFT || c === CORRIDOR_RIGHT) && r >= CORRIDOR_START_ROW) {
        row.push(0);
      } else {
        row.push(1);
      }
    }
    grid.push(row);
  }
  return grid;
}

export const LEVEL_2: LevelConfig = {
  name: 'Level 2 - The Corridor',
  grid: generateLevel2Grid(),
  brickRows: ROWS,
  brickCols: COLS,
};

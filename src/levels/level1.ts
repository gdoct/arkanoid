import type { LevelConfig } from '../types.ts';

// 24 cols x 18 rows
// Layout: clusters of bricks in the upper area, then a 2-brick-high
// barrier wall across the full width with a single narrow gap.
// The ball must get through the gap to reach the clusters above.

const COLS = 24;
const ROWS = 18;
const WALL_ROW = 14; // barrier starts at row 14-15 (near bottom of brick area)
const GAP_COL = 12;  // single-column gap in the barrier

// Cluster definitions: [startRow, startCol, height, width]
const CLUSTERS: [number, number, number, number][] = [
  [1, 7, 3, 4],   // top-left cluster
  [1, 13, 3, 4],  // top-right cluster
  [6, 2, 3, 4],   // mid-left cluster
  [6, 18, 3, 5],  // mid-right cluster
];

function generateLevel1Grid(): number[][] {
  const grid: number[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(0) as number[],
  );

  // Place clusters
  for (const [sr, sc, h, w] of CLUSTERS) {
    for (let r = sr; r < sr + h; r++) {
      for (let c = sc; c < sc + w; c++) {
        grid[r][c] = 1;
      }
    }
  }

  // Place 2-brick-high barrier wall with a single gap
  for (let r = WALL_ROW; r < WALL_ROW + 2; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c !== GAP_COL) {
        grid[r][c] = 1;
      }
    }
  }

  return grid;
}

export const LEVEL_1: LevelConfig = {
  name: 'Level 1 - The Wall',
  grid: generateLevel1Grid(),
  brickRows: ROWS,
  brickCols: COLS,
};

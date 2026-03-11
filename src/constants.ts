import type { GameConfig } from './types.ts';

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 640;

export const GAME_CONFIG: GameConfig = {
  canvasWidth: CANVAS_WIDTH,
  canvasHeight: CANVAS_HEIGHT,
  paddleWidth: 80,
  paddleHeight: 12,
  paddleSpeed: 7,
  ballRadius: 5,
  ballSpeed: 4.5,
  brickWidth: 18,
  brickHeight: 14,
  brickPadding: 2,
  brickOffsetTop: 10,
  brickOffsetLeft: 0,
};

export const COLORS = {
  background: '#0a0a2e',
  paddle: '#e05030',
  paddleHighlight: '#f06040',
  ball: '#f0d020',
  brickGreen: '#30b040',
  brickBorder: '#208030',
  text: '#ffffff',
} as const;

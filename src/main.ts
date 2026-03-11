import './style.css';
import { Game } from './game/Game.ts';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.ts';

const app = document.getElementById('app')!;
app.innerHTML = '';

const canvas = document.createElement('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
app.appendChild(canvas);

const ctx = canvas.getContext('2d')!;
const game = new Game(ctx);
game.start();

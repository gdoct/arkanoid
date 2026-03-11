import { Ball } from '../entities/Ball.ts';
import { Paddle } from '../entities/Paddle.ts';
import { InputHandler } from '../input/InputHandler.ts';
import { GAME_CONFIG, COLORS } from '../constants.ts';
import { buildBricksFromLevel } from '../levels/LevelData.ts';
import { LEVEL_1 } from '../levels/level1.ts';
import { LEVEL_2 } from '../levels/level2.ts';
import {
  GamePhase,
  createInitialState,
  loseLife,
  addScore,
  checkLevelComplete,
} from './GameState.ts';
import type { GameStateData } from './GameState.ts';
import type { BrickData, LevelConfig } from '../types.ts';
import { ballRectCollision, reflect, ballPaddleCollision, ballWallCollision } from '../physics/collision.ts';
import { normalizeVelocity } from '../physics/movement.ts';
import * as renderer from '../rendering/renderer.ts';
import { audioEngine } from '../audio/AudioEngine.ts';

const LEVELS: LevelConfig[] = [LEVEL_1, LEVEL_2];
const MULTIBALL_STREAK = 5;

export class Game {
  private ctx: CanvasRenderingContext2D;
  private balls: Ball[];
  private paddle: Paddle;
  private bricks: BrickData[];
  private input: InputHandler;
  private state: GameStateData;
  private lastTime: number = 0;
  private streaks: Map<Ball, number> = new Map();

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.input = new InputHandler();
    this.state = createInitialState();

    const cfg = GAME_CONFIG;
    const paddleX = (cfg.canvasWidth - cfg.paddleWidth) / 2;
    const paddleY = cfg.canvasHeight - 40;
    this.paddle = new Paddle(paddleX, paddleY, cfg.paddleWidth, cfg.paddleHeight, cfg.paddleSpeed, cfg.canvasWidth);
    const ball = new Ball(0, 0, cfg.ballRadius, cfg.ballSpeed);
    ball.resetOnPaddle(this.paddle.x, this.paddle.y, this.paddle.width);
    this.balls = [ball];
    this.streaks.set(ball, 0);
    this.bricks = buildBricksFromLevel(this.getCurrentLevel(), cfg);
  }

  private getCurrentLevel(): LevelConfig {
    const idx = Math.min(this.state.currentLevel - 1, LEVELS.length - 1);
    return LEVELS[idx];
  }

  private get primaryBall(): Ball {
    return this.balls[0];
  }

  start(): void {
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  private loop(currentTime: number): void {
    const rawDt = (currentTime - this.lastTime) / 16.67;
    const dt = Math.min(rawDt, 2);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }

  private spawnExtraBall(sourceBall: Ball): void {
    const extra = new Ball(
      sourceBall.position.x,
      sourceBall.position.y,
      sourceBall.radius,
      sourceBall.speed,
    );
    extra.active = true;
    // Launch in opposite x-direction
    extra.velocity = normalizeVelocity(
      { x: -sourceBall.velocity.x, y: sourceBall.velocity.y },
      sourceBall.speed,
    );
    this.balls.push(extra);
    this.streaks.set(extra, 0);
  }

  private update(dt: number): void {
    if (this.input.isLeftPressed()) {
      this.paddle.moveLeft(dt);
    }
    if (this.input.isRightPressed()) {
      this.paddle.moveRight(dt);
    }

    if (this.state.phase === GamePhase.Ready) {
      this.primaryBall.resetOnPaddle(this.paddle.x, this.paddle.y, this.paddle.width);

      if (this.input.isLaunchPressed()) {
        this.input.consumeLaunch();
        this.primaryBall.launch();
        this.streaks.set(this.primaryBall, 0);
        this.state = { ...this.state, phase: GamePhase.Playing };
      }
      return;
    }

    if (this.state.phase === GamePhase.GameOver || this.state.phase === GamePhase.LevelComplete) {
      if (this.input.isLaunchPressed()) {
        this.input.consumeLaunch();
        if (this.state.phase === GamePhase.GameOver) {
          this.restartGame();
        } else {
          this.nextLevel();
        }
      }
      return;
    }

    // Playing phase — update each ball
    const ballsToRemove: Ball[] = [];

    for (const ball of this.balls) {
      ball.update(dt);

      // Wall collisions
      const prevVx = ball.velocity.x;
      const prevVy = ball.velocity.y;
      const wallResult = ballWallCollision(
        ball.position,
        ball.radius,
        ball.velocity,
        GAME_CONFIG.canvasWidth,
        GAME_CONFIG.canvasHeight,
      );
      ball.velocity = wallResult.velocity;
      ball.position = wallResult.position;

      if (wallResult.lost) {
        audioEngine.ballLost();
        ballsToRemove.push(ball);
        continue;
      }

      if (wallResult.velocity.x !== prevVx || wallResult.velocity.y !== prevVy) {
        audioEngine.wallBounce();
      }

      // Paddle collision
      const paddleResult = ballPaddleCollision(
        ball.position,
        ball.radius,
        this.paddle.getRect(),
        ball.speed,
      );
      if (paddleResult) {
        ball.velocity = paddleResult;
        ball.position.y = this.paddle.y - ball.radius - 1;
        this.streaks.set(ball, 0);
        audioEngine.paddleHit();
      }

      // Brick collisions
      for (let i = 0; i < this.bricks.length; i++) {
        const brick = this.bricks[i];
        if (!brick.alive) continue;

        const collision = ballRectCollision(ball.position, ball.radius, brick.rect);
        if (collision) {
          this.bricks[i] = { ...brick, alive: false };
          ball.velocity = reflect(ball.velocity, collision.normal);
          ball.position.x += collision.normal.x * collision.penetration;
          ball.position.y += collision.normal.y * collision.penetration;
          ball.velocity = normalizeVelocity(ball.velocity, ball.speed);
          this.state = addScore(this.state, 10);
          audioEngine.brickHit();

          const streak = (this.streaks.get(ball) ?? 0) + 1;
          this.streaks.set(ball, streak);
          if (streak === MULTIBALL_STREAK) {
            this.spawnExtraBall(ball);
            this.streaks.set(ball, 0);
            audioEngine.extraBall();
          }

          break;
        }
      }
    }

    // Remove lost balls
    for (const ball of ballsToRemove) {
      this.streaks.delete(ball);
      const idx = this.balls.indexOf(ball);
      if (idx !== -1) this.balls.splice(idx, 1);
    }

    // If all balls are gone, lose a life
    if (this.balls.length === 0) {
      audioEngine.turnOver();
      this.state = loseLife(this.state);
      if (this.state.phase !== GamePhase.GameOver) {
        const newBall = new Ball(0, 0, GAME_CONFIG.ballRadius, GAME_CONFIG.ballSpeed);
        newBall.resetOnPaddle(this.paddle.x, this.paddle.y, this.paddle.width);
        this.balls = [newBall];
        this.streaks.set(newBall, 0);
      }
      return;
    }

    // Check level complete
    const aliveCount = this.bricks.filter(b => b.alive).length;
    this.state = checkLevelComplete(aliveCount, this.state);
  }

  private render(): void {
    const cfg = GAME_CONFIG;
    renderer.clearCanvas(this.ctx, cfg.canvasWidth, cfg.canvasHeight);
    renderer.drawBricks(this.ctx, this.bricks);
    renderer.drawPaddle(this.ctx, this.paddle.getRect());

    for (const ball of this.balls) {
      renderer.drawBall(this.ctx, ball.position, ball.radius);
    }

    // Draw score/lives below the brick area
    this.ctx.fillStyle = COLORS.text;
    this.ctx.font = '14px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.state.score}`, 10, cfg.canvasHeight - 10);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Lives: ${this.state.lives}`, cfg.canvasWidth - 10, cfg.canvasHeight - 10);
    this.ctx.textAlign = 'left';

    // Phase overlays
    if (this.state.phase === GamePhase.Ready) {
      renderer.drawOverlay(this.ctx, 'ARKANOID', 'Press SPACE to launch', cfg.canvasWidth, cfg.canvasHeight);
    } else if (this.state.phase === GamePhase.GameOver) {
      renderer.drawOverlay(this.ctx, 'GAME OVER', `Score: ${this.state.score} — Press SPACE to restart`, cfg.canvasWidth, cfg.canvasHeight);
    } else if (this.state.phase === GamePhase.LevelComplete) {
      renderer.drawOverlay(this.ctx, 'LEVEL COMPLETE!', 'Press SPACE to continue', cfg.canvasWidth, cfg.canvasHeight);
    }
  }

  private restartGame(): void {
    this.state = createInitialState();
    this.bricks = buildBricksFromLevel(this.getCurrentLevel(), GAME_CONFIG);
    const ball = new Ball(0, 0, GAME_CONFIG.ballRadius, GAME_CONFIG.ballSpeed);
    ball.resetOnPaddle(this.paddle.x, this.paddle.y, this.paddle.width);
    this.balls = [ball];
    this.streaks = new Map();
    this.streaks.set(ball, 0);
  }

  private nextLevel(): void {
    this.state = {
      ...this.state,
      currentLevel: this.state.currentLevel + 1,
      phase: GamePhase.Ready,
    };
    this.bricks = buildBricksFromLevel(this.getCurrentLevel(), GAME_CONFIG);
    const ball = new Ball(0, 0, GAME_CONFIG.ballRadius, GAME_CONFIG.ballSpeed);
    ball.resetOnPaddle(this.paddle.x, this.paddle.y, this.paddle.width);
    this.balls = [ball];
    this.streaks = new Map();
    this.streaks.set(ball, 0);
  }
}

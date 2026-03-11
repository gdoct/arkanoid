# Arkanoid

A browser-based Arkanoid/brick-breaker game built with TypeScript and Vite. No frameworks, no dependencies at runtime — just canvas, a game loop, and synthesized sound effects.

## Gameplay

- **Move paddle**: Arrow keys or A / D
- **Launch ball**: Space
- Clear all bricks to complete a level. The ball gains speed character from the angle it hits the paddle — aim carefully to thread through tight gaps.

### Power-up

Hit **5 bricks in a row** without touching the paddle and a bonus ball spawns. You only lose a life when *all* balls fall off screen.

## Levels

| # | Name | Description |
|---|------|-------------|
| 1 | The Wall | A full-width barrier two bricks high with a single gap. Clusters of bricks above it bounce freely once you're through. |
| 2 | The Corridor | A dense grid with a narrow two-column vertical corridor — hard to aim into, hard to escape. |

## Getting started

```sh
yarn        # install dependencies
yarn dev    # start dev server at http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start the Vite dev server |
| `yarn build` | Type-check and build for production |
| `yarn preview` | Preview the production build |
| `yarn test` | Run unit tests (Vitest) |
| `yarn test:watch` | Run tests in watch mode |
| `yarn lint` | Lint with ESLint |

## Architecture

```
src/
  audio/        Web Audio API synth engine (6 synthesized sounds)
  entities/     Ball, Paddle, Brick
  game/         Game loop, state machine (GamePhase enum)
  input/        Keyboard handler
  levels/       Level grid data (level1.ts, level2.ts, …)
  physics/      Pure collision & movement functions
  rendering/    Canvas draw calls
  __tests__/    Unit tests for all logic
```

Levels are plain 2D number grids — adding a new level means creating a new file and appending it to the `LEVELS` array in `Game.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Tech stack

- [TypeScript](https://www.typescriptlang.org/) — strict mode
- [Vite](https://vitejs.dev/) — dev server and bundler
- [Vitest](https://vitest.dev/) — unit testing
- [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/) — linting
- Web Audio API — synthesized sound effects (no audio files)

## License

[MIT](LICENSE)

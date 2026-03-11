# Contributing

Contributions are welcome — bug fixes, new levels, gameplay tweaks, or anything else.

## Getting started

```sh
git clone https://github.com/gdoct/arkanoid.git
cd arkanoid
yarn
yarn dev
```

Run tests and lint before submitting:

```sh
yarn test
yarn lint
```

## Adding a new level

1. Create `src/levels/levelN.ts` and export a `LevelConfig`:

```ts
import type { LevelConfig } from '../types.ts';

export const LEVEL_N: LevelConfig = {
  name: 'Level N - Your Name',
  grid: [
    // 2D array — 0 = empty, 1 = green brick
    // future values: 2 = red, 3 = blue, etc.
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  brickRows: 3,
  brickCols: 5,
};
```

2. Import and append it to `LEVELS` in `src/game/Game.ts`:

```ts
import { LEVEL_N } from '../levels/levelN.ts';

const LEVELS: LevelConfig[] = [LEVEL_1, LEVEL_2, LEVEL_N];
```

That's it. The level loads automatically when the player reaches it.

## Project conventions

- **TypeScript strict mode** — no `any`, no unused variables
- **Pure functions for logic** — physics and state transitions live in `src/physics/` and `src/game/GameState.ts` as pure functions so they can be unit tested without a DOM
- **Unit tests required** — add tests in `src/__tests__/` for any new logic
- **No new dependencies** at runtime — the game intentionally has zero runtime dependencies

## Pull requests

- Keep PRs focused on one thing
- Make sure `yarn test` and `yarn lint` pass
- Describe what changed and why in the PR description

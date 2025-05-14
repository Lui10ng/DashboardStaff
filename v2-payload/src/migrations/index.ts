import * as migration_20250514_010503 from './20250514_010503';

export const migrations = [
  {
    up: migration_20250514_010503.up,
    down: migration_20250514_010503.down,
    name: '20250514_010503'
  },
];

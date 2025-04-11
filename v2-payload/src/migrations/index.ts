import * as migration_20250411_042717 from './20250411_042717';

export const migrations = [
  {
    up: migration_20250411_042717.up,
    down: migration_20250411_042717.down,
    name: '20250411_042717'
  },
];

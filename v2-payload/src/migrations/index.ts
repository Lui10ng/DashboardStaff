import * as migration_20250411_042717 from './20250411_042717';
import * as migration_20250411_043213 from './20250411_043213';
import * as migration_20250411_043938 from './20250411_043938';
import * as migration_20250411_060639 from './20250411_060639';

export const migrations = [
  {
    up: migration_20250411_042717.up,
    down: migration_20250411_042717.down,
    name: '20250411_042717',
  },
  {
    up: migration_20250411_043213.up,
    down: migration_20250411_043213.down,
    name: '20250411_043213',
  },
  {
    up: migration_20250411_043938.up,
    down: migration_20250411_043938.down,
    name: '20250411_043938',
  },
  {
    up: migration_20250411_060639.up,
    down: migration_20250411_060639.down,
    name: '20250411_060639'
  },
];

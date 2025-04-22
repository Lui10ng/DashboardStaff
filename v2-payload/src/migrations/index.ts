import * as migration_20250411_042717 from './20250411_042717';
import * as migration_20250411_043213 from './20250411_043213';
import * as migration_20250411_043938 from './20250411_043938';
import * as migration_20250411_060639 from './20250411_060639';
import * as migration_20250413_172106 from './20250413_172106';
import * as migration_20250413_174224 from './20250413_174224';
import * as migration_20250413_175907 from './20250413_175907';
import * as migration_20250422_074139 from './20250422_074139';

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
    name: '20250411_060639',
  },
  {
    up: migration_20250413_172106.up,
    down: migration_20250413_172106.down,
    name: '20250413_172106',
  },
  {
    up: migration_20250413_174224.up,
    down: migration_20250413_174224.down,
    name: '20250413_174224',
  },
  {
    up: migration_20250413_175907.up,
    down: migration_20250413_175907.down,
    name: '20250413_175907',
  },
  {
    up: migration_20250422_074139.up,
    down: migration_20250422_074139.down,
    name: '20250422_074139'
  },
];

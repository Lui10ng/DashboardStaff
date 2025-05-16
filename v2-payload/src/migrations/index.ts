import * as migration_20250514_010503 from './20250514_010503';
import * as migration_20250514_020041 from './20250514_020041';
import * as migration_20250515_031208 from './20250515_031208';
import * as migration_20250515_050444 from './20250515_050444';
import * as migration_20250515_070131 from './20250515_070131';
import * as migration_20250516_033234 from './20250516_033234';

export const migrations = [
  {
    up: migration_20250514_010503.up,
    down: migration_20250514_010503.down,
    name: '20250514_010503',
  },
  {
    up: migration_20250514_020041.up,
    down: migration_20250514_020041.down,
    name: '20250514_020041',
  },
  {
    up: migration_20250515_031208.up,
    down: migration_20250515_031208.down,
    name: '20250515_031208',
  },
  {
    up: migration_20250515_050444.up,
    down: migration_20250515_050444.down,
    name: '20250515_050444',
  },
  {
    up: migration_20250515_070131.up,
    down: migration_20250515_070131.down,
    name: '20250515_070131',
  },
  {
    up: migration_20250516_033234.up,
    down: migration_20250516_033234.down,
    name: '20250516_033234'
  },
];

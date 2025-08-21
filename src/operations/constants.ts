import { PresetNames } from './enums';
import type { Preset } from './types';

export const presets: Preset[] = [
  { name: PresetNames.CLASSIC, spec: { sugar: 2, lemons: 2, ice: 3 } },
  { name: PresetNames.LOW_SUGAR, spec: { sugar: 1, lemons: 2, ice: 3 } },
  { name: PresetNames.EXTRA_LEMONS, spec: { sugar: 2, lemons: 4, ice: 3 } },
  { name: PresetNames.NO_ICE, spec: { sugar: 2, lemons: 2, ice: 0 } },
];

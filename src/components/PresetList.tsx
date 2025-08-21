import React from 'react';
import type { LemonadeSpec, Preset } from '../types';

interface PresetListProps {
  onPresetSelect: (spec: LemonadeSpec) => void;
}

const presets: Preset[] = [
  { name: 'Classic', spec: { sugar: 2, lemons: 2, ice: 3 } },
  { name: 'Low Sugar', spec: { sugar: 1, lemons: 2, ice: 3 } },
  { name: 'Extra Lemons', spec: { sugar: 2, lemons: 4, ice: 3 } },
  { name: 'No Ice', spec: { sugar: 2, lemons: 2, ice: 0 } },
];

const PresetList: React.FC<PresetListProps> = ({ onPresetSelect }) => {
  return (
    <div className='presets'>
      {presets.map((preset) => (
        <button
          key={preset.name}
          className='preset-btn'
          onClick={() => onPresetSelect(preset.spec)}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};

export default PresetList;

import React from 'react';
import type { Spec } from '../operations/types';
import { presets } from '../operations/constants';

interface PresetListProps {
  onPresetSelect: (spec: Spec) => void;
}

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

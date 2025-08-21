import React from 'react';
import type { Spec } from '../operations/types';
import Stepper from './Stepper';
import { useStore } from '../store';

interface StepperGroupProps {
  spec: Spec;
  onSpecChange: (spec: Spec) => void;
}

const StepperGroup: React.FC<StepperGroupProps> = ({ spec, onSpecChange }) => {
  const { pricing } = useStore();

  const updateLevel = (key: keyof Spec, value: number) => {
    const clampedValue = Math.max(0, Math.min(5, value)) as
      | 0
      | 1
      | 2
      | 3
      | 4
      | 5;
    onSpecChange({ ...spec, [key]: clampedValue });
  };

  return (
    <div className='steppers'>
      {pricing.extras?.map((extra) => (
        <Stepper
          key={extra.id}
          label={extra.label}
          unit={extra.unit}
          value={spec[extra.item]}
          onDecrease={() => updateLevel(extra.item, spec[extra.item] - 1)}
          onIncrease={() => updateLevel(extra.item, spec[extra.item] + 1)}
        />
      ))}

      <Stepper
        label='Lemons'
        unit='wedges'
        value={spec.lemons}
        onDecrease={() => updateLevel('lemons', spec.lemons - 1)}
        onIncrease={() => updateLevel('lemons', spec.lemons + 1)}
      />

      <Stepper
        label='Ice'
        unit='cubes'
        value={spec.ice}
        onDecrease={() => updateLevel('ice', spec.ice - 1)}
        onIncrease={() => updateLevel('ice', spec.ice + 1)}
      />
    </div>
  );
};

export default StepperGroup;

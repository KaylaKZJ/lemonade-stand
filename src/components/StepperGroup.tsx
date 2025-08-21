import React from 'react';
import type { LemonadeSpec } from '../types';
import Stepper from './Stepper';

interface StepperGroupProps {
  spec: LemonadeSpec;
  onSpecChange: (spec: LemonadeSpec) => void;
}

const StepperGroup: React.FC<StepperGroupProps> = ({ spec, onSpecChange }) => {
  const updateLevel = (key: keyof LemonadeSpec, value: number) => {
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
      <Stepper
        label='Sugar'
        unit='tsp'
        value={spec.sugar}
        onDecrease={() => updateLevel('sugar', spec.sugar - 1)}
        onIncrease={() => updateLevel('sugar', spec.sugar + 1)}
      />

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

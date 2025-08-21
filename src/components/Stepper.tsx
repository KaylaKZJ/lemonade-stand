import React from 'react';

interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onDecrease: () => void;
  onIncrease: () => void;
  unit?: string;
}

const Stepper: React.FC<StepperProps> = ({
  label,
  value,
  min = 0,
  max = 5,
  onDecrease,
  onIncrease,
  unit = '',
}) => {
  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <div className='stepper'>
      <span className='stepper-label'>
        {label} {unit && `(${unit})`}
      </span>
      <div className='stepper-controls'>
        <button
          className='stepper-btn'
          onClick={onDecrease}
          disabled={isAtMin}
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          −
        </button>
        <span className='stepper-value'>{value}</span>
        <button
          className='stepper-btn'
          onClick={onIncrease}
          disabled={isAtMax}
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Stepper;

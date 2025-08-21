import React from 'react';
import type { LemonadeSpec } from '../types';
import { useLemonadeStore } from '../store';
import { calculateUnitPrice, formatCurrency } from '../utils';

interface CustomizerProps {
  spec: LemonadeSpec;
  onSpecChange: (spec: LemonadeSpec) => void;
}

const Customizer: React.FC<CustomizerProps> = ({ spec, onSpecChange }) => {
  const pricing = useLemonadeStore((state) => state.pricing);
  const addLemonade = useLemonadeStore((state) => state.addLemonade);
  const order = useLemonadeStore((state) => state.order);

  const unitPrice = calculateUnitPrice(spec, pricing);
  const isMaxItems = order.items.length >= 10;

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

  const handleAdd = () => {
    if (!isMaxItems) {
      addLemonade(spec);
      onSpecChange(pricing.defaultSpec);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className='customizer' onKeyDown={handleKeyDown} tabIndex={0}>
      <h3>Build Your Lemonade</h3>

      <div className='price-preview'>
        <div className='price-preview-amount'>
          {formatCurrency(unitPrice, pricing.currency)}
        </div>
      </div>

      <div className='steppers'>
        <div className='stepper'>
          <span className='stepper-label'>Sugar (tsp)</span>
          <div className='stepper-controls'>
            <button
              className='stepper-btn'
              onClick={() => updateLevel('sugar', spec.sugar - 1)}
              disabled={spec.sugar === 0}
              aria-label='Decrease sugar'
            >
              −
            </button>
            <span className='stepper-value'>{spec.sugar}</span>
            <button
              className='stepper-btn'
              onClick={() => updateLevel('sugar', spec.sugar + 1)}
              disabled={spec.sugar === 5}
              aria-label='Increase sugar'
            >
              +
            </button>
          </div>
        </div>

        <div className='stepper'>
          <span className='stepper-label'>Lemons (wedges)</span>
          <div className='stepper-controls'>
            <button
              className='stepper-btn'
              onClick={() => updateLevel('lemons', spec.lemons - 1)}
              disabled={spec.lemons === 0}
              aria-label='Decrease lemons'
            >
              −
            </button>
            <span className='stepper-value'>{spec.lemons}</span>
            <button
              className='stepper-btn'
              onClick={() => updateLevel('lemons', spec.lemons + 1)}
              disabled={spec.lemons === 5}
              aria-label='Increase lemons'
            >
              +
            </button>
          </div>
        </div>

        <div className='stepper'>
          <span className='stepper-label'>Ice (cubes)</span>
          <div className='stepper-controls'>
            <button
              className='stepper-btn'
              onClick={() => updateLevel('ice', spec.ice - 1)}
              disabled={spec.ice === 0}
              aria-label='Decrease ice'
            >
              −
            </button>
            <span className='stepper-value'>{spec.ice}</span>
            <button
              className='stepper-btn'
              onClick={() => updateLevel('ice', spec.ice + 1)}
              disabled={spec.ice === 5}
              aria-label='Increase ice'
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className='quantity-hint'>Items: {order.items.length} / 10</div>

      <button
        className='btn btn-primary'
        onClick={handleAdd}
        disabled={isMaxItems}
        style={{ width: '100%' }}
      >
        Add Lemonade
      </button>
    </div>
  );
};

export default Customizer;

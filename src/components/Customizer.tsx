import React from 'react';
import type { LemonadeSpec } from '../types';
import { useLemonadeStore } from '../store';
import { calculateUnitPrice, formatCurrency } from '../utils';
import PricePreview from './PricePreview';
import StepperGroup from './StepperGroup';
import QuantityHint from './QuantityHint';

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

      <PricePreview
        price={formatCurrency(unitPrice, pricing.currency)}
        label='Unit Price'
      />

      <StepperGroup spec={spec} onSpecChange={onSpecChange} />

      <QuantityHint current={order.items.length} max={10} />

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

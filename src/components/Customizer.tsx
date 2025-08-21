import React from 'react';
import type { Spec } from '../operations/types';
import { useStore } from '../store';
import { calculateUnitPrice, formatCurrency } from '../operations/utils';
import PricePreview from './PricePreview';
import StepperGroup from './StepperGroup';
import QuantityHint from './QuantityHint';

interface CustomizerProps {
  spec: Spec;
  onSpecChange: (spec: Spec) => void;
}

const Customizer: React.FC<CustomizerProps> = ({ spec, onSpecChange }) => {
  const pricing = useStore((state) => state.pricing);
  const add = useStore((state) => state.add);
  const order = useStore((state) => state.order);

  const unitPrice = calculateUnitPrice(spec, pricing);
  const isMaxItems = order.items.length >= 10;

  const handleAdd = () => {
    if (!isMaxItems) {
      add(spec);
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
        Add
      </button>
    </div>
  );
};

export default Customizer;

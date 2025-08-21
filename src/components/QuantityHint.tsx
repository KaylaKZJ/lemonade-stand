import React from 'react';

interface QuantityHintProps {
  current: number;
  max: number;
  label?: string;
}

const QuantityHint: React.FC<QuantityHintProps> = ({
  current,
  max,
  label = 'Items',
}) => {
  const isNearLimit = current >= max * 0.8;
  const isAtLimit = current >= max;

  return (
    <div
      className='quantity-hint'
      style={{
        color: isAtLimit ? '#E74C3C' : isNearLimit ? '#F39C12' : '#6C757D',
      }}
      aria-live='polite'
    >
      {label}: {current} / {max}
      {isAtLimit && ' (Maximum reached)'}
    </div>
  );
};

export default QuantityHint;

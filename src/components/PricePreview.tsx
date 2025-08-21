import React from 'react';

interface PricePreviewProps {
  price: string;
  label?: string;
}

const PricePreview: React.FC<PricePreviewProps> = ({
  price,
  label = 'Price',
}) => {
  return (
    <div className='price-preview'>
      <div
        className='price-preview-amount'
        aria-label={`Current ${label.toLowerCase()}`}
      >
        {price}
      </div>
    </div>
  );
};

export default PricePreview;

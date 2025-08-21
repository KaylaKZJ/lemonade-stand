import React from 'react';
import type { LemonadeItem } from '../types';
import { useLemonadeStore } from '../store';
import { formatCurrency } from '../utils';

interface CartItemProps {
  item: LemonadeItem;
  onEdit: (item: LemonadeItem) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onEdit }) => {
  const { removeLemonade, duplicateLemonade, pricing } = useLemonadeStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      removeLemonade(item.id);
    } else if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      duplicateLemonade(item.id);
    }
  };

  return (
    <div className='cart-item' tabIndex={0} onKeyDown={handleKeyDown}>
      <div className='cart-item-header'>
        <div className='cart-item-price'>
          {formatCurrency(item.unitPrice, pricing.currency)}
        </div>
      </div>

      <div className='cart-item-spec'>
        <div className='spec-chips'>
          <span className='spec-chip'>Sugar: {item.spec.sugar}</span>
          <span className='spec-chip'>Lemons: {item.spec.lemons}</span>
          <span className='spec-chip'>Ice: {item.spec.ice}</span>
        </div>
      </div>

      <div className='cart-item-actions'>
        <button
          className='btn btn-small btn-secondary'
          onClick={() => onEdit(item)}
        >
          Edit
        </button>
        <button
          className='btn btn-small btn-secondary'
          onClick={() => duplicateLemonade(item.id)}
        >
          Duplicate
        </button>
        <button
          className='btn btn-small btn-danger'
          onClick={() => removeLemonade(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default React.memo(CartItem);

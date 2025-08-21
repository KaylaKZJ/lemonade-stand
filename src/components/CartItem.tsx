import React from 'react';
import type { Item } from '../operations/types';
import { useStore } from '../store';
import { formatCurrency } from '../operations/utils';

interface CartItemProps {
  item: Item;
  onEdit: (item: Item) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onEdit }) => {
  const { remove, duplicate, pricing } = useStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      remove(item.id);
    } else if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      duplicate(item.id);
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
          onClick={() => duplicate(item.id)}
        >
          Duplicate
        </button>
        <button
          className='btn btn-small btn-danger'
          onClick={() => remove(item.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default React.memo(CartItem);

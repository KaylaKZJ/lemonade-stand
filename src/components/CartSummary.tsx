import React, { useState } from 'react';
import type { Item } from '../operations/types';
import { useStore } from '../store';
import { formatCurrency } from '../operations/utils';
import CartItem from './CartItem';
import Customizer from './Customizer';

const CartSummary: React.FC = () => {
  const { order, pricing, clearOrder, showPaymentModal } = useStore();
  const [edit, setEdit] = useState({
    item: null as Item | null,
    spec: pricing.defaultSpec,
  });

  const handleEdit = (item: Item) => {
    setEdit({
      item,
      spec: item.spec,
    });
  };

  const handleSaveEdit = () => {
    if (edit.item) {
      useStore.getState().update(edit.item.id, edit.spec);
      clearEdit();
    }
  };

  const handleCancelEdit = () => {
    clearEdit();
  };

  const clearEdit = () => {
    setEdit({
      item: null,
      spec: pricing.defaultSpec,
    });
  };

  const handleClearOrder = () => {
    if (window.confirm('Discard current order?')) {
      clearOrder();
    }
  };

  const handleTakePayment = () => {
    showPaymentModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'p' || e.key === 'P') {
      if (order.items.length > 0) {
        e.preventDefault();
        handleTakePayment();
      }
    }
  };

  if (order.items.length === 0) {
    return (
      <div className='card'>
        <div className='empty-state'>
          <div className='empty-state-icon'>🍋</div>
          <h3>Your cart is empty</h3>
          <p>Build your first !</p>
        </div>
      </div>
    );
  }

  return (
    <div className='card' onKeyDown={handleKeyDown} tabIndex={0}>
      <h3 style={{ marginBottom: '16px', color: '#2C3E50' }}>Your Order</h3>

      {edit.item ? (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '16px' }}>Edit </h4>
          <Customizer
            spec={edit.spec}
            onSpecChange={(spec) => setEdit((prev) => ({ ...prev, spec }))}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className='btn btn-primary' onClick={handleSaveEdit}>
              Save Changes
            </button>
            <button className='btn btn-secondary' onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='cart-items'>
            {order.items.map((item) => (
              <CartItem key={item.id} item={item} onEdit={handleEdit} />
            ))}
          </div>

          <div className='totals'>
            <div className='totals-row'>
              <span>Subtotal:</span>
              <span>{formatCurrency(order.subtotal, pricing.currency)}</span>
            </div>
            {pricing.taxRate && pricing.taxRate > 0 && (
              <div className='totals-row'>
                <span>Tax ({(pricing.taxRate * 100).toFixed(1)}%):</span>
                <span>{formatCurrency(order.tax, pricing.currency)}</span>
              </div>
            )}
            <div className='totals-row total'>
              <span>Total:</span>
              <span>{formatCurrency(order.total, pricing.currency)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className='btn btn-secondary'
              onClick={handleClearOrder}
              style={{ flex: 1 }}
            >
              Clear Order
            </button>
            <button
              className='btn btn-primary'
              onClick={handleTakePayment}
              disabled={order.items.length === 0}
              style={{ flex: 2 }}
            >
              Take Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSummary;

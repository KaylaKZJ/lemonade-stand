import React, { useState, useEffect } from 'react';
import { useLemonadeStore } from '../store';
import { formatCurrency } from '../utils';

const PaymentModal: React.FC = () => {
  const { order, pricing, ui, hidePaymentModal, processPayment } =
    useLemonadeStore();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'other'>(
    'cash'
  );
  const [cashAmount, setCashAmount] = useState('');
  const [error, setError] = useState('');

  const parsedCashAmount = parseFloat(cashAmount) || 0;
  const change = parsedCashAmount - order.total;
  const isValidCash =
    paymentMethod !== 'cash' || parsedCashAmount >= order.total;

  useEffect(() => {
    if (ui.showPayment) {
      setCashAmount(order.total.toFixed(2));
      setError('');
    }
  }, [ui.showPayment, order.total]);

  useEffect(() => {
    if (
      paymentMethod === 'cash' &&
      parsedCashAmount > 0 &&
      parsedCashAmount < order.total
    ) {
      setError('Insufficient cash amount');
    } else {
      setError('');
    }
  }, [paymentMethod, parsedCashAmount, order.total]);

  if (!ui.showPayment) return null;

  const handleConfirmPayment = () => {
    if (paymentMethod === 'cash') {
      if (parsedCashAmount < order.total) {
        setError('Insufficient cash amount');
        return;
      }
      processPayment('cash', parsedCashAmount);
    } else {
      processPayment(paymentMethod);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      hidePaymentModal();
    }
  };

  return (
    <div className='modal-backdrop' onClick={handleBackdropClick}>
      <div className='modal'>
        <div className='modal-header'>
          <h2 className='modal-title'>Process Payment</h2>
          <button className='modal-close' onClick={hidePaymentModal}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#2C3E50',
              marginBottom: '20px',
            }}
          >
            Total Due: {formatCurrency(order.total, pricing.currency)}
          </div>
        </div>

        <div className='payment-methods'>
          <button
            className={`payment-method ${
              paymentMethod === 'cash' ? 'active' : ''
            }`}
            onClick={() => setPaymentMethod('cash')}
          >
            Cash
          </button>
          <button
            className={`payment-method ${
              paymentMethod === 'card' ? 'active' : ''
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            Card
          </button>
          <button
            className={`payment-method ${
              paymentMethod === 'other' ? 'active' : ''
            }`}
            onClick={() => setPaymentMethod('other')}
          >
            Other
          </button>
        </div>

        {paymentMethod === 'cash' && (
          <div className='cash-input'>
            <div className='form-group'>
              <label className='form-label' htmlFor='cash-amount'>
                Amount Given
              </label>
              <input
                id='cash-amount'
                type='number'
                step='0.01'
                min='0'
                className='form-input'
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder='Enter cash amount'
              />
            </div>

            {error && (
              <div
                style={{
                  color: '#E74C3C',
                  fontSize: '0.875rem',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            {parsedCashAmount >= order.total && change > 0 && (
              <div className='change-amount'>
                <div className='change-label'>Change to give:</div>
                <div className='change-value'>
                  {formatCurrency(change, pricing.currency)}
                </div>
              </div>
            )}
          </div>
        )}

        <div className='modal-actions'>
          <button className='btn btn-secondary' onClick={hidePaymentModal}>
            Cancel
          </button>
          <button
            className='btn btn-primary'
            onClick={handleConfirmPayment}
            disabled={!isValidCash}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

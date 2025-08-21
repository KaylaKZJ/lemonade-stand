import React from 'react';
import { useLemonadeStore } from '../store';
import { formatCurrency } from '../utils';

const ReceiptModal: React.FC = () => {
  const { order, pricing, ui, hideReceiptModal, startNewOrder } =
    useLemonadeStore();

  if (!ui.showReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleNewOrder = () => {
    startNewOrder();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      hideReceiptModal();
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPaymentMethodDisplay = () => {
    if (!order.payment) return 'Unknown';

    const { method, amount, change } = order.payment;
    const methodName = method.charAt(0).toUpperCase() + method.slice(1);

    if (method === 'cash' && change !== undefined && change > 0) {
      return `${methodName} - Paid: ${formatCurrency(
        amount,
        pricing.currency
      )}, Change: ${formatCurrency(change, pricing.currency)}`;
    }

    return methodName;
  };

  return (
    <div className='modal-backdrop' onClick={handleBackdropClick}>
      <div className='modal'>
        <div className='modal-header'>
          <h2 className='modal-title'>Receipt</h2>
          <button className='modal-close' onClick={hideReceiptModal}>
            ×
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              marginBottom: '8px',
              color: '#2C3E50',
            }}
          >
            🍋 Sunny's Lemonade Stand
          </h1>
          <div style={{ fontSize: '0.875rem', color: '#6C757D' }}>
            Order #{order.id}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6C757D' }}>
            {formatDateTime(order.createdAt)}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E9ECEF' }}>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '8px 0',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#495057',
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '8px 0',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#495057',
                  }}
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ padding: '8px 0' }}>
                    <div style={{ marginBottom: '4px' }}>
                      Lemonade #{index + 1}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#6C757D',
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span>Sugar:{item.spec.sugar}</span>
                      <span>Lemons:{item.spec.lemons}</span>
                      <span>Ice:{item.spec.ice}</span>
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '8px 0',
                      verticalAlign: 'top',
                    }}
                  >
                    {formatCurrency(item.unitPrice, pricing.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            borderTop: '1px solid #E9ECEF',
            paddingTop: '16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal, pricing.currency)}</span>
          </div>

          {pricing.taxRate && pricing.taxRate > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span>Tax ({(pricing.taxRate * 100).toFixed(1)}%):</span>
              <span>{formatCurrency(order.tax, pricing.currency)}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.125rem',
              fontWeight: '700',
              paddingTop: '8px',
              borderTop: '1px solid #E9ECEF',
            }}
          >
            <span>Total:</span>
            <span>{formatCurrency(order.total, pricing.currency)}</span>
          </div>
        </div>

        <div
          style={{
            marginBottom: '20px',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6C757D',
          }}
        >
          Payment Method: {getPaymentMethodDisplay()}
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6C757D',
            marginBottom: '20px',
          }}
        >
          Thank you for your business! 🌞
        </div>

        <div className='modal-actions'>
          <button className='btn btn-secondary' onClick={handlePrint}>
            Print Receipt
          </button>
          <button className='btn btn-primary' onClick={handleNewOrder}>
            New Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

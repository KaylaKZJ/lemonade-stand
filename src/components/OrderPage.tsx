import React, { useState } from 'react';
import { useLemonadeStore } from '../store';
import PresetList from './PresetList';
import Customizer from './Customizer';
import CartSummary from './CartSummary';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';
import SettingsDrawer from './SettingsDrawer';
import Toast from './Toast';

const OrderPage: React.FC = () => {
  const { pricing, showSettingsDrawer } = useLemonadeStore();
  const [currentSpec, setCurrentSpec] = useState(pricing.defaultSpec);

  return (
    <div className='app'>
      <div className='app-header'>
        <h1 className='app-title'>🍋 Sunny's Lemonade Stand</h1>
        <button
          className='btn btn-icon'
          onClick={showSettingsDrawer}
          style={{ position: 'absolute', top: '20px', right: '20px' }}
          aria-label='Settings'
        >
          ⚙️
        </button>
      </div>

      <div className='main-content'>
        <div className='card'>
          <h2 style={{ marginBottom: '20px', color: '#2C3E50' }}>
            Build Your Lemonade
          </h2>
          <PresetList onPresetSelect={setCurrentSpec} />
          <Customizer spec={currentSpec} onSpecChange={setCurrentSpec} />
        </div>
        <CartSummary />
      </div>

      <PaymentModal />
      <ReceiptModal />
      <SettingsDrawer />
      <Toast />
    </div>
  );
};

export default OrderPage;

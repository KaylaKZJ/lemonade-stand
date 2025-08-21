import React, { useState, useEffect } from 'react';
import { useLemonadeStore } from '../store';
import type { PricingRules } from '../types';

const SettingsDrawer: React.FC = () => {
  const { pricing, ui, hideSettingsDrawer, updatePricing } = useLemonadeStore();
  const [localPricing, setLocalPricing] = useState<PricingRules>(pricing);

  useEffect(() => {
    setLocalPricing(pricing);
  }, [pricing, ui.showSettings]);

  if (!ui.showSettings) return null;

  const handleSave = () => {
    updatePricing(localPricing);
    hideSettingsDrawer();
  };

  const handleCancel = () => {
    setLocalPricing(pricing);
    hideSettingsDrawer();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const updateDefaultSpec = (
    field: keyof typeof localPricing.defaultSpec,
    value: number
  ) => {
    const clampedValue = Math.max(0, Math.min(5, value)) as
      | 0
      | 1
      | 2
      | 3
      | 4
      | 5;
    setLocalPricing((prev) => ({
      ...prev,
      defaultSpec: {
        ...prev.defaultSpec,
        [field]: clampedValue,
      },
    }));
  };

  return (
    <div className='settings-backdrop' onClick={handleBackdropClick}>
      <div className='settings-drawer'>
        <div className='settings-header'>
          <h2>Settings</h2>
          <button className='modal-close' onClick={handleCancel}>
            ×
          </button>
        </div>

        <div className='settings-content'>
          <div className='settings-section'>
            <h4>Pricing</h4>

            <div className='form-group'>
              <label className='form-label' htmlFor='base-price'>
                Base Price ({localPricing.currency})
              </label>
              <input
                id='base-price'
                type='number'
                step='0.01'
                min='0'
                className='form-input'
                value={localPricing.basePrice}
                onChange={(e) =>
                  setLocalPricing((prev) => ({
                    ...prev,
                    basePrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className='form-group'>
              <label className='form-label' htmlFor='sugar-step'>
                Sugar Step Price ({localPricing.currency})
              </label>
              <input
                id='sugar-step'
                type='number'
                step='0.01'
                min='0'
                className='form-input'
                value={localPricing.sugarStepPrice || 0}
                onChange={(e) =>
                  setLocalPricing((prev) => ({
                    ...prev,
                    sugarStepPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className='form-group'>
              <label className='form-label' htmlFor='lemon-step'>
                Lemon Step Price ({localPricing.currency})
              </label>
              <input
                id='lemon-step'
                type='number'
                step='0.01'
                min='0'
                className='form-input'
                value={localPricing.lemonStepPrice || 0}
                onChange={(e) =>
                  setLocalPricing((prev) => ({
                    ...prev,
                    lemonStepPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className='form-group'>
              <label className='form-label' htmlFor='ice-step'>
                Ice Step Price ({localPricing.currency})
              </label>
              <input
                id='ice-step'
                type='number'
                step='0.01'
                min='0'
                className='form-input'
                value={localPricing.iceStepPrice || 0}
                onChange={(e) =>
                  setLocalPricing((prev) => ({
                    ...prev,
                    iceStepPrice: parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className='form-group'>
              <label className='form-label' htmlFor='tax-rate'>
                Tax Rate (0.00 - 0.25)
              </label>
              <input
                id='tax-rate'
                type='number'
                step='0.01'
                min='0'
                max='0.25'
                className='form-input'
                value={localPricing.taxRate || 0}
                onChange={(e) =>
                  setLocalPricing((prev) => ({
                    ...prev,
                    taxRate: Math.min(
                      0.25,
                      Math.max(0, parseFloat(e.target.value) || 0)
                    ),
                  }))
                }
              />
            </div>

            <div className='form-group'>
              <label className='form-label' htmlFor='currency'>
                Currency
              </label>
              <select
                id='currency'
                className='form-input'
                value={localPricing.currency}
                onChange={(e) =>
                  setLocalPricing((prev) => ({
                    ...prev,
                    currency: e.target.value,
                  }))
                }
              >
                <option value='ZAR'>South African Rand (ZAR)</option>
                <option value='USD'>US Dollar (USD)</option>
                <option value='EUR'>Euro (EUR)</option>
                <option value='GBP'>British Pound (GBP)</option>
              </select>
            </div>
          </div>

          <div className='settings-section'>
            <h4>Default Recipe</h4>

            <div className='steppers'>
              <div className='stepper'>
                <span className='stepper-label'>Sugar (tsp)</span>
                <div className='stepper-controls'>
                  <button
                    className='stepper-btn'
                    onClick={() =>
                      updateDefaultSpec(
                        'sugar',
                        localPricing.defaultSpec.sugar - 1
                      )
                    }
                    disabled={localPricing.defaultSpec.sugar === 0}
                  >
                    −
                  </button>
                  <span className='stepper-value'>
                    {localPricing.defaultSpec.sugar}
                  </span>
                  <button
                    className='stepper-btn'
                    onClick={() =>
                      updateDefaultSpec(
                        'sugar',
                        localPricing.defaultSpec.sugar + 1
                      )
                    }
                    disabled={localPricing.defaultSpec.sugar === 5}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='stepper'>
                <span className='stepper-label'>Lemons (wedges)</span>
                <div className='stepper-controls'>
                  <button
                    className='stepper-btn'
                    onClick={() =>
                      updateDefaultSpec(
                        'lemons',
                        localPricing.defaultSpec.lemons - 1
                      )
                    }
                    disabled={localPricing.defaultSpec.lemons === 0}
                  >
                    −
                  </button>
                  <span className='stepper-value'>
                    {localPricing.defaultSpec.lemons}
                  </span>
                  <button
                    className='stepper-btn'
                    onClick={() =>
                      updateDefaultSpec(
                        'lemons',
                        localPricing.defaultSpec.lemons + 1
                      )
                    }
                    disabled={localPricing.defaultSpec.lemons === 5}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='stepper'>
                <span className='stepper-label'>Ice (cubes)</span>
                <div className='stepper-controls'>
                  <button
                    className='stepper-btn'
                    onClick={() =>
                      updateDefaultSpec('ice', localPricing.defaultSpec.ice - 1)
                    }
                    disabled={localPricing.defaultSpec.ice === 0}
                  >
                    −
                  </button>
                  <span className='stepper-value'>
                    {localPricing.defaultSpec.ice}
                  </span>
                  <button
                    className='stepper-btn'
                    onClick={() =>
                      updateDefaultSpec('ice', localPricing.defaultSpec.ice + 1)
                    }
                    disabled={localPricing.defaultSpec.ice === 5}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #E9ECEF',
            }}
          >
            <button
              className='btn btn-secondary'
              onClick={handleCancel}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              className='btn btn-primary'
              onClick={handleSave}
              style={{ flex: 1 }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDrawer;

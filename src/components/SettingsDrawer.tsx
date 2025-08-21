import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import type { PricingRules } from '../operations/types';
import Stepper from './Stepper';
import { ThemeSwitcher } from './ThemeSwitcher';

const SettingsDrawer: React.FC = () => {
  const { pricing, theme, ui, hideSettingsDrawer, updatePricing, setTheme } =
    useStore();
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
              {localPricing.extras?.map((extra, index) => (
                <div key={index} className='form-group'>
                  <label className='form-label' htmlFor={`extra-${index}`}>
                    {extra.item} Price ({localPricing.currency})
                  </label>
                  <input
                    id={`extra-${index}`}
                    type='number'
                    step='0.01'
                    min='0'
                    className='form-input'
                    value={extra.price}
                    onChange={(e) => {
                      const newExtras: PricingRules['extras'] = [
                        {
                          id: extra.id,
                          item: extra.item,
                          price: parseFloat(e.target.value) || 0,
                          label: extra.label,
                          unit: extra.unit,
                        },
                      ];
                      setLocalPricing((prev) => ({
                        ...prev,
                        extras: newExtras,
                      }));
                    }}
                  />
                </div>
              ))}
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
              <Stepper
                label='Sugar'
                unit='tsp'
                value={localPricing.defaultSpec.sugar}
                onDecrease={() =>
                  updateDefaultSpec('sugar', localPricing.defaultSpec.sugar - 1)
                }
                onIncrease={() =>
                  updateDefaultSpec('sugar', localPricing.defaultSpec.sugar + 1)
                }
              />

              <Stepper
                label='Lemons'
                unit='wedges'
                value={localPricing.defaultSpec.lemons}
                onDecrease={() =>
                  updateDefaultSpec(
                    'lemons',
                    localPricing.defaultSpec.lemons - 1
                  )
                }
                onIncrease={() =>
                  updateDefaultSpec(
                    'lemons',
                    localPricing.defaultSpec.lemons + 1
                  )
                }
              />

              <Stepper
                label='Ice'
                unit='cubes'
                value={localPricing.defaultSpec.ice}
                onDecrease={() =>
                  updateDefaultSpec('ice', localPricing.defaultSpec.ice - 1)
                }
                onIncrease={() =>
                  updateDefaultSpec('ice', localPricing.defaultSpec.ice + 1)
                }
              />
            </div>
          </div>

          <div className='settings-section'>
            <h4>Appearance</h4>
            <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
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

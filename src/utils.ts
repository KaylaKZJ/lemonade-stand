import type { LemonadeSpec, PricingRules } from './types';

// Generate a simple UUID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Price calculation based on spec
export function calculateUnitPrice(
  spec: LemonadeSpec,
  pricing: PricingRules
): number {
  const {
    basePrice,
    defaultSpec,
    sugarStepPrice = 0,
    lemonStepPrice = 0,
    iceStepPrice = 0,
  } = pricing;

  const sugarUpcharge =
    Math.max(0, spec.sugar - defaultSpec.sugar) * sugarStepPrice;
  const lemonUpcharge =
    Math.max(0, spec.lemons - defaultSpec.lemons) * lemonStepPrice;
  const iceUpcharge = Math.max(0, spec.ice - defaultSpec.ice) * iceStepPrice;

  return basePrice + sugarUpcharge + lemonUpcharge + iceUpcharge;
}

// Calculate order totals
export function calculateOrderTotals(
  items: { unitPrice: number }[],
  taxRate: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = 'ZAR'
): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency === 'ZAR' ? 'ZAR' : currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format spec for display
export function formatSpec(spec: LemonadeSpec): string {
  return `Sugar:${spec.sugar} Lemons:${spec.lemons} Ice:${spec.ice}`;
}

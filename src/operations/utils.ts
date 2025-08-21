import type { PricingRules, Spec } from './types';

// Generate a simple UUID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Price calculation based on spec
export function calculateUnitPrice(spec: Spec, pricing: PricingRules): number {
  const { basePrice, extras } = pricing;

  const upcharge =
    extras?.reduce((total, extra) => {
      const extraAmount = spec[extra.item as keyof Spec] || 0;
      return total + extraAmount * extra.price;
    }, 0) || 0;

  return basePrice + +upcharge;
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
export function formatSpec(spec: Spec): string {
  return `Sugar:${spec.sugar} Lemons:${spec.lemons} Ice:${spec.ice}`;
}

// Configurable levels; tweak in Settings
export type Level = 0 | 1 | 2 | 3 | 4 | 5;

export interface LemonadeSpec {
  sugar: Level; // tsp, 0-5
  lemons: Level; // wedges, 0-5
  ice: Level; // cubes, 0-5
}

export interface PricingRules {
  basePrice: number; // e.g., 15.00
  sugarStepPrice?: number; // e.g., 0.50 per tsp over default
  lemonStepPrice?: number; // e.g., 1.00 per wedge over default
  iceStepPrice?: number; // usually 0
  defaultSpec: LemonadeSpec; // e.g., { sugar:2, lemons:2, ice:3 }
  taxRate?: number; // 0.00–0.25
  currency: 'ZAR' | 'USD' | 'EUR' | string;
}

export interface LemonadeItem {
  id: string; // uuid
  spec: LemonadeSpec;
  unitPrice: number; // computed at add time
}

export interface Order {
  id: string;
  items: LemonadeItem[]; // max length 10
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean;
  createdAt: string;
  payment?: {
    method: 'cash' | 'card' | 'other';
    amount: number;
    change?: number;
  };
}

export interface AppState {
  order: Order;
  pricing: PricingRules;
  ui: {
    showPayment: boolean;
    showReceipt: boolean;
    showSettings: boolean;
    toast?: { type: 'info' | 'warn' | 'error'; msg: string };
  };
}

// Preset configurations
export interface Preset {
  name: string;
  spec: LemonadeSpec;
}

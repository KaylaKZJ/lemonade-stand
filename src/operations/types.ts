import type { PresetNames } from './enums';

// Configurable levels; tweak in Settings
export type Level = 0 | 1 | 2 | 3 | 4 | 5;

export interface Spec {
  sugar: Level; // tsp, 0-5
  lemons: Level; // wedges, 0-5
  ice: Level; // cubes, 0-5
}

export interface PricingRules {
  basePrice: number; // e.g., 15.00
  extras?: {
    id: string;
    item: keyof Spec;
    label: string;
    unit: string;
    price: number; // e.g., 0.50 per tsp over default
  }[];
  defaultSpec: Spec; // e.g., { sugar:2, lemons:2, ice:3 }
  taxRate?: number; // 0.00–0.25
  currency: 'ZAR' | 'USD' | 'EUR' | string;
}

export interface Item {
  id: string; // uuid
  spec: Spec;
  unitPrice: number; // computed at add time
}

export interface Order {
  id: string;
  items: Item[]; // max length 10
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
  currentSpec: Spec;
  theme: 'light' | 'dark' | 'high-contrast';
  ui: {
    showPayment: boolean;
    showReceipt: boolean;
    showSettings: boolean;
    toast?: { type: 'info' | 'warn' | 'error'; msg: string };
  };
}

export type PresetName =
  | PresetNames.CLASSIC
  | PresetNames.LOW_SUGAR
  | PresetNames.EXTRA_LEMONS
  | PresetNames.NO_ICE;

// Preset configurations
export interface Preset {
  name: PresetName;
  spec: Spec;
}

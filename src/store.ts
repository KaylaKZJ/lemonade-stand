import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  LemonadeItem,
  LemonadeSpec,
  Order,
  PricingRules,
} from './types';
import { generateId, calculateUnitPrice, calculateOrderTotals } from './utils';

interface LemonadeStore extends AppState {
  // Actions
  addLemonade: (spec: LemonadeSpec) => void;
  removeLemonade: (itemId: string) => void;
  updateLemonade: (itemId: string, spec: LemonadeSpec) => void;
  duplicateLemonade: (itemId: string) => void;
  clearOrder: () => void;

  // UI actions
  showPaymentModal: () => void;
  hidePaymentModal: () => void;
  showReceiptModal: () => void;
  hideReceiptModal: () => void;
  showSettingsDrawer: () => void;
  hideSettingsDrawer: () => void;
  showToast: (type: 'info' | 'warn' | 'error', msg: string) => void;
  hideToast: () => void;
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;

  // Payment
  processPayment: (method: 'cash' | 'card' | 'other', amount?: number) => void;

  // Settings
  updatePricing: (pricing: PricingRules) => void;

  // Start new order
  startNewOrder: () => void;
}

const defaultPricing: PricingRules = {
  basePrice: 15.0,
  defaultSpec: { sugar: 2, lemons: 2, ice: 3 },
  sugarStepPrice: 0.5,
  lemonStepPrice: 1.0,
  iceStepPrice: 0.0,
  taxRate: 0.15,
  currency: 'ZAR',
};

const createEmptyOrder = (): Order => ({
  id: generateId(),
  items: [],
  subtotal: 0,
  tax: 0,
  total: 0,
  paid: false,
  createdAt: new Date().toISOString(),
});

export const useLemonadeStore = create<LemonadeStore>()(
  persist(
    (set, get) => ({
      order: createEmptyOrder(),
      pricing: defaultPricing,
      theme: 'light' as const,
      ui: {
        showPayment: false,
        showReceipt: false,
        showSettings: false,
      },

      addLemonade: (spec: LemonadeSpec) => {
        const state = get();
        if (state.order.items.length >= 10) {
          set((state) => ({
            ui: {
              ...state.ui,
              toast: { type: 'warn', msg: 'Nice try! Max 10 per order.' },
            },
          }));
          return;
        }

        const unitPrice = calculateUnitPrice(spec, state.pricing);
        const newItem: LemonadeItem = {
          id: generateId(),
          spec,
          unitPrice,
        };

        const newItems = [...state.order.items, newItem];
        const totals = calculateOrderTotals(newItems, state.pricing.taxRate);

        set((state) => ({
          order: {
            ...state.order,
            items: newItems,
            ...totals,
          },
        }));
      },

      removeLemonade: (itemId: string) => {
        const state = get();
        const newItems = state.order.items.filter((item) => item.id !== itemId);
        const totals = calculateOrderTotals(newItems, state.pricing.taxRate);

        set((state) => ({
          order: {
            ...state.order,
            items: newItems,
            ...totals,
          },
        }));
      },

      updateLemonade: (itemId: string, spec: LemonadeSpec) => {
        const state = get();
        const unitPrice = calculateUnitPrice(spec, state.pricing);
        const newItems = state.order.items.map((item) =>
          item.id === itemId ? { ...item, spec, unitPrice } : item
        );
        const totals = calculateOrderTotals(newItems, state.pricing.taxRate);

        set((state) => ({
          order: {
            ...state.order,
            items: newItems,
            ...totals,
          },
        }));
      },

      duplicateLemonade: (itemId: string) => {
        const state = get();
        if (state.order.items.length >= 10) {
          set((state) => ({
            ui: {
              ...state.ui,
              toast: { type: 'warn', msg: 'Nice try! Max 10 per order.' },
            },
          }));
          return;
        }

        const itemToDuplicate = state.order.items.find(
          (item) => item.id === itemId
        );
        if (!itemToDuplicate) return;

        const newItem: LemonadeItem = {
          id: generateId(),
          spec: itemToDuplicate.spec,
          unitPrice: itemToDuplicate.unitPrice,
        };

        const newItems = [...state.order.items, newItem];
        const totals = calculateOrderTotals(newItems, state.pricing.taxRate);

        set((state) => ({
          order: {
            ...state.order,
            items: newItems,
            ...totals,
          },
        }));
      },

      clearOrder: () => {
        set({
          order: createEmptyOrder(),
        });
      },

      showPaymentModal: () =>
        set((state) => ({ ui: { ...state.ui, showPayment: true } })),
      hidePaymentModal: () =>
        set((state) => ({ ui: { ...state.ui, showPayment: false } })),
      showReceiptModal: () =>
        set((state) => ({ ui: { ...state.ui, showReceipt: true } })),
      hideReceiptModal: () =>
        set((state) => ({ ui: { ...state.ui, showReceipt: false } })),
      showSettingsDrawer: () =>
        set((state) => ({ ui: { ...state.ui, showSettings: true } })),
      hideSettingsDrawer: () =>
        set((state) => ({ ui: { ...state.ui, showSettings: false } })),

      showToast: (type, msg) =>
        set((state) => ({ ui: { ...state.ui, toast: { type, msg } } })),
      hideToast: () =>
        set((state) => ({ ui: { ...state.ui, toast: undefined } })),

      processPayment: (method, amount) => {
        const state = get();
        const total = state.order.total;

        if (method === 'cash' && amount !== undefined) {
          if (amount < total) {
            set((state) => ({
              ui: {
                ...state.ui,
                toast: { type: 'error', msg: 'Insufficient cash amount' },
              },
            }));
            return;
          }

          const change = amount - total;
          set((state) => ({
            order: {
              ...state.order,
              paid: true,
              payment: { method, amount, change },
            },
            ui: { ...state.ui, showPayment: false, showReceipt: true },
          }));
        } else {
          set((state) => ({
            order: {
              ...state.order,
              paid: true,
              payment: { method, amount: total },
            },
            ui: { ...state.ui, showPayment: false, showReceipt: true },
          }));
        }
      },

      updatePricing: (pricing) => {
        set({ pricing });
      },

      startNewOrder: () => {
        set({
          order: createEmptyOrder(),
          ui: {
            showPayment: false,
            showReceipt: false,
            showSettings: false,
          },
        });
      },

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        document.documentElement.setAttribute(
          'data-theme',
          theme === 'light' ? '' : theme
        );
      },
    }),
    {
      name: 'lemonade-store',
      partialize: (state) => ({ pricing: state.pricing }),
    }
  )
);

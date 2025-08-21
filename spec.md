Alright, here’s a clean, opinionated spec for a no-nonsense Lemonade Stand POS built in React. It’s small, fast, and impossible to confuse. You can ship this.

# Product goals (hard constraints)

- Sell up to **10 lemonades per order**. No cheating. If you try to add #11, you get a friendly “Nice try” toast and a disabled button.
- Each lemonade is customizable by **sugar**, **lemons**, **ice cubes**.
- Operable with **mouse or keyboard**; snappy on a cheap tablet.
- Minimal pages: **Order**, **Payment**, **Receipt** (and an optional **Settings** panel for prices/levels).

---

# Data model (TypeScript)

```ts
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
    toast?: { type: 'info' | 'warn' | 'error'; msg: string };
  };
}
```

**Price calculation**

- `unitPrice = basePrice + max(0, sugar - defaultSugar)*sugarStepPrice + max(0, lemons - defaultLemons)*lemonStepPrice + max(0, ice - defaultIce)*iceStepPrice`
- `subtotal = sum(unitPrice)`
- `tax = round(subtotal * taxRate, 2)`
- `total = subtotal + tax`

---

# UI/UX (single screen, modals for payment/receipt)

## 1) Order Builder (left column)

- **Preset tiles** (optional): _Classic_, _Low Sugar_, _Extra Lemons_, _No Ice_. Click to load spec into Customizer.
- **Customizer card**:

  - Three labeled steppers (Sugar / Lemons / Ice).

    - Values 0–5. Buttons: `-` / value / `+`.
    - Keyboard: focus field → ArrowLeft/Right to change.
    - Live price preview for the current spec.

  - **Add Lemonade** button (primary):

    - Enabled if `order.items.length < 10`.
    - On add: compute price, push item, reset Customizer to defaultSpec.

  - **Quantity hint**: “Items: X / 10”.

## 2) Cart Summary (right column)

- **Line items**: compact cards, each shows:

  - Spec chips: `Sugar:2 Lemons:3 Ice:1`
  - Unit price
  - Actions: **Edit**, **Duplicate**, **Remove**

    - Edit opens Customizer prefilled; on Save, updates item (reprice).

- **Totals panel**: Subtotal, Tax, Total (big, bold).
- **Actions**:

  - **Clear Order** (secondary; confirm dialog)
  - **Take Payment** (primary; disabled if 0 items)

## 3) Payment Modal

- Shows total due, accepts:

  - **Cash**: input “Amount Given” → shows **Change** auto-calculated; prevent underpay.
  - **Card/Other**: simple confirm; no amount field.

- **Confirm Payment**: marks order paid, stamps time, opens **Receipt Modal**.

## 4) Receipt Modal (printable)

- Stand name (from settings), datetime, order ID.
- List of items + specs, prices, totals, payment method.
- Buttons: **Print**, **New Order** (resets to clean slate).

## 5) Settings Drawer (gear icon)

- Pricing fields with sane validation.
- DefaultSpec steppers.
- Tax toggle/rate.
- Currency.
- (Optional) Inventory toggles (future).

---

# Components (React)

- `OrderPage`

  - `PresetList`
  - `Customizer` (controlled by local state; emits `onAdd`)
  - `CartSummary`

    - `CartItem` (edit/dup/remove)
    - `Totals`

  - `PaymentModal`
  - `ReceiptModal`
  - `SettingsDrawer`
  - `Toast`

**State management:**
Use a tiny store (Zustand or a `useReducer` + Context). Redux is overkill unless you’re role-playing Enterprise™. Persist pricing to `localStorage`.

---

# Interactions & validation

- **Max 10 items:**

  - At 10, “Add Lemonade” disables; a non-blocking toast: “Max 10 per order.”

- **Step bounds:** 0–5; arrows disable at bounds.
- **Payment:**

  - Cash must be `amount >= total` (else inline error).
  - Card/Other is a single click.

- **Editing items:** replaces item in-place, re-computes totals.
- **Clearing order:** confirm dialog “Discard current order?”

---

# Accessibility & keyboard

- All controls are native buttons/inputs; labeled.
- Tab order: Presets → Customizer steppers → Add → Cart items → Take Payment.
- Shortcuts:

  - `A` — Add Lemonade (when customizer focused)
  - `P` — Take Payment (if enabled)
  - `Backspace` on focused cart item — Remove
  - `Ctrl+D` on focused cart item — Duplicate

- Announce toasts with `aria-live="polite"`.

---

# Visual design (fast to implement)

- Two-column layout (stack on mobile).
- Big, thumb-friendly steppers (40px targets).
- Spec chips readable at a glance.
- Total in large type; payment button high-contrast.

---

# Performance

- It’s tiny. Still:

  - Memoize `CartItem`.
  - Price computation is O(n) over ≤10 items—trivial.
  - Debounce settings updates to `localStorage`.

---

# Testing

- **Unit (Jest + RTL)**:

  - Price calc per spec combinations.
  - Max-items rule.
  - Cash change math and underpay validation.

- **E2E (Playwright)**:

  - Happy path: add → pay card → receipt → new order.
  - Cash with change.
  - Edit/duplicate flows.
  - Keyboard-only flow.

---

# Empty/error states

- Empty cart: show illustration + “Build your first lemonade”.
- Network is local-only for v1; no API errors. If you later add remote settings, show retry & offline cache.

---

# Internationalization

- All labels via a `t()` wrapper; currency via `Intl.NumberFormat`.
- Right-to-left safe layout if you care later.

---

# Future-proofing (optional v2)

- **Inventory** (lemons, sugar, ice) with low-stock warnings.
- **Sizes** (Small/Medium/Large) as a multiplier.
- **Modifiers** (mint, ginger) as paid add-ons.
- **PWA** with offline receipts & install banner.
- **Daily close-out report** and export CSV.

---

# Example pricing defaults (sane)

- `basePrice = 15.00`
- `defaultSpec = { sugar:2, lemons:2, ice:3 }`
- `sugarStepPrice = 0.50`
- `lemonStepPrice = 1.00`
- `iceStepPrice = 0.00`
- `taxRate = 0.15`
- `currency = "ZAR"`

---

# Strong opinions (so you don’t overbuild)

- Keep it **single-screen**. Speed beats fancy routes.
- Use **Zustand** or `useReducer`. Don’t summon Redux for 10 items.
- No drag-and-drop. Buttons are faster and more accessible.
- Don’t over-theme. Contrast > cuteness. You’re selling lemonade, not vibes.

If you want, I can turn this into a starter React + TypeScript codebase with the components scaffolded and a working price engine.

/**
 * Stock quantity threshold below which a product is considered "Low Stock".
 * Kept here as the single source of truth used by components, charts, and filters.
 */
export const LOW_STOCK_THRESHOLD = 10;

/**
 * Derives a stock status string from a quantity.
 * @param {number} qty - Current stock quantity (must be >= 0)
 * @returns {'in' | 'low' | 'out'}
 */
export const getStockStatus = (qty) => {
  if (qty <= 0) return 'out';
  if (qty <= LOW_STOCK_THRESHOLD) return 'low';
  return 'in';
};

/**
 * Human-readable labels for each stock status.
 * @type {Record<'in'|'low'|'out', string>}
 */
export const STOCK_STATUS_LABELS = {
  in: 'In Stock',
  low: 'Low Stock',
  out: 'Out of Stock',
};

/**
 * MUI palette color keys for each stock status.
 * Used for Chip colors, chart fills, and category table pills.
 * @type {Record<'in'|'low'|'out', string>}
 */
export const STOCK_STATUS_PALETTE_KEYS = {
  in: 'success',
  low: 'warning',
  out: 'error',
};

/**
 * Hex color values used in Recharts (which can't read MUI theme tokens directly).
 * These mirror the values in theme.js — update both if changing the palette.
 * @type {{ light: Record<string,string>, dark: Record<string,string> }}
 */
export const CHART_COLORS = {
  light: {
    in: '#22c55e',
    low: '#f59e0b',
    out: '#ef4444',
  },
  dark: {
    in: '#4ade80',
    low: '#fcd34d',
    out: '#f87171',
  },
};

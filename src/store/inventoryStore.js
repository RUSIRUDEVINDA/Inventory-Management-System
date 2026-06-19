import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateProductId } from '../lib/generateProductId';

/**
 * @typedef {Object} Product
 * @property {string} id         - Auto-generated ID in format PRD######
 * @property {string} name       - Product name (min 2 chars)
 * @property {string} category   - Category name (must exist in categories array)
 * @property {number} price      - Price in USD (positive, 2 decimal places)
 * @property {number} stockQty   - Current stock quantity (always >= 0)
 * @property {string} createdAt  - ISO 8601 timestamp
 */

/**
 * @typedef {Object} StockLogEntry
 * @property {string} id          - Unique log entry ID
 * @property {string} productId   - ID of the affected product
 * @property {string} productName - Snapshot of product name at the time of change
 * @property {number} delta       - Positive = stock added, negative = stock removed
 * @property {string} timestamp   - ISO 8601 timestamp
 */

/**
 * @typedef {Object} InventoryState
 * @property {Product[]}       products     - All products
 * @property {string[]}        categories   - Available category names
 * @property {StockLogEntry[]} stockHistory - Stock change log (newest first)
 */

const DEFAULT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Home & Garden',
  'Sports & Outdoors',
];

const DEFAULT_PRODUCTS = [
  {
    id: 'PRD100001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 89.99,
    stockQty: 45,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'PRD100002',
    name: 'Running Shoes',
    category: 'Sports & Outdoors',
    price: 129.5,
    stockQty: 8,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'PRD100003',
    name: 'Organic Coffee Beans',
    category: 'Food & Beverages',
    price: 24.99,
    stockQty: 0,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'PRD100004',
    name: 'LED Desk Lamp',
    category: 'Electronics',
    price: 49.99,
    stockQty: 20,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'PRD100005',
    name: 'Yoga Mat',
    category: 'Sports & Outdoors',
    price: 35.0,
    stockQty: 5,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * Main Zustand store persisted to localStorage under the key "inventory-storage".
 * All business rules are enforced here, not in UI components.
 */
const useInventoryStore = create(
  persist(
    (set, get) => ({
      // ─── State ────────────────────────────────────────────────────────────────
      /** @type {Product[]} */
      products: DEFAULT_PRODUCTS,

      /** @type {string[]} */
      categories: DEFAULT_CATEGORIES,

      /** @type {StockLogEntry[]} */
      stockHistory: [],

      // ─── Product Actions ──────────────────────────────────────────────────────

      /**
       * Add a new product. ID is auto-generated; duplicate IDs are prevented.
       * @param {Omit<Product, 'id'|'createdAt'>} data
       */
      addProduct: (data) => {
        const existingIds = get().products.map((p) => p.id);
        const id = generateProductId(existingIds);
        /** @type {Product} */
        const product = {
          id,
          name: data.name.trim(),
          category: data.category,
          price: parseFloat(parseFloat(data.price).toFixed(2)),
          stockQty: parseInt(data.stockQty, 10),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, product] }));
      },

      /**
       * Update an existing product by ID.
       * @param {string} id
       * @param {Partial<Omit<Product,'id'|'createdAt'>>} data
       */
      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  name: data.name?.trim() ?? p.name,
                  category: data.category ?? p.category,
                  price: parseFloat(parseFloat(data.price ?? p.price).toFixed(2)),
                  stockQty: parseInt(data.stockQty ?? p.stockQty, 10),
                }
              : p
          ),
        }));
      },

      /**
       * Delete a single product by ID.
       * @param {string} id
       */
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      /**
       * Delete multiple products by their IDs.
       * @param {string[]} ids
       */
      deleteProducts: (ids) => {
        const idSet = new Set(ids);
        set((state) => ({
          products: state.products.filter((p) => !idSet.has(p.id)),
        }));
      },

      // ─── Stock Actions ────────────────────────────────────────────────────────

      /**
       * Adjust the stock for a single product.
       * Business rule: stockQty is ALWAYS clamped at 0 — never goes negative.
       * Returns a result object so callers can surface errors via Snackbar.
       *
       * @param {string} id  - Product ID
       * @param {number} delta - Positive to add, negative to remove
       * @returns {{ success: boolean, message?: string }}
       */
      adjustStock: (id, delta) => {
        const products = get().products;
        const product = products.find((p) => p.id === id);

        if (!product) {
          return { success: false, message: 'Product not found.' };
        }

        if (delta < 0 && product.stockQty === 0) {
          return {
            success: false,
            message: `"${product.name}" is already out of stock.`,
          };
        }

        if (delta < 0 && product.stockQty + delta < 0) {
          return {
            success: false,
            message: `Cannot reduce "${product.name}" below 0. Only ${product.stockQty} unit(s) available.`,
          };
        }

        // Clamp in the store — zero-floor is enforced here regardless of caller
        const newQty = Math.max(0, product.stockQty + delta);
        const actualDelta = newQty - product.stockQty;

        /** @type {StockLogEntry} */
        const logEntry = {
          id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          productId: id,
          productName: product.name,
          delta: actualDelta,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, stockQty: newQty } : p
          ),
          stockHistory: [logEntry, ...state.stockHistory],
        }));

        return { success: true };
      },

      /**
       * Restock multiple products by a fixed amount.
       * @param {string[]} ids   - Product IDs to restock
       * @param {number}   amount - Positive integer to add
       */
      bulkRestock: (ids, amount) => {
        const parsedAmount = Math.max(1, parseInt(amount, 10));
        const products = get().products;
        const timestamp = new Date().toISOString();
        const newLogs = [];

        const updatedProducts = products.map((p) => {
          if (!ids.includes(p.id)) return p;
          /** @type {StockLogEntry} */
          newLogs.push({
            id: `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${p.id}`,
            productId: p.id,
            productName: p.name,
            delta: parsedAmount,
            timestamp,
          });
          return { ...p, stockQty: p.stockQty + parsedAmount };
        });

        set((state) => ({
          products: updatedProducts,
          stockHistory: [...newLogs, ...state.stockHistory],
        }));
      },

      // ─── Category Actions ─────────────────────────────────────────────────────

      /**
       * Add a new category (case-insensitive duplicate check).
       * @param {string} name
       * @returns {{ success: boolean, message?: string }}
       */
      addCategory: (name) => {
        const normalized = name.trim();
        const duplicate = get().categories.find(
          (c) => c.toLowerCase() === normalized.toLowerCase()
        );
        if (duplicate) {
          return { success: false, message: `Category "${normalized}" already exists.` };
        }
        set((state) => ({ categories: [...state.categories, normalized] }));
        return { success: true };
      },

      /**
       * Delete a category — blocked if any products still reference it.
       * @param {string} name
       * @returns {{ success: boolean, message?: string }}
       */
      deleteCategory: (name) => {
        const referencingProducts = get().products.filter((p) => p.category === name);
        if (referencingProducts.length > 0) {
          return {
            success: false,
            message: `Cannot delete "${name}" — ${referencingProducts.length} product(s) still use this category. Reassign them first.`,
          };
        }
        set((state) => ({
          categories: state.categories.filter((c) => c !== name),
        }));
        return { success: true };
      },
    }),
    {
      name: 'inventory-storage',
    }
  )
);

export default useInventoryStore;

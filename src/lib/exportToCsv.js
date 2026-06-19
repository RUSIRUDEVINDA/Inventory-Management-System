import { getStockStatus, STOCK_STATUS_LABELS } from './stockStatus';

/**
 * Converts an array of product objects to a CSV string and triggers a download.
 * No external library — built manually from the filtered product list.
 *
 * @param {import('../store/inventoryStore').Product[]} products - The filtered list to export
 * @param {string} [filename='inventory'] - Base filename (timestamp appended automatically)
 */
export const exportToCsv = (products, filename = 'inventory') => {
  const headers = [
    'Product ID',
    'Name',
    'Category',
    'Price (USD)',
    'Stock Qty',
    'Stock Status',
    'Created At',
  ];

  /**
   * Escape a field value for CSV: wrap in quotes if it contains commas, quotes, or newlines.
   * @param {string|number} value
   * @returns {string}
   */
  const escapeField = (value) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = products.map((p) => [
    escapeField(p.id),
    escapeField(p.name),
    escapeField(p.category),
    escapeField(p.price.toFixed(2)),
    escapeField(p.stockQty),
    escapeField(STOCK_STATUS_LABELS[getStockStatus(p.stockQty)]),
    escapeField(new Date(p.createdAt).toLocaleString()),
  ]);

  const csvContent = [
    headers.map(escapeField).join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

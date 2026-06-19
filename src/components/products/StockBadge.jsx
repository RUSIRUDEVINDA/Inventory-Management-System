import { Chip } from '@mui/material';
import { getStockStatus, STOCK_STATUS_LABELS } from '../../lib/stockStatus';

/**
 * Colored status pill (MUI Chip) that reads stock status from a quantity.
 * Colors come from theme.palette.success/warning/error — automatically
 * adapts to dark/light mode via the mode-aware palette in theme.js.
 *
 * @param {Object} props
 * @param {number} props.qty  - Current stock quantity
 * @param {string} [props.size] - MUI Chip size ('small' | 'medium')
 */
const StockBadge = ({ qty, size = 'small' }) => {
  const status = getStockStatus(qty);

  const paletteKey = {
    in: { bg: 'success.light', text: 'success.dark' },
    low: { bg: 'warning.light', text: 'warning.dark' },
    out: { bg: 'error.light', text: 'error.dark' },
  }[status];

  return (
    <Chip
      label={STOCK_STATUS_LABELS[status]}
      size={size}
      sx={{
        bgcolor: paletteKey.bg,
        color: paletteKey.text,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.7rem' : '0.8rem',
        height: size === 'small' ? 22 : 28,
        border: 'none',
      }}
    />
  );
};

export default StockBadge;

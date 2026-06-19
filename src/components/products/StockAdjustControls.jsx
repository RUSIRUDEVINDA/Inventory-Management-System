import { useState } from 'react';
import { Box, IconButton, TextField, Tooltip, Snackbar, Alert, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import useInventoryStore from '../../store/inventoryStore';

/**
 * Inline +/- stock controls used in the product table.
 * Every change is logged automatically by the store's adjustStock action.
 * Attempting to go below 0 is blocked and surfaces a Snackbar message.
 *
 * @param {Object} props
 * @param {string} props.productId  - Product ID to adjust
 * @param {number} props.stockQty   - Current stock quantity (for display)
 */
const StockAdjustControls = ({ productId, stockQty }) => {
  const adjustStock = useInventoryStore((s) => s.adjustStock);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleAdjust = (delta) => {
    const result = adjustStock(productId, delta);
    if (!result.success) {
      setSnackbar({ open: true, message: result.message, severity: 'warning' });
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Remove 1">
          <span>
            <IconButton
              size="small"
              onClick={() => handleAdjust(-1)}
              disabled={stockQty === 0}
              sx={{
                width: 26,
                height: 26,
                bgcolor: stockQty === 0 ? 'action.disabledBackground' : 'error.light',
                color: stockQty === 0 ? 'text.disabled' : 'error.dark',
                '&:hover': { bgcolor: 'error.main', color: '#fff' },
                transition: 'all 0.15s',
              }}
            >
              <RemoveRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ minWidth: 32, textAlign: 'center', fontSize: '0.8rem' }}
        >
          {stockQty}
        </Typography>

        <Tooltip title="Add 1">
          <IconButton
            size="small"
            onClick={() => handleAdjust(1)}
            sx={{
              width: 26,
              height: 26,
              bgcolor: 'success.light',
              color: 'success.dark',
              '&:hover': { bgcolor: 'success.main', color: '#fff' },
              transition: 'all 0.15s',
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StockAdjustControls;

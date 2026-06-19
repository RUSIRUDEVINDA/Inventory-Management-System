import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box } from '@mui/material';

/**
 * Generic confirmation dialog used for destructive actions (e.g. delete product/category).
 *
 * @param {Object}  props
 * @param {boolean} props.open            - Whether the dialog is visible
 * @param {string}  props.title           - Dialog title
 * @param {string}  props.message         - Confirmation message body
 * @param {string}  [props.confirmLabel]  - Label for the confirm button (default: "Delete")
 * @param {string}  [props.confirmColor]  - MUI color for the confirm button (default: "error")
 * @param {()=>void} props.onConfirm      - Called when user confirms
 * @param {()=>void} props.onCancel       - Called when user cancels
 */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  confirmColor = 'error',
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberRoundedIcon color="warning" />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel} size="small">
          Cancel
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          size="small"
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

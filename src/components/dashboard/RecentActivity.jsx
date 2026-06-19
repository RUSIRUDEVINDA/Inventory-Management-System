import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

/**
 * Recent stock activity list — shows the last N stock history entries.
 *
 * @param {Object}   props
 * @param {import('../../store/inventoryStore').StockLogEntry[]} props.entries
 * @param {number}   [props.limit] - Max entries to show (default: 8)
 */
const RecentActivity = ({ entries, limit = 8 }) => {
  const recent = entries.slice(0, limit);

  if (recent.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No stock activity yet. Adjust stock on any product to see history here.
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding>
      {recent.map((entry, idx) => {
        const isPositive = entry.delta > 0;
        return (
          <ListItem
            key={entry.id || idx}
            disablePadding
            sx={{
              py: 1,
              borderBottom: idx < recent.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              gap: 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isPositive ? 'success.light' : 'error.light',
                  color: isPositive ? 'success.dark' : 'error.dark',
                }}
              >
                {isPositive ? (
                  <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <TrendingDownRoundedIcon sx={{ fontSize: 16 }} />
                )}
              </Box>
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={500} noWrap>
                  {entry.productName}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {new Date(entry.timestamp).toLocaleString()}
                </Typography>
              }
            />

            <Chip
              label={`${isPositive ? '+' : ''}${entry.delta}`}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 22,
                bgcolor: isPositive ? 'success.light' : 'error.light',
                color: isPositive ? 'success.dark' : 'error.dark',
                flexShrink: 0,
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default RecentActivity;

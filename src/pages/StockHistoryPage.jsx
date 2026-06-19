import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField,
  InputAdornment,
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useState, useMemo } from 'react';
import useInventoryStore from '../store/inventoryStore';

const StockHistoryPage = () => {
  const stockHistory = useInventoryStore((s) => s.stockHistory);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return stockHistory;
    return stockHistory.filter(
      (e) =>
        e.productName.toLowerCase().includes(q) ||
        e.productId.toLowerCase().includes(q)
    );
  }, [stockHistory, search]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Stock History</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Every stock adjustment — most recent first
          </Typography>
        </Box>
        <Chip
          label={`${stockHistory.length} entries`}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Search */}
      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <TextField
          fullWidth
          id="history-search"
          placeholder="Search by product name or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            {stockHistory.length === 0 ? 'No stock history yet' : 'No results found'}
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
            {stockHistory.length === 0
              ? 'Use the +/− controls on the Products page to adjust stock.'
              : 'Try a different search term.'}
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell align="center">Change</TableCell>
                <TableCell align="right">Date & Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((entry, idx) => {
                const isPositive = entry.delta > 0;
                return (
                  <TableRow key={entry.id || idx}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {entry.productName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        fontFamily="monospace"
                        color="text.secondary"
                      >
                        {entry.productId}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.25,
                            py: 0.35,
                            borderRadius: 10,
                            bgcolor: isPositive ? 'success.light' : 'error.light',
                            color: isPositive ? 'success.dark' : 'error.dark',
                          }}
                        >
                          {isPositive ? (
                            <TrendingUpRoundedIcon sx={{ fontSize: 14 }} />
                          ) : (
                            <TrendingDownRoundedIcon sx={{ fontSize: 14 }} />
                          )}
                          <Typography variant="caption" fontWeight={700}>
                            {isPositive ? '+' : ''}
                            {entry.delta}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StockHistoryPage;

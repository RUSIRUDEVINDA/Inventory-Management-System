import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import StockBadge from '../products/StockBadge';
import { getStockStatus } from '../../lib/stockStatus';

/**
 * Table showing each category with total products, total units, and aggregate status chip.
 *
 * @param {Object}   props
 * @param {import('../../store/inventoryStore').Product[]} props.products
 * @param {string[]} props.categories
 */
const CategoryBreakdownTable = ({ products, categories }) => {
  const rows = useMemo(() => {
    return categories.map((cat) => {
      const catProducts = products.filter((p) => p.category === cat);
      const totalUnits = catProducts.reduce((sum, p) => sum + p.stockQty, 0);
      // Aggregate status: worst status wins (out > low > in)
      const hasOut = catProducts.some((p) => getStockStatus(p.stockQty) === 'out');
      const hasLow = catProducts.some((p) => getStockStatus(p.stockQty) === 'low');
      const aggStatus = hasOut ? 0 : hasLow ? totalUnits : totalUnits;
      return {
        category: cat,
        productCount: catProducts.length,
        totalUnits,
        aggQty: hasOut ? 0 : hasLow ? 1 : 999, // synthetic qty to drive StockBadge
      };
    }).filter((r) => r.productCount > 0);
  }, [products, categories]);

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No categories with products yet.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Products</TableCell>
            <TableCell align="right">Total Units</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.category}>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>{row.category}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">{row.productCount}</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight={600}>{row.totalUnits.toLocaleString()}</Typography>
              </TableCell>
              <TableCell align="right">
                <StockBadge qty={row.aggQty} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryBreakdownTable;

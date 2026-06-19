import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, IconButton, Tooltip, Typography, Box, Chip, Paper,
  useMediaQuery, useTheme, Card, CardContent, Divider, Button,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import useInventoryStore from '../../store/inventoryStore';
import StockBadge from './StockBadge';
import StockAdjustControls from './StockAdjustControls';
import ConfirmDialog from '../shared/ConfirmDialog';

/**
 * Main product data table with checkboxes, inline stock controls, edit/delete actions.
 * On mobile (< sm) renders stacked Cards instead of a Table.
 *
 * @param {Object}   props
 * @param {import('../../store/inventoryStore').Product[]} props.products - Filtered product list
 * @param {string[]} props.selectedIds   - Currently selected IDs (lifted to parent)
 * @param {(ids:string[])=>void} props.onSelectionChange
 * @param {(product: import('../../store/inventoryStore').Product)=>void} props.onEdit
 */
const ProductTable = ({ products, selectedIds, onSelectionChange, onEdit }) => {
  const deleteProduct = useInventoryStore((s) => s.deleteProduct);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [deleteTarget, setDeleteTarget] = useState(null);

  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  const toggleAll = () => {
    onSelectionChange(allSelected ? [] : products.map((p) => p.id));
  };

  const toggleOne = (id) => {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id]
    );
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      onSelectionChange(selectedIds.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (products.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" fontWeight={500}>No products found</Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
          Try adjusting your search or filters, or add a new product.
        </Typography>
      </Box>
    );
  }

  // ── Mobile: stacked cards ───────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            return (
              <Card
                key={product.id}
                sx={{
                  outline: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                  transition: 'outline 0.15s',
                }}
              >
                <CardContent sx={{ pb: '12px !important' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleOne(product.id)}
                      size="small"
                      sx={{ mt: -0.5, ml: -0.5 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>{product.name}</Typography>
                        <StockBadge qty={product.stockQty} />
                      </Box>
                      <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                        {product.id}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1.5, alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Category</Typography>
                          <Typography variant="body2" fontWeight={500}>{product.category}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Price</Typography>
                          <Typography variant="body2" fontWeight={600}>${product.price.toFixed(2)}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Stock</Typography>
                          <StockAdjustControls productId={product.id} stockQty={product.stockQty} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 1.5, mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => onEdit(product)}
                      variant="outlined"
                      sx={{ fontSize: '0.72rem' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteOutlineRoundedIcon />}
                      onClick={() => setDeleteTarget(product)}
                      variant="outlined"
                      color="error"
                      sx={{ fontSize: '0.72rem' }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="Delete Product"
          message={`Delete "${deleteTarget?.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </>
    );
  }

  // ── Desktop: table ──────────────────────────────────────────────────────────
  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={toggleAll}
                  size="small"
                />
              </TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              return (
                <TableRow
                  key={product.id}
                  selected={isSelected}
                  sx={{
                    bgcolor: isSelected
                      ? (t) =>
                          t.palette.mode === 'dark'
                            ? 'rgba(99,102,241,0.08)'
                            : 'rgba(99,102,241,0.04)'
                      : 'transparent',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleOne(product.id)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                      {product.id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={product.category}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      ${product.price.toFixed(2)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <StockAdjustControls productId={product.id} stockQty={product.stockQty} />
                  </TableCell>

                  <TableCell align="center">
                    <StockBadge qty={product.stockQty} />
                  </TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="Edit product">
                        <IconButton size="small" onClick={() => onEdit(product)}>
                          <EditOutlinedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete product">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default ProductTable;

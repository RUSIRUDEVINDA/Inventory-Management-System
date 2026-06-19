import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Button, Snackbar, Alert,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';

import useInventoryStore from '../store/inventoryStore';
import { getStockStatus } from '../lib/stockStatus';
import { exportToCsv } from '../lib/exportToCsv';
import SearchAndFilters from '../components/products/SearchAndFilters';
import BulkActionBar from '../components/products/BulkActionBar';
import ProductTable from '../components/products/ProductTable';
import ProductFormDialog from '../components/products/ProductFormDialog';

const ProductsPage = () => {
  const products = useInventoryStore((s) => s.products);

  // ── URL search param → initial search value ─────────────────────────────────
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  // ── Local filter state ──────────────────────────────────────────────────────
  const [rawSearch, setRawSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  // ── Dialog state ────────────────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ── Debounce search ─────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(rawSearch), 280);
    return () => clearTimeout(timer);
  }, [rawSearch]);

  // ── Filtered products (memoized) ────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === 'all' || p.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'all' || getStockStatus(p.stockQty) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, debouncedSearch, categoryFilter, statusFilter]);

  // Keep selection in sync — remove IDs that no longer exist in filteredProducts
  useEffect(() => {
    const filteredIds = new Set(filteredProducts.map((p) => p.id));
    setSelectedIds((prev) => prev.filter((id) => filteredIds.has(id)));
  }, [filteredProducts]);

  const handleOpenAdd = () => { setEditProduct(null); setFormOpen(true); };
  const handleOpenEdit = (product) => { setEditProduct(product); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEditProduct(null); };

  const handleExport = () => {
    exportToCsv(filteredProducts, 'inventory');
    setSnackbar({ open: true, message: `Exported ${filteredProducts.length} products to CSV.`, severity: 'success' });
  };

  const handleReset = () => {
    setRawSearch('');
    setDebouncedSearch('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Products</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {products.length} total · {filteredProducts.length} shown
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={handleExport}
            disabled={filteredProducts.length === 0}
            size="small"
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={handleOpenAdd}
            size="small"
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Search + Filters */}
      <Box sx={{ mb: 2 }}>
        <SearchAndFilters
          search={rawSearch}
          onSearchChange={setRawSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={handleReset}
        />
      </Box>

      {/* Bulk action bar (visible when rows selected) */}
      <BulkActionBar
        selectedIds={selectedIds}
        onClear={() => setSelectedIds([])}
      />

      {/* Product table */}
      <ProductTable
        products={filteredProducts}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onEdit={handleOpenEdit}
      />

      {/* Add / Edit dialog */}
      <ProductFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        product={editProduct}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsPage;

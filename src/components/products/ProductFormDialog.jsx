import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Typography,
  Divider, CircularProgress, IconButton, InputAdornment,
  Snackbar, Alert,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useFormik } from 'formik';
import { productSchema } from '../../lib/validationSchemas';
import useInventoryStore from '../../store/inventoryStore';

const NEW_CATEGORY_VALUE = '__new__';

/**
 * Add / Edit product dialog — Formik + Yup with inline MUI error messages.
 *
 * @param {Object}   props
 * @param {boolean}  props.open         - Dialog visibility
 * @param {()=>void} props.onClose      - Close handler
 * @param {import('../../store/inventoryStore').Product|null} props.product - null = Add mode
 */
const ProductFormDialog = ({ open, onClose, product }) => {
  const { categories, addProduct, updateProduct, addCategory } = useInventoryStore();
  const isEdit = !!product;

  const [newCatInput, setNewCatInput] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name ?? '',
      category: product?.category ?? '',
      price: product?.price ?? '',
      stockQty: product?.stockQty ?? '',
    },
    validationSchema: productSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isEdit) {
        updateProduct(product.id, values);
      } else {
        addProduct(values);
      }
      resetForm();
      onClose();
    },
  });

  // Reset inline new-category fields when dialog closes
  useEffect(() => {
    if (!open) {
      setNewCatInput('');
      setAddingCat(false);
      formik.resetForm();
    }
  }, [open]);

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    const result = addCategory(newCatInput.trim());
    if (result.success) {
      formik.setFieldValue('category', newCatInput.trim());
      setNewCatInput('');
      setAddingCat(false);
    } else {
      setSnackbar({ open: true, message: result.message, severity: 'warning' });
      // If cat already exists, just select it
      formik.setFieldValue('category', newCatInput.trim());
      setNewCatInput('');
      setAddingCat(false);
    }
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    if (val === NEW_CATEGORY_VALUE) {
      setAddingCat(true);
      formik.setFieldValue('category', '');
    } else {
      formik.setFieldValue('category', val);
      setAddingCat(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box>
            <Typography variant="h6">{isEdit ? 'Edit Product' : 'Add New Product'}</Typography>
            {isEdit && (
              <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                {product.id}
              </Typography>
            )}
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Product Name */}
          <TextField
            fullWidth
            id="product-name"
            label="Product Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            placeholder="e.g. Wireless Headphones"
          />

          {/* Category */}
          {!addingCat ? (
            <TextField
              select
              fullWidth
              id="product-category"
              label="Category"
              name="category"
              value={formik.values.category || ''}
              onChange={handleCategoryChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
              <Divider />
              <MenuItem value={NEW_CATEGORY_VALUE} sx={{ color: 'primary.main', fontWeight: 600 }}>
                <AddRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
                Add new category…
              </MenuItem>
            </TextField>
          ) : (
            <TextField
              fullWidth
              autoFocus
              id="new-category-input"
              label="New Category Name"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button size="small" onClick={handleAddCategory} variant="contained" sx={{ mr: -0.5 }}>
                      Add
                    </Button>
                  </InputAdornment>
                ),
              }}
              helperText="Press Enter or click Add, then the category will be selected."
            />
          )}

          {/* Price & Stock row */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              fullWidth
              id="product-price"
              label="Price (USD)"
              name="price"
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              placeholder="0.00"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />

            <TextField
              fullWidth
              id="product-stock-qty"
              label="Stock Quantity"
              name="stockQty"
              type="number"
              inputProps={{ min: 0, step: 1 }}
              value={formik.values.stockQty}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.stockQty && Boolean(formik.errors.stockQty)}
              helperText={formik.touched.stockQty && formik.errors.stockQty}
              placeholder="0"
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
            startIcon={formik.isSubmitting ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {isEdit ? 'Save Changes' : 'Add Product'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductFormDialog;

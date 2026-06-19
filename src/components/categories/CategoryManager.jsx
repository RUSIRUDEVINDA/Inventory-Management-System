import { useState } from 'react';
import {
  Box, Typography, TextField, Button, List, ListItem,
  ListItemText, ListItemSecondaryAction, IconButton,
  Chip, Snackbar, Alert, Divider, Paper,
  InputAdornment, CircularProgress,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { useFormik } from 'formik';
import { categorySchema } from '../../lib/validationSchemas';
import useInventoryStore from '../../store/inventoryStore';
import ConfirmDialog from '../shared/ConfirmDialog';

/**
 * Full category management panel — add new categories and delete existing ones.
 * Deletion is blocked (with a clear message) if any products still reference the category.
 */
const CategoryManager = () => {
  const { categories, products, addCategory, deleteCategory } = useInventoryStore();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: categorySchema,
    onSubmit: (values, { resetForm }) => {
      const result = addCategory(values.name.trim());
      if (result.success) {
        setSnackbar({ open: true, message: `Category "${values.name.trim()}" added!`, severity: 'success' });
        resetForm();
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'warning' });
      }
    },
  });

  const handleDelete = () => {
    if (!deleteTarget) return;
    const result = deleteCategory(deleteTarget);
    if (result.success) {
      setSnackbar({ open: true, message: `Category "${deleteTarget}" deleted.`, severity: 'success' });
    } else {
      setSnackbar({ open: true, message: result.message, severity: 'error' });
    }
    setDeleteTarget(null);
  };

  const getProductCount = (cat) => products.filter((p) => p.category === cat).length;

  return (
    <Box sx={{ maxWidth: 600 }}>
      {/* Add category form */}
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Add New Category
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
        >
          <TextField
            fullWidth
            id="category-name-input"
            label="Category Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            placeholder="e.g. Office Supplies"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={
              formik.isSubmitting
                ? <CircularProgress size={14} color="inherit" />
                : <AddRoundedIcon />
            }
            disabled={formik.isSubmitting}
            sx={{ flexShrink: 0, height: 40, mt: 0 }}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {/* Categories list */}
      <Paper
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
      >
        <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            All Categories
          </Typography>
          <Chip label={`${categories.length} total`} size="small" variant="outlined" />
        </Box>
        <Divider />

        {categories.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No categories yet.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {categories.map((cat, idx) => {
              const count = getProductCount(cat);
              return (
                <Box key={cat}>
                  <ListItem sx={{ px: 3, py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600}>{cat}</Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {count} product{count !== 1 ? 's' : ''}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {count > 0 && (
                          <Chip
                            label={count}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: 'primary.light',
                              color: 'primary.dark',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteTarget(cat)}
                          disabled={count > 0}
                          title={count > 0 ? `Cannot delete — ${count} product(s) use this category` : 'Delete category'}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {idx < categories.length - 1 && <Divider />}
                </Box>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Delete the category "${deleteTarget}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryManager;

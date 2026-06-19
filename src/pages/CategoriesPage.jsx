import { Box, Typography } from '@mui/material';
import CategoryManager from '../components/categories/CategoryManager';

const CategoriesPage = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Categories</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Manage the categories available for your products
        </Typography>
      </Box>
      <CategoryManager />
    </Box>
  );
};

export default CategoriesPage;

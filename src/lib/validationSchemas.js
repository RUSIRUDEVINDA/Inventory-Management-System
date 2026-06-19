import * as Yup from 'yup';

/**
 * Validation schema for the Add / Edit Product form (Formik + Yup).
 */
export const productSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be at most 100 characters')
    .required('Product name is required'),

  category: Yup.string()
    .required('Category is required'),

  price: Yup.number()
    .typeError('Price must be a valid number')
    .positive('Price must be greater than 0')
    .test(
      'max-decimals',
      'Price can have at most 2 decimal places',
      (value) => {
        if (value === undefined || value === null) return true;
        return /^\d+(\.\d{1,2})?$/.test(String(value));
      }
    )
    .required('Price is required'),

  stockQty: Yup.number()
    .typeError('Stock quantity must be a whole number')
    .integer('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .required('Stock quantity is required'),
});

/**
 * Validation schema for the Add Category form.
 */
export const categorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be at most 50 characters')
    .required('Category name is required'),
});

/**
 * Validation schema for the Restock dialog (bulk restock amount).
 */
export const restockSchema = Yup.object({
  amount: Yup.number()
    .typeError('Amount must be a whole number')
    .integer('Amount must be a whole number')
    .min(1, 'Amount must be at least 1')
    .max(99999, 'Amount must be at most 99,999')
    .required('Amount is required'),
});

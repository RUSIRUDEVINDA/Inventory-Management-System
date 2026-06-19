import { Box, TextField, MenuItem, InputAdornment, Button } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import useInventoryStore from '../../store/inventoryStore';

const STOCK_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'in', label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out', label: 'Out of Stock' },
];

/**
 * Search + filter bar for the Products page.
 * All state is local (useState in parent ProductsPage) — passed via props.
 * Combines AND logic: search × category × stock status.
 *
 * @param {Object}   props
 * @param {string}   props.search         - Current search string
 * @param {(v:string)=>void} props.onSearchChange
 * @param {string}   props.categoryFilter - Selected category ('all' or category name)
 * @param {(v:string)=>void} props.onCategoryChange
 * @param {string}   props.statusFilter   - 'all'|'in'|'low'|'out'
 * @param {(v:string)=>void} props.onStatusChange
 * @param {()=>void} props.onReset        - Reset all filters
 */
const SearchAndFilters = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  onReset,
}) => {
  const categories = useInventoryStore((s) => s.categories);
  const hasActiveFilter = search || categoryFilter !== 'all' || statusFilter !== 'all';

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
      }}
    >
      {/* Search */}
      <TextField
        id="product-search"
        placeholder="Search by name or ID…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flexGrow: 1, minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Category filter */}
      <TextField
        select
        id="product-category-filter"
        label="Category"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="all">All Categories</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>{cat}</MenuItem>
        ))}
      </TextField>

      {/* Status filter */}
      <TextField
        select
        id="product-status-filter"
        label="Stock Status"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        sx={{ minWidth: 148 }}
      >
        {STOCK_STATUS_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>

      {/* Reset */}
      {hasActiveFilter && (
        <Button
          variant="text"
          color="inherit"
          size="small"
          onClick={onReset}
          sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
          startIcon={<FilterListRoundedIcon fontSize="small" />}
        >
          Clear filters
        </Button>
      )}
    </Box>
  );
};

export default SearchAndFilters;

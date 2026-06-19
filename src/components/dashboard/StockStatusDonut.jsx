import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { getStockStatus, STOCK_STATUS_LABELS, CHART_COLORS } from '../../lib/stockStatus';

/**
 * Donut chart showing distribution of In Stock / Low Stock / Out of Stock products.
 * Colors pulled from CHART_COLORS (mirrors theme tokens) so they stay readable in dark mode.
 *
 * @param {Object}    props
 * @param {import('../../store/inventoryStore').Product[]} props.products
 */
const StockStatusDonut = ({ products }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const colors = CHART_COLORS[mode];

  const data = useMemo(() => {
    const counts = { in: 0, low: 0, out: 0 };
    products.forEach((p) => {
      counts[getStockStatus(p.stockQty)]++;
    });
    return [
      { name: STOCK_STATUS_LABELS.in, value: counts.in, key: 'in' },
      { name: STOCK_STATUS_LABELS.low, value: counts.low, key: 'low' },
      { name: STOCK_STATUS_LABELS.out, value: counts.out, key: 'out' },
    ].filter((d) => d.value > 0);
  }, [products]);

  if (products.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220 }}>
        <Typography variant="body2" color="text.secondary">No products yet</Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          px: 1.5,
          py: 1,
          boxShadow: 3,
        }}
      >
        <Typography variant="caption" fontWeight={600}>
          {payload[0].name}: {payload[0].value}
        </Typography>
      </Box>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={colors[entry.key]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <Typography component="span" variant="caption" color="text.secondary" fontWeight={500}>
              {value}
            </Typography>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StockStatusDonut;

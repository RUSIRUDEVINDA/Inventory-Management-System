import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

/**
 * Horizontal bar chart showing total units per category.
 *
 * @param {Object}    props
 * @param {import('../../store/inventoryStore').Product[]} props.products
 */
const CategoryBarChart = ({ products }) => {
  const theme = useTheme();

  const data = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + p.stockQty;
    });
    return Object.entries(map)
      .map(([category, units]) => ({ category, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 8); // max 8 bars for readability
  }, [products]);

  const BAR_COLORS = [
    '#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4',
    '#22c55e', '#f59e0b', '#ef4444', '#ec4899',
  ];

  if (data.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 220 }}>
        <Typography variant="body2" color="text.secondary">No data yet</Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
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
        <Typography variant="caption" fontWeight={600} display="block">{label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {payload[0].value} units
        </Typography>
      </Box>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke={theme.palette.divider}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="category"
          width={110}
          tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action?.hover || 'rgba(0,0,0,0.04)' }} />
        <Bar dataKey="units" radius={[0, 6, 6, 0]} maxBarSize={22}>
          {data.map((entry, idx) => (
            <Cell key={entry.category} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CategoryBarChart;

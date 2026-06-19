import { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import useInventoryStore from '../store/inventoryStore';
import { getStockStatus } from '../lib/stockStatus';
import KpiCard from '../components/dashboard/KpiCard';
import StockStatusDonut from '../components/dashboard/StockStatusDonut';
import CategoryBarChart from '../components/dashboard/CategoryBarChart';
import CategoryBreakdownTable from '../components/dashboard/CategoryBreakdownTable';
import RecentActivity from '../components/dashboard/RecentActivity';

const DashboardPage = () => {
  const products = useInventoryStore((s) => s.products);
  const categories = useInventoryStore((s) => s.categories);
  const stockHistory = useInventoryStore((s) => s.stockHistory);

  const kpis = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stockQty, 0);
    const inStock = products.filter((p) => getStockStatus(p.stockQty) === 'in').length;
    const lowStock = products.filter((p) => getStockStatus(p.stockQty) === 'low').length;
    const outOfStock = products.filter((p) => getStockStatus(p.stockQty) === 'out').length;
    return { totalValue, inStock, lowStock, outOfStock };
  }, [products]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Dashboard</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Your inventory at a glance
        </Typography>
      </Box>

      {/* KPI cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <KpiCard
          label="Total Products"
          value={products.length}
          icon={<Inventory2OutlinedIcon sx={{ fontSize: 22 }} />}
          color="primary.main"
        />
        <KpiCard
          label="Inventory Value"
          value={`$${kpis.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<AttachMoneyRoundedIcon sx={{ fontSize: 22 }} />}
          color="#8b5cf6"
        />
        <KpiCard
          label="In Stock"
          value={kpis.inStock}
          icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 22 }} />}
          color="#22c55e"
        />
        <KpiCard
          label="Out of Stock"
          value={kpis.outOfStock}
          icon={<ErrorOutlineRoundedIcon sx={{ fontSize: 22 }} />}
          color="#ef4444"
        />
      </Box>

      {/* Charts row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
          mb: 2,
        }}
      >
        {/* Stock Status Donut */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>Stock Status</Typography>
              {kpis.lowStock > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WarningAmberRoundedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                  <Typography variant="caption" color="warning.dark" fontWeight={600}>
                    {kpis.lowStock} low stock
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">Product distribution by availability</Typography>
            <StockStatusDonut products={products} />
          </CardContent>
        </Card>

        {/* Category Bar Chart */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>Units by Category</Typography>
            <Typography variant="caption" color="text.secondary">Total stock units per category</Typography>
            <Box sx={{ mt: 1 }}>
              <CategoryBarChart products={products} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom row: category table + recent activity */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
        }}
      >
        {/* Category breakdown */}
        <Card>
          <CardContent sx={{ pb: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
              Category Breakdown
            </Typography>
          </CardContent>
          <Divider />
          <CategoryBreakdownTable products={products} categories={categories} />
        </Card>

        {/* Recent activity */}
        <Card>
          <CardContent sx={{ pb: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
              Recent Activity
            </Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <RecentActivity entries={stockHistory} limit={8} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;

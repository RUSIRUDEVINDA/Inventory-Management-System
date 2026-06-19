import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import getTheme from './theme/theme';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import StockHistoryPage from './pages/StockHistoryPage';

// ── Dark mode persistence ──────────────────────────────────────────────────────
const getInitialMode = () => {
  try {
    return localStorage.getItem('theme-mode') || 'light';
  } catch {
    return 'light';
  }
};

const App = () => {
  const [mode, setMode] = useState(getInitialMode);

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('theme-mode', next); } catch {}
      return next;
    });
  };

  // Memoize theme so it only rebuilds when mode changes
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout mode={mode} onToggleMode={toggleMode} />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="stock-history" element={<StockHistoryPage />} />
            {/* Catch-all → Dashboard */}
            <Route path="*" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

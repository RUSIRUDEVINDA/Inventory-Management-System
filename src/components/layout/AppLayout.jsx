import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar';
import Topbar from './Topbar';

const TOPBAR_HEIGHT = 64;

/**
 * Root application shell — composes Sidebar + Topbar + scrollable content area.
 *
 * @param {Object}           props
 * @param {'light'|'dark'}   props.mode          - Current theme mode
 * @param {()=>void}         props.onToggleMode  - Toggle dark/light mode
 */
const AppLayout = ({ mode, onToggleMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />

      <Topbar
        isMobile={isMobile}
        onMenuClick={() => setMobileOpen(true)}
        mode={mode}
        onToggleMode={onToggleMode}
      />

      {/* Main scrollable content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${TOPBAR_HEIGHT}px`,
          ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          bgcolor: 'background.default',
          // subtle transition when sidebar collapses on mobile
          transition: 'margin 0.2s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;

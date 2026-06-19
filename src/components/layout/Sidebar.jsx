import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';

export const SIDEBAR_WIDTH = 64;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/' },
  { label: 'Products', icon: <Inventory2OutlinedIcon />, path: '/products' },
  { label: 'Categories', icon: <CategoryOutlinedIcon />, path: '/categories' },
  { label: 'Stock History', icon: <HistoryOutlinedIcon />, path: '/stock-history' },
];

const BOTTOM_NAV = [
  { label: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' },
];

/**
 * @param {Object} props
 * @param {boolean} props.mobileOpen   - Whether mobile drawer is open
 * @param {()=>void} props.onClose     - Close mobile drawer handler
 * @param {boolean} props.isMobile     - Is mobile viewport
 */
const Sidebar = ({ mobileOpen, onClose, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: SIDEBAR_WIDTH,
        py: 1,
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <StorefrontRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>

      <Divider sx={{ mx: 1, mb: 1 }} />

      {/* Main nav */}
      <List sx={{ px: 0.75, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <Tooltip title={item.label} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNav(item.path)}
                  sx={{
                    minHeight: 42,
                    justifyContent: 'center',
                    px: 1,
                    borderRadius: 2,
                    bgcolor: active
                      ? 'primary.main'
                      : 'transparent',
                    color: active ? '#fff' : 'text.secondary',
                    '&:hover': {
                      bgcolor: active
                        ? 'primary.dark'
                        : theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(99,102,241,0.08)',
                      color: active ? '#fff' : 'primary.main',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      color: 'inherit',
                      fontSize: 22,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom nav */}
      <Divider sx={{ mx: 1, mb: 1 }} />
      <List sx={{ px: 0.75, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <Tooltip title={item.label} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNav(item.path)}
                  sx={{
                    minHeight: 42,
                    justifyContent: 'center',
                    px: 1,
                    borderRadius: 2,
                    color: active ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      bgcolor: 'rgba(99,102,241,0.08)',
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Desktop: permanent */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              overflowX: 'hidden',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile: temporary */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              overflowX: 'hidden',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;

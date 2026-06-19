import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  InputAdornment,
  TextField,
  Tooltip,
  Badge,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { SIDEBAR_WIDTH } from './Sidebar';

/**
 * Top application bar.
 *
 * @param {Object}   props
 * @param {boolean}  props.isMobile       - Is mobile viewport
 * @param {()=>void} props.onMenuClick    - Open mobile drawer
 * @param {'light'|'dark'} props.mode    - Current theme mode
 * @param {()=>void} props.onToggleMode  - Toggle dark/light mode
 */
const Topbar = ({ isMobile, onMenuClick, mode, onToggleMode }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile ? '100%' : `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: 64, px: { xs: 2, sm: 3 } }}>
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            size="small"
            sx={{ mr: 0.5 }}
          >
            <MenuRoundedIcon />
          </IconButton>
        )}

        {/* Search */}
        <TextField
          placeholder="Search products… (Enter)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearchSubmit}
          size="small"
          sx={{
            flexGrow: 1,
            maxWidth: 380,
            '& .MuiOutlinedInput-root': {
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.03)',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: 'divider' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small">
            <Badge badgeContent={2} color="error" variant="dot">
              <NotificationsNoneRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Dark mode toggle */}
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton size="small" onClick={onToggleMode}>
            {mode === 'dark' ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {/* Avatar */}
        <Tooltip title="Account">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 13,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              cursor: 'pointer',
              ml: 0.5,
            }}
          >
            AD
          </Avatar>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;

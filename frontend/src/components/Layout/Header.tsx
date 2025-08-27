import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop Logo */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            🍽️ Restaurant Dashboard
          </Typography>
        </Box>

        {/* Status Indicators */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 'auto' }}>
          <Chip
            label="🟢 Live"
            size="small"
            sx={{ 
              backgroundColor: '#e8f5e8',
              color: '#2e7d2e',
              fontWeight: 600,
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
            3 platforms connected • Last sync: 2 min ago
          </Typography>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <Button
            onClick={handleProfileClick}
            sx={{ 
              ml: 1,
              borderRadius: 8,
              textTransform: 'none',
              color: 'text.primary',
            }}
            startIcon={
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                P
              </Avatar>
            }
          >
            <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Priya Singh
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Owner
              </Typography>
            </Box>
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
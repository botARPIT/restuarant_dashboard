import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Avatar,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Sync as SyncIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { mockPlatformConnections } from '@/utils/mockData';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const [platforms, setPlatforms] = useState(mockPlatformConnections);
  const [notifications, setNotifications] = useState({
    newOrders: true,
    statusUpdates: true,
    lowStock: true,
    dailyReports: false,
  });

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Delhi Delights',
    address: 'Sector 18, Noida, UP 201301',
    phone: '+91 98765 43210',
    email: 'info@delhidelights.com',
  });

  const handleNotificationChange = (setting: string) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    toast.success('Notification settings updated');
  };

  const handlePlatformSync = (platform: string) => {
    setPlatforms(prev =>
      prev.map(p =>
        p.platform === platform
          ? { ...p, lastSync: new Date().toISOString(), status: 'active' as const }
          : p
      )
    );
    toast.success(`${platform} synced successfully`);
  };

  const handleSaveRestaurantInfo = () => {
    toast.success('Restaurant information updated');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      default:
        return <WarningIcon sx={{ color: 'warning.main' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your restaurant and platform settings
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Restaurant Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Restaurant Information
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Restaurant Name"
                  value={restaurantInfo.name}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={restaurantInfo.address}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={restaurantInfo.phone}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={restaurantInfo.email}
                  onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                />
              </Box>
              
              <Button
                variant="contained"
                onClick={handleSaveRestaurantInfo}
                sx={{ borderRadius: 2 }}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Notification Settings
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="New Orders"
                    secondary="Get notified when new orders arrive"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.newOrders}
                      onChange={() => handleNotificationChange('newOrders')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Status Updates"
                    secondary="Notifications for order status changes"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.statusUpdates}
                      onChange={() => handleNotificationChange('statusUpdates')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Low Stock Alerts"
                    secondary="Alert when menu items are running low"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.lowStock}
                      onChange={() => handleNotificationChange('lowStock')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText
                    primary="Daily Reports"
                    secondary="Receive daily performance summary"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notifications.dailyReports}
                      onChange={() => handleNotificationChange('dailyReports')}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Platform Connections */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SyncIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Platform Connections
                </Typography>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                This is a demo environment. Platform connections are simulated for demonstration purposes.
              </Alert>
              
              <Grid container spacing={2}>
                {platforms.map((platform) => (
                  <Grid item xs={12} sm={6} md={3} key={platform.platform}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            mx: 'auto',
                            mb: 1,
                            bgcolor: platform.connected ? 'primary.main' : 'grey.300',
                          }}
                        >
                          {platform.platform.slice(0, 2).toUpperCase()}
                        </Avatar>
                        
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {platform.platform}
                        </Typography>
                        
                        <Chip
                          icon={getStatusIcon(platform.status)}
                          label={platform.status.charAt(0).toUpperCase() + platform.status.slice(1)}
                          size="small"
                          color={getStatusColor(platform.status) as any}
                          sx={{ mb: 2 }}
                        />
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Today: {platform.ordersToday} orders
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Revenue: ₹{platform.revenueToday.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Button
                          size="small"
                          variant={platform.connected ? "outlined" : "contained"}
                          onClick={() => handlePlatformSync(platform.platform)}
                          disabled={!platform.connected}
                          sx={{ borderRadius: 2 }}
                        >
                          {platform.connected ? 'Sync Now' : 'Connect'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Security Settings
                </Typography>
              </Box>
              
              <Alert severity="success" sx={{ mb: 2 }}>
                Your account is secure. All data is encrypted and follows industry best practices.
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" sx={{ borderRadius: 2 }}>
                  Change Password
                </Button>
                <Button variant="outlined" sx={{ borderRadius: 2 }}>
                  Enable 2FA
                </Button>
                <Button variant="outlined" sx={{ borderRadius: 2 }}>
                  Download Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
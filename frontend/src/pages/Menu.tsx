import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { mockMenuItems } from '@/utils/mockData';
import { MenuItem } from '@/types';
import toast from 'react-hot-toast';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleAvailabilityToggle = (itemId: string) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
    toast.success('Item availability updated');
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      setMenuItems(prev =>
        prev.map(item => 
          item.id === editingItem.id ? editingItem : item
        )
      );
      toast.success('Menu item updated');
    }
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const platformColors = {
    swiggy: '#ff6600',
    zomato: '#e23744', 
    ubereats: '#000000',
    doordash: '#ff3008',
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Menu Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your menu items across all delivery platforms
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2 }}
        >
          Add New Item
        </Button>
      </Box>

      {/* Menu Items Grid */}
      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                {/* Item Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Chip 
                      label={item.category} 
                      size="small" 
                      sx={{ bgcolor: 'primary.main', color: 'white' }}
                    />
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEditItem(item)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>

                {/* Price & Timing */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    ₹{item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.preparationTime} min prep
                  </Typography>
                </Box>

                {/* Platform Availability */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Available on:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(item.platforms).map(([platform, available]) => (
                      <Avatar
                        key={platform}
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor: available ? platformColors[platform as keyof typeof platformColors] : '#ccc',
                          opacity: available ? 1 : 0.5,
                        }}
                      >
                        {platform.slice(0, 2).toUpperCase()}
                      </Avatar>
                    ))}
                  </Box>
                </Box>

                {/* Availability Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.isAvailable}
                      onChange={() => handleAvailabilityToggle(item.id)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.isAvailable ? 'Available' : 'Out of Stock'}
                    </Typography>
                  }
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Menu Item</DialogTitle>
        <DialogContent>
          {editingItem && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Item Name"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={editingItem.price}
                onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Preparation Time (minutes)"
                type="number"
                value={editingItem.preparationTime}
                onChange={(e) => setEditingItem({ ...editingItem, preparationTime: parseInt(e.target.value) })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Menu;
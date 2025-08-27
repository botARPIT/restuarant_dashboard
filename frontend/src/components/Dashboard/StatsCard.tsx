import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary.main' 
}) => {
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isPositiveChange && (
                  <TrendingUp sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
                )}
                {isNegativeChange && (
                  <TrendingDown sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
                )}
                <Typography
                  variant="body2"
                  sx={{
                    color: isPositiveChange ? 'success.main' : isNegativeChange ? 'error.main' : 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {change > 0 ? '+' : ''}{change}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  vs yesterday
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
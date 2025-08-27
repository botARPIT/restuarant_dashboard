import express from 'express';
import { getDashboardStats, getDailyTrends } from '../controllers/dashboardController';

const router = express.Router();

// Get dashboard overview statistics
router.get('/stats', getDashboardStats);

// Get daily trends for analytics
router.get('/trends', getDailyTrends);

export default router;
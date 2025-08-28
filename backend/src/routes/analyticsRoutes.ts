import express from 'express';
import { getAnalyticsSummary, getAnalyticsTrends } from '../controllers/analyticsController';

const router = express.Router();

router.get('/summary', getAnalyticsSummary);
router.get('/trends', getAnalyticsTrends);

export default router;
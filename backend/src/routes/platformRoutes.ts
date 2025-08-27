import express from 'express';
import { 
  getAllPlatforms, 
  getPlatformById, 
  updatePlatformStatus,
  getPlatformStats
} from '../controllers/platformController';

const router = express.Router();

// Get all platforms
router.get('/', getAllPlatforms);

// Get platform by ID
router.get('/:id', getPlatformById);

// Update platform status
router.patch('/:id/status', updatePlatformStatus);

// Get platform statistics
router.get('/:id/stats', getPlatformStats);

export default router;
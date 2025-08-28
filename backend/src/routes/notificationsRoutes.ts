import express from 'express';
import { listNotifications, markNotificationRead } from '../controllers/notificationsController';

const router = express.Router();

router.get('/', listNotifications);
router.patch('/:id/read', markNotificationRead);

export default router;
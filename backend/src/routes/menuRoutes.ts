import express from 'express';
import { listMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController';

const router = express.Router();

router.get('/items', listMenuItems);
router.get('/items/:id', getMenuItem);
router.post('/items', createMenuItem);
router.put('/items/:id', updateMenuItem);
router.delete('/items/:id', deleteMenuItem);

export default router;
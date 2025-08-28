import { Request, Response } from 'express';
import { ApiResponse } from '../types';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

let notifications: NotificationItem[] = [
  { id: 'n1', title: 'New Order', message: 'Order ZOM-001 received', read: false, createdAt: new Date().toISOString() },
  { id: 'n2', title: 'Order Delivered', message: 'Order UBE-003 delivered', read: true, createdAt: new Date().toISOString() },
];

export const listNotifications = (req: Request, res: Response<ApiResponse<NotificationItem[]>>) => {
  res.json({ success: true, data: notifications });
};

export const markNotificationRead = (req: Request, res: Response<ApiResponse<NotificationItem>>) => {
  const idx = notifications.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Notification not found' });
  notifications[idx].read = true;
  res.json({ success: true, data: notifications[idx] });
};
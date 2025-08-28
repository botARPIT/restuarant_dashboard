import { Request, Response } from 'express';
import { ApiResponse } from '../types';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  available: boolean;
}

let menu: MenuItem[] = [
  { id: 'm1', name: 'Butter Chicken', price: 450, category: 'Main Course', available: true },
  { id: 'm2', name: 'Margherita Pizza', price: 550, category: 'Pizza', available: true },
];

export const listMenuItems = (req: Request, res: Response<ApiResponse<MenuItem[]>>) => {
  res.json({ success: true, data: menu });
};

export const getMenuItem = (req: Request, res: Response<ApiResponse<MenuItem>>) => {
  const item = menu.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Menu item not found' });
  res.json({ success: true, data: item });
};

export const createMenuItem = (req: Request, res: Response<ApiResponse<MenuItem>>) => {
  const payload = req.body as Partial<MenuItem>;
  const id = `m${Date.now()}`;
  const item: MenuItem = { id, name: payload.name || 'Unnamed', price: payload.price || 0, category: payload.category, available: payload.available ?? true };
  menu.push(item);
  res.status(201).json({ success: true, data: item });
};

export const updateMenuItem = (req: Request, res: Response<ApiResponse<MenuItem>>) => {
  const idx = menu.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Menu item not found' });
  menu[idx] = { ...menu[idx], ...req.body };
  res.json({ success: true, data: menu[idx] });
};

export const deleteMenuItem = (req: Request, res: Response<ApiResponse<{}>>) => {
  const before = menu.length;
  menu = menu.filter(m => m.id !== req.params.id);
  if (menu.length === before) return res.status(404).json({ success: false, error: 'Menu item not found' });
  res.json({ success: true, data: {} });
};
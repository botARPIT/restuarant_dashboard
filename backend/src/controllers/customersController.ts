import { Request, Response } from 'express';
import { ApiResponse } from '../types';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  lastOrderAt?: string;
}

let customers: Customer[] = [
  { id: 'c1', name: 'John Doe', email: 'john@example.com', phone: '+91-9876543210', totalOrders: 12, lastOrderAt: '2024-12-10T12:30:00Z' },
  { id: 'c2', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+91-9876543211', totalOrders: 7, lastOrderAt: '2024-12-11T14:00:00Z' },
];

export const getCustomers = (req: Request, res: Response<ApiResponse<Customer[]>>) => {
  res.json({ success: true, data: customers });
};

export const getCustomerById = (req: Request, res: Response<ApiResponse<Customer>>) => {
  const item = customers.find(c => c.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Customer not found' });
  res.json({ success: true, data: item });
};

export const createCustomer = (req: Request, res: Response<ApiResponse<Customer>>) => {
  const payload = req.body as Partial<Customer>;
  const id = `c${Date.now()}`;
  const item: Customer = { id, name: payload.name || 'Unnamed', email: payload.email || '', phone: payload.phone, totalOrders: 0 };
  customers.push(item);
  res.status(201).json({ success: true, data: item });
};

export const updateCustomer = (req: Request, res: Response<ApiResponse<Customer>>) => {
  const idx = customers.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Customer not found' });
  customers[idx] = { ...customers[idx], ...req.body };
  res.json({ success: true, data: customers[idx] });
};

export const deleteCustomer = (req: Request, res: Response<ApiResponse<{}>>) => {
  const before = customers.length;
  customers = customers.filter(c => c.id !== req.params.id);
  if (customers.length === before) return res.status(404).json({ success: false, error: 'Customer not found' });
  res.json({ success: true, data: {} });
};
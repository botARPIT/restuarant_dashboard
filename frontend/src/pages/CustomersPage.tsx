import React, { useState, useEffect } from 'react';
import { getJSON } from '../utils/api';
import { Search, Filter, Plus, Edit, Trash2, Eye, User, Mail, Phone, ShoppingCart, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await getJSON<{ success: boolean; data: Customer[] }>('/customers');
      setCustomers(response.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await fetch(`/api/customers/${editingCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      await loadCustomers();
      setShowAddModal(false);
      setEditingCustomer(null);
      resetForm();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await fetch(`/api/customers/${id}`, { method: 'DELETE' });
        await loadCustomers();
      } catch (e: any) {
        setError(e.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'active'
    });
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCustomerStats = () => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = customers.reduce((sum, c) => sum + c.totalOrders, 0) > 0 
      ? totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) 
      : 0;

    return { total, active, totalRevenue, avgOrderValue };
  };

  const stats = getCustomerStats();

  return (
    <div className="content-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Customer Management</h1>
            <p className="page-subtitle">Manage your restaurant's customer database and relationships</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-responsive mb-8">
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-700" />
            </div>
            <span className="kpi-change positive flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {stats.active}
            </span>
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-label">Total Customers</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-700" />
            </div>
            <span className="kpi-change positive flex items-center gap-1">
              <User className="w-4 h-4" />
              {stats.total}
            </span>
          </div>
          <div className="kpi-value">{stats.active}</div>
          <div className="kpi-label">Active Customers</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-700" />
            </div>
            <span className="kpi-change positive flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              ₹{stats.avgOrderValue.toFixed(0)}
            </span>
          </div>
          <div className="kpi-value">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="kpi-label">Total Revenue</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-amber-700" />
            </div>
            <span className="kpi-change positive flex items-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </span>
          </div>
          <div className="kpi-value">{stats.avgOrderValue.toFixed(1)}</div>
          <div className="kpi-label">Avg Order Value</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-clean pl-10 w-full"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-clean w-32"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card-minimal card-hover">
        <div className="overflow-hidden">
          <table className="table-clean">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors duration-150">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{customer.name}</div>
                        <div className="text-sm text-slate-500">#{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-700">{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{customer.totalOrders}</span>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-900">₹{customer.totalSpent.toLocaleString()}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      {customer.lastOrder}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${customer.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                      <span className={`badge-minimal ${customer.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                        {customer.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCustomers.length === 0 && !loading && (
            <div className="empty-state">
              <User className="empty-state-icon" />
              <p className="empty-state-text">No customers found</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary mt-4"
              >
                Add Your First Customer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="text-slate-600 mt-2">Loading customers...</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add Customer'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-clean"
                  placeholder="Customer name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-clean"
                  placeholder="customer@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-clean"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="input-clean"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCustomer(null);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

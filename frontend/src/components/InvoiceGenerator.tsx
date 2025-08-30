import React, { useState } from 'react';
import { Download, Printer, Eye, FileText, DollarSign, Calendar, User, MapPin, Phone, Mail } from 'lucide-react';
import { Order } from '../utils/data';

interface InvoiceGeneratorProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  restaurantInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    gstin: string;
  };
  customerInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  orderId: string;
  platform: string;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ order, isOpen, onClose }) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    restaurantInfo: {
      name: 'Your Restaurant Name',
      address: '123 Restaurant Street, City, State 12345',
      phone: '+91 98765 43210',
      email: 'info@yourrestaurant.com',
      gstin: 'GSTIN123456789'
    },
    customerInfo: {
      name: order.customer,
      address: 'Customer Address',
      phone: '+91 98765 43211',
      email: 'customer@example.com'
    },
    items: [
      {
        name: 'Sample Item',
        quantity: 1,
        price: order.totalPrice || order.price || 0,
        total: order.totalPrice || order.price || 0
      }
    ],
    subtotal: order.totalPrice || order.price || 0,
    tax: Math.round((order.totalPrice || order.price || 0) * 0.05), // 5% tax
    deliveryFee: 50,
    total: (order.totalPrice || order.price || 0) + Math.round((order.totalPrice || order.price || 0) * 0.05) + 50,
    paymentMethod: 'Online Payment',
    orderId: order.id,
    platform: order.platform || 'Unknown'
  });

  const generatePDF = () => {
    // Create a new window with the invoice content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .restaurant-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .info-section { flex: 1; }
            .info-section h3 { margin-bottom: 10px; color: #333; }
            .info-item { margin-bottom: 5px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .totals { text-align: right; }
            .total-row { font-weight: bold; font-size: 18px; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div class="restaurant-name">${invoiceData.restaurantInfo.name}</div>
              <div>${invoiceData.restaurantInfo.address}</div>
              <div>Phone: ${invoiceData.restaurantInfo.phone} | Email: ${invoiceData.restaurantInfo.email}</div>
              <div>GSTIN: ${invoiceData.restaurantInfo.gstin}</div>
            </div>
            
            <div class="invoice-details">
              <div class="info-section">
                <h3>Bill To:</h3>
                <div class="info-item">${invoiceData.customerInfo.name}</div>
                <div class="info-item">${invoiceData.customerInfo.address}</div>
                <div class="info-item">Phone: ${invoiceData.customerInfo.phone}</div>
                <div class="info-item">Email: ${invoiceData.customerInfo.email}</div>
              </div>
              <div class="info-section">
                <h3>Invoice Details:</h3>
                <div class="info-item">Invoice #: ${invoiceData.invoiceNumber}</div>
                <div class="info-item">Date: ${invoiceData.date}</div>
                <div class="info-item">Due Date: ${invoiceData.dueDate}</div>
                <div class="info-item">Order ID: ${invoiceData.orderId}</div>
                <div class="info-item">Platform: ${invoiceData.platform}</div>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div>Subtotal: ₹${invoiceData.subtotal}</div>
              <div>Tax (5%): ₹${invoiceData.tax}</div>
              <div>Delivery Fee: ₹${invoiceData.deliveryFee}</div>
              <div class="total-row">Total: ₹${invoiceData.total}</div>
            </div>
            
            <div class="footer">
              <p>Thank you for your business!</p>
              <p>Payment Method: ${invoiceData.paymentMethod}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const downloadPDF = () => {
    // For now, we'll use the same print functionality
    // In a real implementation, you'd use a library like jsPDF or html2pdf
    generatePDF();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Generate Invoice</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice Preview */}
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Invoice Preview</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Restaurant Info */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Restaurant Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {invoiceData.restaurantInfo.name}</div>
                  <div><strong>Address:</strong> {invoiceData.restaurantInfo.address}</div>
                  <div><strong>Phone:</strong> {invoiceData.restaurantInfo.phone}</div>
                  <div><strong>Email:</strong> {invoiceData.restaurantInfo.email}</div>
                  <div><strong>GSTIN:</strong> {invoiceData.restaurantInfo.gstin}</div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {invoiceData.customerInfo.name}</div>
                  <div><strong>Address:</strong> {invoiceData.customerInfo.address}</div>
                  <div><strong>Phone:</strong> {invoiceData.customerInfo.phone}</div>
                  <div><strong>Email:</strong> {invoiceData.customerInfo.email}</div>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-slate-600">Invoice #</div>
                <div className="font-semibold text-slate-900">{invoiceData.invoiceNumber}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-slate-600">Order ID</div>
                <div className="font-semibold text-slate-900">{invoiceData.orderId}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-slate-600">Platform</div>
                <div className="font-semibold text-slate-900">{invoiceData.platform}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-slate-600">Total Amount</div>
                <div className="font-semibold text-emerald-600">₹{invoiceData.total}</div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-6">
            <h4 className="font-medium text-slate-900 mb-3">Order Items</h4>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Item</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-slate-700">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index} className="border-t border-slate-200">
                      <td className="px-4 py-3 text-sm text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-center text-sm text-slate-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-sm text-slate-900">₹{item.price}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm text-slate-600">Subtotal:</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">₹{invoiceData.subtotal}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm text-slate-600">Tax (5%):</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">₹{invoiceData.tax}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right text-sm text-slate-600">Delivery Fee:</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">₹{invoiceData.deliveryFee}</td>
                  </tr>
                  <tr className="border-t-2 border-slate-300">
                    <td colSpan={3} className="px-4 py-3 text-right text-lg font-semibold text-slate-900">Total:</td>
                    <td className="px-4 py-3 text-right text-lg font-semibold text-emerald-600">₹{invoiceData.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={generatePDF}
              className="btn-secondary flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={downloadPDF}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
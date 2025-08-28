import React from 'react';
import { useEffect, useState } from 'react';
import { getJSON } from '../utils/api';

type Order = { id: string; customer: string; status: string; totalPrice?: number; price?: number; platform?: string; time?: string; };

export default function OrdersPage(){
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|undefined>();
  useEffect(() => {
    getJSON<{success:boolean; data: Order[]; pagination?: any}>(`/orders`)
      .then(r => setData(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  return (<div className="p-6">
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Orders</h2>
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="divide-y">
          {data.map(o => (
            <div key={o.id} className="py-3 flex justify-between">
              <div>
                <div className="font-medium">{o.id} — {o.customer}</div>
                <div className="text-sm text-gray-600">{o.platform} • {o.time}</div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-700">{o.status}</span>
                <div className="font-semibold">₹{o.totalPrice ?? o.price ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>);
}

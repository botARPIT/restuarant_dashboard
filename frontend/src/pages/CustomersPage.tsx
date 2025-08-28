import React from react;
import { useEffect, useState } from react;
import { getJSON } from ../utils/api;

type Customer = { id:string; name:string; email:string; phone?:string; totalOrders:number };

export default function CustomersPage(){
  const [customers, setCustomers] = useState<Customer[]>([]);
  useEffect(() => { getJSON<{success:boolean; data:Customer[]}>(/customers).then(r => setCustomers(r.data)); }, []);
  return (<div className="p-6">
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Customers</h2>
      <ul className="divide-y">{customers.map(c => (<li key={c.id} className="py-2 flex justify-between"><span>{c.name} — {c.email}</span><span className="text-gray-600">Orders: {c.totalOrders}</span></li>))}</ul>
    </div>
  </div>);
}

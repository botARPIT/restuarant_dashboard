import React from 'react';
import { useEffect, useState } from 'react';
import { getJSON, sendJSON } from '../utils/api';

type Item = { id:string; name:string; price:number; category?:string; available:boolean };

export default function MenuPage(){
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const load = () => getJSON<{success:boolean; data:Item[]}>('/menu/items').then(r => setItems(r.data)).finally(()=>setLoading(false));
  useEffect(() => { load(); }, []);

  const add = async () => {
    await sendJSON('/menu/items','POST',{ name, price });
    setName(''); setPrice(0);
    load();
  }

  return (<div className="p-6 space-y-4">
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
      {loading ? <p className="text-gray-600">Loading...</p> : (
        <ul className="divide-y">{items.map(i => (<li key={i.id} className="py-2 flex justify-between"><span>{i.name}</span><span>₹{i.price}</span></li>))}</ul>
      )}
    </div>
    <div className="card">
      <h3 className="font-semibold mb-2">Add Item</h3>
      <div className="flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="border rounded px-2 py-1"/>
        <input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} placeholder="Price" className="border rounded px-2 py-1"/>
        <button onClick={add} className="btn-primary">Add</button>
      </div>
    </div>
  </div>);
}

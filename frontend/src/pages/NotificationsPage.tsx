import React from 'react';
import { useEffect, useState } from 'react';
import { getJSON, sendJSON } from '../utils/api';

type NotificationItem = { id:string; title:string; message:string; read:boolean; createdAt:string };

export default function NotificationsPage(){
  const [items, setItems] = useState<NotificationItem[]>([]);
  const load = () => getJSON<{success:boolean; data:NotificationItem[]}>('/notifications').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);
  const markRead = async (id:string) => { await sendJSON(`/notifications/${id}/read`, 'PATCH'); load(); }
  return (<div className="p-6">
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Notifications</h2>
      <ul className="divide-y">{items.map(n => (<li key={n.id} className="py-2 flex justify-between"><div><div className="font-medium">{n.title}</div><div className="text-sm text-gray-600">{n.message}</div></div><div className="flex items-center gap-2"><span className="text-sm">{n.read ? 'Read' : 'Unread'}</span>{!n.read && <button className="btn-secondary" onClick={()=>markRead(n.id)}>Mark read</button>}</div></li>))}</ul>
    </div>
  </div>);
}

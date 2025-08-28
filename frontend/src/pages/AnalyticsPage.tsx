import React from react;
import { useEffect, useState } from react;
import { getJSON } from ../utils/api;

export default function AnalyticsPage(){
  const [summary, setSummary] = useState<any>();
  const [trends, setTrends] = useState<any[]>([]);
  const [error, setError] = useState<string|undefined>();
  useEffect(() => {
    Promise.all([
      getJSON(`/analytics/summary`),
      getJSON(`/analytics/trends?days=7`)
    ]).then(([s, t]) => { setSummary(s.data ?? s); setTrends((t.data ?? t) as any[]); })
      .catch(e => setError(e.message));
  }, []);
  return (<div className="p-6 space-y-6">
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Analytics Summary</h2>
      {error && <p className="text-red-600">{error}</p>}
      {summary && (<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Orders" value={summary.totalOrders} />
        <Stat label="Revenue" value={`₹${summary.totalRevenue}`} />
        <Stat label="Avg Order" value={`₹${summary.avgOrderValue}`} />
        <Stat label="Completion" value={`${summary.completionRate}%`} />
      </div>)}
    </div>
    <div className="card">
      <h3 className="font-semibold mb-2">Last 7 days</h3>
      <div className="space-y-2">
        {trends.map((d:any) => (<div key={d.date} className="flex justify-between text-sm">
          <span className="text-gray-600">{d.date}</</span>
          <span>Orders: {d.orders} • Revenue: ₹{d.revenue}</span>
        </div>))}
      </div>
    </div>
  </div>);
}

function Stat({label, value}:{label:string; value:React.ReactNode}){
  return (<div className="p-4 rounded-lg bg-gray-50 border">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>);
}

import React from 'react';

// Simple bar chart for small time-series: [{ date, value, label }]
// Props: title, series (array), formatValue (fn), max (number optional)
const Chart = ({ title, series = [], formatValue = (v) => v, max, fallbackCount = 7 }) => {
  let values = series.map(s => Number(s.value) || 0);
  const noData = series.length === 0 || values.every(v => v === 0);
  if (noData) {
    // Build a minimal dummy series to keep chart shape when no values
    series = Array.from({ length: fallbackCount }, (_, i) => ({ date: `—`, value: 1, label: 'no-data' }));
    values = series.map(s => s.value);
  }
  const computedMax = typeof max === 'number' ? max : Math.max(1, ...values);
  return (
    <div className="rounded-xl border p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="flex items-end gap-2 h-32">
        {series.map((pt, idx) => {
          const pct = Math.max(0, Math.min(100, (Number(pt.value) || 0) / computedMax * 100));
          return (
            <div key={pt.date || idx} className="flex flex-col items-center gap-1">
              <div className="w-6 rounded-t bg-green-600/70" style={{ height: `${pct}%` }} />
              <div className="text-[10px] text-gray-500">{String(pt.date).slice(5)}</div>
              <div className="text-[10px] text-gray-700">{noData ? '-' : formatValue(pt.value)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chart;

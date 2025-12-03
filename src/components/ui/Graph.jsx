import React from 'react';

// Simple responsive line graph using SVG. Expects series: [{ date, value }]
export default function Graph({ title, series = [], formatValue }) {
  const data = Array.isArray(series) ? series : [];
  const width = 600; // virtual width
  const height = 180; // virtual height
  const padding = 24;

  const values = data.map(d => Number(d.value || 0));
  const dates = data.map(d => d.date);

  const maxV = values.length ? Math.max(...values) : 1;
  const minV = values.length ? Math.min(...values) : 0;

  const x = (i) => {
    const n = Math.max(data.length - 1, 1);
    return padding + (i * (width - padding * 2)) / n;
  };
  const y = (v) => {
    const range = Math.max(maxV - minV, 1);
    const norm = (v - minV) / range;
    return height - padding - norm * (height - padding * 2);
  };

  const pathD = () => {
    if (!data.length) return '';
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(Number(d.value || 0))}`)
      .join(' ');
  };

  const points = data.map((d, i) => ({ cx: x(i), cy: y(Number(d.value || 0)), v: d.value, date: d.date }));

  return (
    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-gray-900/40">
      <div className="font-semibold mb-2">{title}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />
        {/* Line path */}
        <path d={pathD()} fill="none" stroke="#3b82f6" strokeWidth="2" />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="3" fill="#3b82f6" />
        ))}
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        {(dates.length ? dates : ['—']).slice(-3).map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      {data.length === 0 && (
        <div className="text-xs text-muted-foreground mt-2">No data. Rendering empty graph.</div>
      )}
      {data.length > 0 && (
        <div className="text-xs text-muted-foreground mt-2">
          Last: {formatValue ? formatValue(values[values.length - 1]) : values[values.length - 1]}
        </div>
      )}
    </div>
  );
}

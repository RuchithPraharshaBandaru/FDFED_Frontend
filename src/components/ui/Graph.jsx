import React from 'react';

// Simple responsive line graph using SVG. Expects series: [{ date, value }]
export default function Graph({ title, series = [], formatValue, color = "#3b82f6" }) {
  const data = Array.isArray(series) ? series : [];
  const width = 600; // virtual width
  const height = 200; // virtual height
  const padding = 30;

  const values = data.map(d => Number(d.value || 0));
  const dates = data.map(d => d.date);

  const maxV = values.length ? Math.max(...values) : 1;
  const minV = values.length ? Math.min(...values) : 0;
  const range = Math.max(maxV - minV, 1);

  const x = (i) => {
    const n = Math.max(data.length - 1, 1);
    return padding + (i * (width - padding * 2)) / n;
  };
  const y = (v) => {
    const norm = (v - minV) / range;
    return height - padding - norm * (height - padding * 2);
  };

  const pathD = () => {
    if (!data.length) return '';
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(Number(d.value || 0))}`)
      .join(' ');
  };

  const areaD = () => {
    if (!data.length) return '';
    const line = pathD();
    return `${line} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
  };

  const points = data.map((d, i) => ({ cx: x(i), cy: y(Number(d.value || 0)), v: d.value, date: d.date }));

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {data.length > 0 && (
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue ? formatValue(values[values.length - 1]) : values[values.length - 1]}
          </div>
        )}
      </div>
      
      <div className="relative w-full aspect-3/1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
            <line 
              key={tick}
              x1={padding} 
              y1={padding + tick * (height - 2 * padding)} 
              x2={width - padding} 
              y2={padding + tick * (height - 2 * padding)} 
              stroke="currentColor" 
              strokeOpacity="0.1" 
              strokeDasharray="4 4"
            />
          ))}

          {/* Area fill */}
          <path d={areaD()} fill={`url(#gradient-${title.replace(/\s+/g, '')})`} />
          
          {/* Line path */}
          <path d={pathD()} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Points */}
          {points.map((p, i) => (
            <g key={i} className="group">
              <circle 
                cx={p.cx} 
                cy={p.cy} 
                r="4" 
                fill="white" 
                stroke={color} 
                strokeWidth="2"
                className="transition-all duration-200 group-hover:r-6"
              />
              <title>{`${p.date}: ${formatValue ? formatValue(p.v) : p.v}`}</title>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {data.length > 0 ? (
          <>
            <span>{dates[0]}</span>
            <span>{dates[Math.floor(dates.length / 2)]}</span>
            <span>{dates[dates.length - 1]}</span>
          </>
        ) : (
          <span className="w-full text-center">No data available</span>
        )}
      </div>
    </div>
  );
}

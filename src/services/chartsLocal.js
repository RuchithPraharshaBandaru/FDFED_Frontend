export async function fetchChartSeries(key) {
  const map = {
    usersCreated: '/charts/usersCreated.json',
    productsAdded: '/charts/productsAdded.json',
    ordersCount: '/charts/ordersCount.json',
    revenue: '/charts/revenue.json',
  };
  const path = map[key];
  if (!path) throw new Error(`Unknown chart key: ${key}`);
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const json = await res.json();
  return Array.isArray(json.series) ? json.series : [];
}

export async function fetchAllCharts() {
  const keys = ['usersCreated', 'productsAdded', 'ordersCount', 'revenue'];
  const results = await Promise.all(keys.map(k => fetchChartSeries(k)));
  return {
    usersCreated: results[0],
    productsAdded: results[1],
    ordersCount: results[2],
    revenue: results[3],
  };
}
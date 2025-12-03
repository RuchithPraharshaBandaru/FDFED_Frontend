import React, { useEffect, useState } from 'react';
import { getDelivery } from '../../../services/adminApi';

const DeliveryPage = () => {
  const [msg, setMsg] = useState('Loading…');
  useEffect(() => { (async () => { try { const res = await getDelivery(); setMsg(res?.message || ''); } catch { setMsg('Failed to load'); } })(); }, []);
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Delivery</h1>
      <p className="text-muted-foreground">{msg}</p>
    </div>
  );
};

export default DeliveryPage;

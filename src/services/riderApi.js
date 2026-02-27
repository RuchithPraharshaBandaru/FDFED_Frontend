// src/services/riderApi.js

const RIDER_BASE = 'http://localhost:8000/api/v1/rider';

const jsonHeaders = { 'Content-Type': 'application/json' };

const handleJson = async (res) => {
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        console.error("API Error:", res.status, data);
        const msg = data?.message || `Request failed (${res.status})`;
        const err = new Error(msg);
        err.data = data;
        err.status = res.status;
        throw err;
    }
    return data;
};

// --- AUTH ---

export const riderRegister = async (riderData) => {
    const res = await fetch(`${RIDER_BASE}/register`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(riderData),
        credentials: 'include',
    });
    return handleJson(res);
};

export const riderLogin = async (credentials) => {
    const res = await fetch(`${RIDER_BASE}/login`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(credentials),
        credentials: 'include',
    });
    return handleJson(res);
};

export const getRiderProfile = async () => {
    const res = await fetch(`${RIDER_BASE}/profile`, {
        credentials: 'include',
    });
    return handleJson(res);
};

export const updateRiderStatus = async (isActive) => {
    const res = await fetch(`${RIDER_BASE}/status`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({ isActive }),
        credentials: 'include',
    });
    return handleJson(res);
};

// --- PICKUPS ---

export const getAvailablePickups = async () => {
    const res = await fetch(`${RIDER_BASE}/available-pickups`, {
        credentials: 'include',
    });
    return handleJson(res);
};

export const claimPickup = async (pickupId) => {
    const res = await fetch(`${RIDER_BASE}/pickups/${pickupId}/claim`, {
        method: 'PUT',
        credentials: 'include',
    });
    return handleJson(res);
};

export const updatePickupStatus = async (pickupId, status) => {
    const res = await fetch(`${RIDER_BASE}/pickups/${pickupId}/status`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({ status }),
        credentials: 'include',
    });
    return handleJson(res);
};

export const getMyPickups = async () => {
    const res = await fetch(`${RIDER_BASE}/my-pickups`, {
        credentials: 'include',
    });
    return handleJson(res);
};

// --- EARNINGS ---

export const getRiderEarnings = async () => {
    const res = await fetch(`${RIDER_BASE}/earnings`, {
        credentials: 'include',
    });
    return handleJson(res);
};

export const requestPayout = async (amount) => {
    const res = await fetch(`${RIDER_BASE}/payout-request`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ amount }),
        credentials: 'include',
    });
    return handleJson(res);
};

export default {
    riderRegister,
    riderLogin,
    getRiderProfile,
    updateRiderStatus,
    getAvailablePickups,
    claimPickup,
    updatePickupStatus,
    getMyPickups,
    getRiderEarnings,
    requestPayout,
};

import { API_BASE } from './config';

let _token = localStorage.getItem('token') || null;
export const setAuthToken = (t) => { _token = t; };

async function request(route, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  const res = await fetch(`${API_BASE}${route}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText || 'Request failed');
  return data;
}

// Auth
export const login    = (username, password)        => request('/api/users/login',    { method: 'POST', body: JSON.stringify({ username, password })});
export const register = (username, email, password) => request('/api/users/register', { method: 'POST', body: JSON.stringify({ username, email, password })});

// Account
export const me       = () => request('/api/account/me');

// Slots
export const spinSlots = (bet) => request('/api/slots/spin', { method: 'POST', body: JSON.stringify({ bet }) });

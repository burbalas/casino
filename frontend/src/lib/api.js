import { API_BASE } from './config';

let _token = localStorage.getItem('token') || null;
export const setAuthToken = (t) => { _token = t; };

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  const res = await fetch(`${API_BASE}/api/users${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || res.statusText || 'Request failed');
  return data;
}

export const login    = (username, password)       => request('/login',    { method: 'POST', body: JSON.stringify({ username, password })});
export const register = (username, email, password)=> request('/register', { method: 'POST', body: JSON.stringify({ username, email, password })});

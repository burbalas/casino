import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';
import PageBackground from './PageBackground';

const card = {
  width: 360,
  maxWidth: '92vw',
  padding: 24,
  borderRadius: 12,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.35)',
  backdropFilter: 'blur(6px)',
  boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
  color: 'white'
};
const input = {
  width: '93%',
  padding: '10px 12px',
  margin: '8px 0',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.35)',
  background: 'rgba(0,0,0,0.25)',
  color: 'white',
  outline: 'none'
};
const button = {
  width: '100%',
  padding: '10px 14px',
  marginTop: 8,
  borderRadius: 8,
  border: 'none',
  background: 'linear-gradient(180deg, #ffd35c, #ffb300)',
  color: '#222',
  fontWeight: 700,
  cursor: 'pointer'
};
const link = { color: 'white', textDecoration: 'underline' };

export default function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { token } = await api.login(form.username.trim(), form.password);
      login(token);
      nav('/lobby');
    } catch (err) {
      setMsg(err.message || 'Login failed');
    }
  };

  return (
    <PageBackground>
      <div style={card}>
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Login</h2>
        <p style={{ marginTop: 0, opacity: 0.85 }}>Welcome back! Enter your details.</p>
        <form onSubmit={submit}>
          <input
            style={input}
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={(e)=>setForm(f=>({...f,username:e.target.value}))}
            required
          />
          <input
            style={input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={(e)=>setForm(f=>({...f,password:e.target.value}))}
            required
          />
          <button style={button}>Login</button>
        </form>
        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
        <p style={{ marginTop: 14 }}>
          No account? <Link to="/register" style={link}>Register</Link>
        </p>
      </div>
    </PageBackground>
  );
}

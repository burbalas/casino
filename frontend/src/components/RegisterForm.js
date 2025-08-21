import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import * as api from '../lib/api';
import PageBackground from './PageBackground';

const card = {
  width: 380,
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

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { userId } = await api.register(
        formData.username.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );
      setMessage(`User registered! ID: ${userId}`);
      setTimeout(()=>nav('/login'), 800);
    } catch (err) {
      setMessage(err.message || 'Registration failed.');
    }
  };

  return (
    <PageBackground>
      <div style={card}>
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Register</h2>
        <p style={{ marginTop: 0, opacity: 0.85 }}>Create your account to start playing.</p>
        <form onSubmit={handleSubmit}>
          <input
            style={input}
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={(e)=>setFormData(s=>({...s,[e.target.name]:e.target.value}))}
            required
          />
          <input
            style={input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e)=>setFormData(s=>({...s,[e.target.name]:e.target.value}))}
            required
          />
          <input
            style={input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e)=>setFormData(s=>({...s,[e.target.name]:e.target.value}))}
            required
          />
          <button style={button} type="submit">Register</button>
        </form>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
        <p style={{ marginTop: 14 }}>
          Already have an account? <Link to="/login" style={link}>Login</Link>
        </p>
      </div>
    </PageBackground>
  );
}

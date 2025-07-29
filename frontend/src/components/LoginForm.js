// src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      const { token } = await res.json();
      login(token);
      nav('/lobby');
    } else setMsg('Login failed');
  };

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    
    

    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input name="username" onChange={handle} value={form.username} placeholder="Username" required/><br/>
        <input name="password" type="password" onChange={handle} value={form.password} placeholder="Password" required/><br/>
        <button>Login</button>
      </form>
      {msg && <p>{msg}</p>}
      <p><Link to="/register">register</Link></p>
    </div>
  );
}

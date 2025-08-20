import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

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
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input name="username" onChange={(e)=>setForm(f=>({...f,username:e.target.value}))} value={form.username} placeholder="Username" required/><br/>
        <input name="password" type="password" onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} value={form.password} placeholder="Password" required/><br/>
        <button>Login</button>
      </form>
      {msg && <p>{msg}</p>}
      <p><Link to="/register">register</Link></p>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import * as api from '../lib/api';

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={formData.username}
               onChange={(e)=>setFormData(s=>({...s,[e.target.name]:e.target.value}))} required /><br />
        <input name="email" type="email" placeholder="Email" value={formData.email}
               onChange={(e)=>setFormData(s=>({...s,[e.target.name]:e.target.value}))} required /><br />
        <input name="password" type="password" placeholder="Password" value={formData.password}
               onChange={(e)=>setFormData(s=>({...s,[e.target.name]:e.target.value}))} required /><br />
        <button type="submit">Register</button>
        <p><Link to="/login">login</Link></p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

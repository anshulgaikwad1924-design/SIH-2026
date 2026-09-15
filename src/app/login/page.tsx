'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('customer@demo.com');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn('credentials', {
      email,
      password: 'password',
      callbackUrl: email.includes('officer') ? '/officer/dashboard' : '/customer/dashboard',
    });
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="title" style={{ fontSize: '24px', textAlign: 'center' }}>Portal Login</h1>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
          <button 
            className={`badge ${email === 'customer@demo.com' ? 'badge-success' : ''}`}
            onClick={() => setEmail('customer@demo.com')}
            style={{ border: 'none', cursor: 'pointer', background: email === 'customer@demo.com' ? '' : '#f3f4f6', color: email === 'customer@demo.com' ? '' : '#6b7280' }}
          >
            Customer Demo
          </button>
          <button 
            className={`badge ${email === 'officer@demo.com' ? 'badge-info' : ''}`}
            onClick={() => setEmail('officer@demo.com')}
            style={{ border: 'none', cursor: 'pointer', background: email === 'officer@demo.com' ? '' : '#f3f4f6', color: email === 'officer@demo.com' ? '' : '#6b7280' }}
          >
            Officer Demo
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              value="password"
              readOnly
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

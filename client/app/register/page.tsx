// client/app/register/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { REGISTER_MUTATION } from '../lib/graphql/mutations/register';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 🌍 REGION STATE (Default to AU)
  const [regionCode, setRegionCode] = useState('AU');
  const [detecting, setDetecting] = useState(true);

  const router = useRouter();
  const { login: authLogin } = useAuth();

  // 👇 MAGICAL AUTO-DETECTION HOOK
  useEffect(() => {
    const detectRegion = async () => {
      try {
        // 1. Fetch location from free IP API
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        
        // 2. Map standard ISO codes (GB) to your internal codes (UK)
        const countryMapping: Record<string, string> = {
          'AU': 'AU',
          'NZ': 'NZ',
          'US': 'US',
          'GB': 'UK', // Internet says GB, your DB says UK
          'UK': 'UK',
        };

        const detected = countryMapping[data.country_code];

        // 3. Only update if we support that region
        if (detected) {
          setRegionCode(detected);
        }
      } catch (err) {
        // Silent fail - stick to default
      } finally {
        setDetecting(false);
      }
    };

    detectRegion();
  }, []);

  const [register, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      console.log('Registration successful!', data);
      const { token, user } = data.register;
      authLogin(token, user);
      router.push('/dashboard');
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await register({
        variables: {
          input: {
            name,
            email,
            password,
            regionCode, // 👈 Sending the selected region
          },
        },
      });
    } catch (e) {
      console.error('Registration submission error:', e);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create Account</h1>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {/* 🌍 REGION SELECTOR */}
        <div className={styles.inputGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="region" className={styles.label}>Region (Tax & Currency)</label>
            {/* Show tiny badge if auto-detection finished */}
            {!detecting && <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 500 }}>✓ Detected</span>}
          </div>
          
          <select
            id="region"
            value={regionCode}
            onChange={(e) => setRegionCode(e.target.value)}
            className={styles.input}
            required
          >
            <option value="AU">🇦🇺 Australia (AUD - GST 10%)</option>
            <option value="NZ">🇳🇿 New Zealand (NZD - GST 15%)</option>
            <option value="UK">🇬🇧 United Kingdom (GBP - VAT 20%)</option>
            <option value="US">🇺🇸 United States (USD - Sales Tax)</option>
          </select>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Sets your default currency and tax rules automatically.
          </p>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error.message}</p>}
      </form>
    </div>
  );
}
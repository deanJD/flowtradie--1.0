// client/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { LOGIN_MUTATION } from '../lib/graphql/mutations/login';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: authLogin } = useAuth();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      console.log('Login successful!', data);
      const { token, user } = data.login;

      // Save token to context + localStorage
      authLogin(token, user);

      // ❗⛔ TEMPORARILY DISABLE REDIRECT – STAY ON LOGIN PAGE
      console.log("🚫 Redirect temporarily disabled — for TOKEN TEST");
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login({
        variables: {
          input: { email, password },
        },
      });
    } catch (e) {
      console.error('Login submission error:', e);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Login</h1>

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

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>Error: {error.message}</p>}
      </form>

      {/* 🔍 BUTTON FOR DIRECT TOKEN TEST */}
      <button
        type="button"
        onClick={() => {
          fetch("http://localhost:4000/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 DIRECT SEND
            },
            body: JSON.stringify({
              query: `query { me { id email role businessId } }`,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log("🔍 DIRECT FETCH RESULT:", data))
            .catch((err) => console.error("❌ FETCH ERROR:", err));
        }}
        style={{ marginTop: "1rem" }}
      >
        🔍 Test Token (Debug Only)
      </button>
    </div>
  );
}

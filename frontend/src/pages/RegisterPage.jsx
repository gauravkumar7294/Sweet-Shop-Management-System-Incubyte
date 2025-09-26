import React, { useState } from 'react';
import { apiService } from '../services/apiService.jsx';
import { styles } from '../styles/styles.jsx';

const RegisterPage = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiService.register(email, password);
      setMessage('Registration successful! Please log in.');
      // Automatically switch to the login page after 2 seconds
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <div className={`${styles.modalContent} space-y-6`}>
        <h2 className="text-3xl font-bold text-center text-pink-500">Create Your Account</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
        {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={`${styles.button} w-full`}>Register</button>
        </form>
        <p className="text-center">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-pink-500 hover:underline font-semibold">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import { styles } from '../styles/styles';

const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiService.login(email, password);
      login(data.token); // Update auth context on successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-100">
      <div className={`${styles.modalContent} space-y-6`}>
        <h2 className="text-3xl font-bold text-center text-pink-500">Welcome Back!</h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-center">{error}</p>}
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
          <button type="submit" className={`${styles.button} w-full`}>Login</button>
        </form>
        <p className="text-center">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-pink-500 hover:underline font-semibold">
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

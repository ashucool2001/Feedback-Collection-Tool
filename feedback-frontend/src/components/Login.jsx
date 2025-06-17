import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', credentials);
      login(res.data.access_token);
    } catch (err) {
      setError('Invalid login');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={credentials.username} onChange={handleChange} /><br />
        <input name="password" type="password" placeholder="Password" value={credentials.password} onChange={handleChange} /><br />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiURL from "../api/api";
import '../styles/Login.css'; // Import the CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    formData.append('client_id', '6jex3YDRLJvcSWKzkDWYn1SDW4zJWykwra0CsE6k');  // Replace with your actual client_id
    formData.append('client_secret', 'I4O49zDCAUJauSpocxUI7AUou2WtrvXIheQGlBoI0jVCNfLuoX5fEdBaof1PdVCNpiPThXiypZfs8eodPPSgftH96FZv3UwF98Jm2NlQyfNY5xdRbirFAc8ap3Q6mTfB'); // Replace with your actual client_secret

    try {
      const response = await axios.post(`${apiURL}/o/token/`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      navigate('/');
    } catch (error) {
      console.error('Login failed', error.response.data);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <button onClick={() => navigate('/register')}>Register</button>
        </p>
      </form>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from './components/AuthForm';
import KanbanBoard from './components/KanbanBoard';

const API_URL = 'http://localhost:3000/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  const handleLogin = async (formData, formState) => {
    try {
      const endpoint = formState === 'login' ? '/users/login' : '/users/register';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      setToken(response.data.token);
      setUser(response.data.user);
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
  };

  return (
    <div>
      {!user ? (
        <AuthForm onLogin={(user, token) => {
          setUser(user);
          setToken(token);
        }} />
        
      ) : (
        <KanbanBoard user={user} token={token} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;

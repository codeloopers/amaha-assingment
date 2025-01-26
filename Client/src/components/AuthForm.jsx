import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = ({ onLogin }) => {
  const [formState, setFormState] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (formState === 'register') {
        const response = await fetch('https://amaha-assingment.onrender.com/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to register');
        }

        setSuccessMessage('Registration successful! You can now log in.');
        setFormState('login');
      } else if (formState === 'login') {
        const response = await fetch('https://amaha-assingment.onrender.com/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to login');
        }

        setSuccessMessage('Login successful! Redirecting...');
        localStorage.setItem('authToken', data.token);

        onLogin(data.user, data.token);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1>{formState === 'login' ? 'Login' : 'Register'}</h1>
        <form onSubmit={handleSubmit}>
          {formState === 'register' && (
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : formState === 'login' ? 'Login' : 'Register'}
          </button>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <p>
            {formState === 'login' ? 'No account?' : 'Already have an account?'}
            <span onClick={() => setFormState(formState === 'login' ? 'register' : 'login')}>
              {formState === 'login' ? ' Register' : ' Login'}
            </span>
          </p>
        </form>
        {loading && <div className="loader"></div>}
      </div>
    </div>
  );
};

export default AuthForm;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validators } from '../utils/validators';
import '../styles/auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [name]: ''
    });
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!validators.email(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    const usernameError = validators.username(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }

    const passwordError = validators.password(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setApiError('');

    try {
      await register(formData.email, formData.username, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">CanvasLab</h1>
        </div>
        
        {apiError && (
          <div className="error-container">
            <div className="error-content">
              <span className="error-text">{apiError}</span>
            </div>
          </div>
        )}
        
        <div className="auth-form">
          <div className="input-group">
            <label className="input-label">
              Email <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`input ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">
              Username <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="username"
              className={`input ${errors.username ? 'input-error' : ''}`}
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">
              Password <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              name="password"
              className={`input ${errors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="password123"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">
              Confirm Password <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="password123"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
        
        <div className="auth-footer">
          <p className="auth-link-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
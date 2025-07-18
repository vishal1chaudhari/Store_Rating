import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }

    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    
    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 400) {
      newErrors.address = 'Address must be 400 characters or less';
    }

    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be 8-16 characters long';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one uppercase letter';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Password must include at least one special character';
    }

    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password
      });

      setSuccess('Registration successful! Redirecting to login...');
      setFormData({
        name: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
      });
      
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setErrors({ submit: errorMessage });
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Sign Up</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter your full name (20-60 characters)"
          />
          {errors.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
            placeholder="Enter your address (max 400 characters)"
            rows="3"
          />
          {errors.address && (
            <span className="error-message">{errors.address}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            placeholder="Enter password (8-16 characters)"
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
          <small className="help-text">
            Password must be 8-16 characters, include at least one uppercase letter and one special character.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        {errors.submit && (
          <div className="error-message global-error">{errors.submit}</div>
        )}

        {success && (
          <div className="success-message">{success}</div>
        )}

        <div className="button-group">
          <button type="submit" className="submit-button">
            Sign Up
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            className="cancel-button"
          >
            Back to Login
          </button>
        </div>
      </form>

      <style>{`
        .container {
          padding: 20px;
          max-width: 500px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        .heading {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 30px;
          text-align: center;
        }
        .form {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
          font-family: inherit;
        }
        .form-group input.error, .form-group textarea.error {
          border-color: #dc3545;
        }
        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 5px;
          display: block;
        }
        .global-error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .success-message {
          color: #155724;
          background: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
        }
        .help-text {
          color: #666;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }
        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }
        .submit-button, .cancel-button {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .submit-button {
          background-color: #007bff;
          color: white;
        }
        .submit-button:hover {
          background-color: #0056b3;
        }
        .cancel-button {
          background-color: #6c757d;
          color: white;
        }
        .cancel-button:hover {
          background-color: #545b62;
        }
      `}</style>
    </div>
  );
};

export default Signup;

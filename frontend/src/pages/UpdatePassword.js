import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

   
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8 || formData.newPassword.length > 16) {
      newErrors.newPassword = 'Password must be 8-16 characters long';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include at least one uppercase letter';
    } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include at least one special character';
    }

    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
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
      await axios.post('/users/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      
      const userRole = localStorage.getItem('role');
      let redirectPath = '/login';
      
      if (userRole === 'admin') {
        redirectPath = '/admin';
      } else if (userRole === 'user') {
        redirectPath = '/user';
      } else if (userRole === 'store_owner') {
        redirectPath = '/owner';
      }
      
      
      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } catch (error) {
      console.error('Update password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      setErrors({ submit: errorMessage });
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Update Password</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={errors.currentPassword ? 'error' : ''}
          />
          {errors.currentPassword && (
            <span className="error-message">{errors.currentPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={errors.newPassword ? 'error' : ''}
          />
          {errors.newPassword && (
            <span className="error-message">{errors.newPassword}</span>
          )}
          <small className="help-text">
            Password must be 8-16 characters, include at least one uppercase letter and one special character.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
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
            Update Password
          </button>
          <button 
            type="button" 
            onClick={() => {
              const userRole = localStorage.getItem('role');
              let redirectPath = '/login';
              
              if (userRole === 'admin') {
                redirectPath = '/admin';
              } else if (userRole === 'user') {
                redirectPath = '/user';
              } else if (userRole === 'store_owner') {
                redirectPath = '/owner';
              }
              
              navigate(redirectPath);
            }}
            className="cancel-button"
          >
            Cancel
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
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          box-sizing: border-box;
        }
        .form-group input.error {
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

export default UpdatePassword; 
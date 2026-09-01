import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: null, form: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message || 'Invalid email or password.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Continue your project journey with AI-powered guidance.
        </p>
      </div>

      {errors.form && (
        <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={16} />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="loginEmail">
            Email Address
          </label>
          <div className="input-icon-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              id="loginEmail"
              type="email"
              name="email"
              className={`form-input has-icon ${errors.email ? 'has-error' : ''}`}
              placeholder="student@university.edu"
              value={formData.email}
              onChange={handleChange}
              autoFocus
            />
          </div>
          {errors.email && (
            <div className="form-error">
              <AlertCircle size={12} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label className="form-label" htmlFor="loginPassword" style={{ marginBottom: 0 }}>
              Password
            </label>
            <button
              type="button"
              className="text-link-btn"
              onClick={() => {
                setForgotEmail(formData.email);
                setForgotSent(false);
                setShowForgotModal(true);
              }}
            >
              Forgot Password?
            </button>
          </div>
          <div className="input-icon-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              id="loginPassword"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`form-input has-icon has-action ${errors.password ? 'has-error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="input-action-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <div className="form-error">
              <AlertCircle size={12} />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* Remember Me */}
        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>Remember me on this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Signing In...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="auth-footer-links">
        <span>Don't have an account?</span>
        <Link to="/register" className="auth-link">
          Create Account
        </Link>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        maxWidth="460px"
      >
        {forgotSent ? (
          <div>
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '1rem',
                color: '#166534',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                marginBottom: '1rem'
              }}
            >
              If an account with <strong>{forgotEmail}</strong> exists, password reset instructions have been recorded.
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Note: Automated SMTP mailer integration will be connected during the FastAPI backend integration phase.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowForgotModal(false)}
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Enter the academic email address associated with your account and we will generate a recovery token.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="forgotEmail">
                Email Address
              </label>
              <input
                id="forgotEmail"
                type="email"
                className="form-input"
                placeholder="student@university.edu"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowForgotModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

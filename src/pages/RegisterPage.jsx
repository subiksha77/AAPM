import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Layers,
  Building2,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DOMAINS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Development',
  'Data Science',
  'IoT',
  'Cybersecurity',
  'Cloud Computing',
  'Other'
];

const ACADEMIC_LEVELS = [
  'Diploma',
  'Undergraduate',
  'Postgraduate'
];

const ROLES = [
  'Student',
  'Faculty / Project Guide',
  'Researcher',
  'Industry Mentor'
];

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    academicLevel: 'Undergraduate',
    domain: 'Artificial Intelligence',
    institution: '',
    guideName: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.role) {
      newErrors.role = 'Please select what best describes you.';
    }

    if (!formData.academicLevel) {
      newErrors.academicLevel = 'Please select your academic level.';
    }

    if (!formData.domain) {
      newErrors.domain = 'Please select your domain.';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Please enter your institution.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Privacy Policy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setErrors((prev) => ({ ...prev, form: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Start planning, tracking and completing your project with AI-powered guidance.
        </p>
      </div>

      {errors.form && (
        <div className="auth-alert auth-alert-error" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={16} />
          <span>{errors.form}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            Full Name <span className="required">*</span>
          </label>
          <div className="input-icon-wrapper">
            <User size={16} className="input-icon" />
            <input
              id="fullName"
              type="text"
              name="fullName"
              className={`form-input has-icon ${errors.fullName ? 'has-error' : ''}`}
              placeholder="e.g. Subiksha S"
              value={formData.fullName}
              onChange={handleChange}
              autoFocus
            />
          </div>
          {errors.fullName && (
            <div className="form-error">
              <AlertCircle size={12} />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        {/* Email Address */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address <span className="required">*</span>
          </label>
          <div className="input-icon-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              id="email"
              type="email"
              name="email"
              className={`form-input has-icon ${errors.email ? 'has-error' : ''}`}
              placeholder="student@university.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && (
            <div className="form-error">
              <AlertCircle size={12} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Role & Academic Level */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              What best describes you? <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <Briefcase size={16} className="input-icon" />
              <select
                id="role"
                name="role"
                className="form-select has-icon"
                value={formData.role}
                onChange={handleChange}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {errors.role && (
              <div className="form-error">
                <AlertCircle size={12} />
                <span>{errors.role}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="academicLevel">
              Academic Level <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <GraduationCap size={16} className="input-icon" />
              <select
                id="academicLevel"
                name="academicLevel"
                className="form-select has-icon"
                value={formData.academicLevel}
                onChange={handleChange}
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input has-icon has-action ${errors.password ? 'has-error' : ''}`}
                placeholder="Min. 8 characters"
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

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-input has-icon has-action ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="form-error">
                <AlertCircle size={12} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>
        </div>

        {/* Domain & Institution */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="domain">
              Domain / Area of Study <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <Layers size={16} className="input-icon" />
              <select
                id="domain"
                name="domain"
                className="form-select has-icon"
                value={formData.domain}
                onChange={handleChange}
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="institution">
              Institution / College <span className="required">*</span>
            </label>
            <div className="input-icon-wrapper">
              <Building2 size={16} className="input-icon" />
              <input
                id="institution"
                type="text"
                name="institution"
                className={`form-input has-icon ${errors.institution ? 'has-error' : ''}`}
                placeholder="e.g. National Institute of Technology"
                value={formData.institution}
                onChange={handleChange}
              />
            </div>
            {errors.institution && (
              <div className="form-error">
                <AlertCircle size={12} />
                <span>{errors.institution}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mentor Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="guideName">
            Project Guide / Mentor Name <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
          </label>
          <div className="input-icon-wrapper">
            <UserCheck size={16} className="input-icon" />
            <input
              id="guideName"
              type="text"
              name="guideName"
              className="form-input has-icon"
              placeholder="e.g. Dr. K. Ramesh (Infosys Academic Mentor)"
              value={formData.guideName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="form-group" style={{ marginTop: '0.25rem' }}>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <span>
              I agree to the <span style={{ color: '#2563eb', fontWeight: 500 }}>Terms of Service</span> and{' '}
              <span style={{ color: '#2563eb', fontWeight: 500 }}>Privacy Policy</span>
            </span>
          </label>
          {errors.agreeTerms && (
            <div className="form-error">
              <AlertCircle size={12} />
              <span>{errors.agreeTerms}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="auth-footer-links">
        <span>Already have an account?</span>
        <Link to="/login" className="auth-link">
          Sign In
        </Link>
      </div>
    </div>
  );
};

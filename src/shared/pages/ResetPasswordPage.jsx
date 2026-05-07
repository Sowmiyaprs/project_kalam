import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader, Check, X } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from '../../utils/authValidation.js';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { updatePassword } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    password: null,
    confirmPassword: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let validation;

    if (name === 'password') {
      validation = validatePassword(value);
    } else if (name === 'confirmPassword') {
      validation = validateConfirmPassword(formData.password, value);
    }

    setErrors(prev => ({ ...prev, [name]: validation.error }));
    return validation.isValid;
  };

  const validateForm = () => {
    const passwordValid = validateField('password', formData.password);
    const confirmValid = validateField('confirmPassword', formData.confirmPassword);

    setTouched({
      password: true,
      confirmPassword: true,
    });

    return passwordValid && confirmValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    if (!email) {
      toast.error('Invalid reset link');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(email, formData.password);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordValidation = validatePassword(formData.password);

  const strengthColors = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    gray: 'bg-gray-600',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-neutral-50 via-white to-lavender-50/30 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lavender-400 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lavender-500 to-lavender-600 rounded-2xl mb-6 shadow-soft-lg"
          >
            <span className="text-3xl">🔐</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-neutral-900 mb-2"
          >
            Reset Password
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-600"
          >
            Enter your new password below
          </motion.p>
        </div>

        <Card variant="elevated" className="backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-lavender-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent ${
                    touched.password && errors.password
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-500">Password Strength</span>
                    <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength.strength}%` }}
                      className={`h-2 rounded-full ${strengthColors[passwordStrength.color]}`}
                    />
                  </div>
                </motion.div>
              )}

              {/* Password Requirements */}
              {touched.password && formData.password && passwordValidation.errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 space-y-1"
                >
                  {passwordValidation.errors.map((error, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-red-500">
                      <X className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-lavender-500 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                  <Check className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-neutral-500 hover:text-neutral-700 transition">
              ← Back to Login
            </Link>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-700 transition inline-flex items-center gap-1">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

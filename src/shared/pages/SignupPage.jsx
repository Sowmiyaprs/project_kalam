import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Check, X, Loader, ArrowRight } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
  getPasswordStrength,
} from '../../utils/authValidation.js';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    fullName: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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

    switch (name) {
      case 'fullName':
        validation = validateFullName(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(formData.password, value);
        break;
      default:
        return;
    }

    setErrors(prev => ({ ...prev, [name]: validation.error }));
    return validation.isValid;
  };

  const validateForm = () => {
    const nameValid = validateField('fullName', formData.fullName);
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const confirmValid = validateField('confirmPassword', formData.confirmPassword);

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return nameValid && emailValid && passwordValid && confirmValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.fullName, formData.email, formData.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
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
    gray: 'bg-neutral-400',
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
          className="absolute top-20 right-20 w-96 h-96 bg-lavender-400 rounded-full mix-blend-multiply filter blur-3xl"
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
            <span className="text-3xl">🧠</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-neutral-900 mb-2"
          >
            Create Account
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-600"
          >
            Start your wellness journey today
          </motion.p>
        </div>

        {/* Signup Card */}
        <Card variant="elevated" className="backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-lavender-500 transition-colors" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent ${
                    touched.fullName && errors.fullName
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                />
                {touched.fullName && !errors.fullName && formData.fullName && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.fullName && errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.fullName}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-lavender-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent ${
                    touched.email && errors.email
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                />
                {touched.email && !errors.email && formData.email && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
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
                Confirm Password
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

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-neutral-300 text-lavender-600 focus:ring-lavender-500 cursor-pointer"
                />
                <span className="text-sm text-neutral-600">
                  I agree to the{' '}
                  <a href="#" className="text-lavender-600 hover:text-lavender-700 transition">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-lavender-600 hover:text-lavender-700 transition">
                    Privacy Policy
                  </a>
                </span>
              </label>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-lavender-600 hover:text-lavender-700 transition">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader, Check, X, ArrowRight } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { validateEmail } from '../../utils/authValidation.js';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null,
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

    if (name === 'email') {
      validation = validateEmail(value);
    } else if (name === 'password') {
      validation = value ? { isValid: true, error: null } : { isValid: false, error: 'Password is required' };
    }

    setErrors(prev => ({ ...prev, [name]: validation.error }));
    return validation.isValid;
  };

  const validateForm = () => {
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);

    setTouched({
      email: true,
      password: true,
    });

    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password, rememberMe);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
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
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"
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
            Welcome back
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-600"
          >
            Continue your wellness journey
          </motion.p>
        </div>

        {/* Login Card */}
        <Card variant="elevated" className="backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email address
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
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent ${
                    touched.email && errors.email
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                />
                {touched.email && !errors.email && formData.email && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {touched.email && errors.email && (
                  <X className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {touched.email && errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Input */}
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
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent ${
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
              {touched.password && errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-lavender-600 focus:ring-lavender-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-lavender-600 hover:text-lavender-700 transition-colors"
              >
                Forgot password?
              </Link>
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-lavender-600 hover:text-lavender-700 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

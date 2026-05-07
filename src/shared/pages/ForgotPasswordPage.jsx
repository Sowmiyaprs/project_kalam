import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader, Check, X } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { validateEmail } from '../../utils/authValidation.js';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (touched) {
      const validation = validateEmail(e.target.value);
      setError(validation.error);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validation = validateEmail(email);
    setError(validation.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setTouched(true);
      setError(validation.error);
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would send a reset email
      // For now, we'll navigate to reset password page with email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
            className="absolute top-20 left-20 w-96 h-96 bg-lavender-400 rounded-full mix-blend-multiply filter blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Card variant="elevated" className="text-center backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 shadow-soft-lg"
            >
              <span className="text-4xl">✉️</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Check Your Email</h2>
            <p className="text-neutral-600 mb-6">
              We've sent a password reset link to <strong className="text-neutral-900">{email}</strong>
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setSubmitted(false)}
              >
                Try Another Email
              </Button>
              <Link to="/login">
                <Button variant="secondary" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

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
          className="absolute bottom-20 right-20 w-96 h-96 bg-lavender-400 rounded-full mix-blend-multiply filter blur-3xl"
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
            <span className="text-3xl">🔑</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-neutral-900 mb-2"
          >
            Forgot Password?
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-600"
          >
            No worries, we'll send you reset instructions
          </motion.p>
        </div>

        <Card variant="elevated" className="backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-lavender-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl text-neutral-900 placeholder-neutral-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent ${
                    touched && error
                      ? 'border-red-300 focus:ring-red-400'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                />
                {touched && !error && email && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {touched && error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {error}
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
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

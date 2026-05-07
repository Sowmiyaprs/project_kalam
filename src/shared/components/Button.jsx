import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseClasses = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-lavender-600 text-white hover:bg-lavender-700 focus:ring-lavender-500 shadow-soft hover:shadow-soft-lg',
    secondary: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 focus:ring-lavender-500 shadow-soft hover:shadow-soft-lg',
    outline: 'border-2 border-lavender-500 text-lavender-600 hover:bg-lavender-50 focus:ring-lavender-500',
    ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-soft hover:shadow-soft-lg',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-soft hover:shadow-soft-lg',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-5 py-2.5 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.99 } : {}}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </motion.button>
  );
}

import { motion } from 'framer-motion';

export default function Card({
  children,
  variant = 'default',
  className = '',
  hoverable = false,
  onClick,
  padding = 'normal',
}) {
  const variantClasses = {
    default: 'bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-soft',
    elevated: 'bg-white dark:bg-neutral-800 shadow-soft-lg border border-neutral-100 dark:border-neutral-700',
    premium: 'bg-white dark:bg-neutral-800 shadow-premium border border-neutral-100 dark:border-neutral-700',
    soft: 'bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700',
    gradient: 'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-100 dark:border-neutral-700 shadow-soft',
  };

  const paddingClasses = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8',
  };

  const classes = `
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    rounded-2xl
    transition-all duration-200
    ${hoverable ? 'cursor-pointer hover:shadow-medium hover:-translate-y-0.5' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  if (hoverable) {
    return (
      <motion.div
        className={classes}
        onClick={onClick}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

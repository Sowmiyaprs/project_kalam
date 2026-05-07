import { motion } from 'framer-motion';

/**
 * Skeleton Loader Component
 * Displays animated loading placeholders
 */
export default function SkeletonLoader({ 
  variant = 'text', 
  width = '100%', 
  height = '20px',
  count = 1,
  className = '' 
}) {
  const variants = {
    text: 'h-4 rounded',
    card: 'h-32 rounded-lg',
    circle: 'rounded-full',
    button: 'h-10 rounded-lg',
  };

  const skeletonClass = variants[variant] || variants.text;

  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          className={`bg-gray-800/50 ${skeletonClass} animate-pulse`}
          style={{ width, height }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

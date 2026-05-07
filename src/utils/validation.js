/**
 * Input validation and sanitization utilities
 */

const VALIDATION_RULES = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 10000,
  FORBIDDEN_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
  ],
};

/**
 * Validate input text
 * @param {string} text - Input text to validate
 * @returns {Object} Validation result
 */
export function validateInput(text) {
  const errors = [];

  // Check if text exists
  if (!text || typeof text !== 'string') {
    errors.push('Input must be a non-empty string');
    return { isValid: false, errors };
  }

  const trimmed = text.trim();

  // Check minimum length
  if (trimmed.length < VALIDATION_RULES.MIN_LENGTH) {
    errors.push(
      `Input must be at least ${VALIDATION_RULES.MIN_LENGTH} characters`
    );
  }

  // Check maximum length
  if (trimmed.length > VALIDATION_RULES.MAX_LENGTH) {
    errors.push(
      `Input must not exceed ${VALIDATION_RULES.MAX_LENGTH} characters`
    );
  }

  // Check for forbidden patterns
  VALIDATION_RULES.FORBIDDEN_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      errors.push('Input contains forbidden content');
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize input text (remove script tags, HTML, etc.)
 * @param {string} text - Input text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return '';

  let sanitized = text;

  // Remove script tags
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // Remove iframe tags
  sanitized = sanitized.replace(
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ''
  );

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove HTML tags (keep text content)
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Normalize whitespace
  sanitized = sanitized.replace(/\s+/g, ' ').trim();

  return sanitized;
}

/**
 * Validate character count for UI display
 * @param {string} text - Input text
 * @param {number} maxLength - Maximum allowed length
 * @returns {Object} Character count info
 */
export function validateCharacterCount(text, maxLength = 10000) {
  const length = text ? text.length : 0;
  const remaining = maxLength - length;
  const percentage = (length / maxLength) * 100;

  return {
    length,
    remaining,
    percentage,
    isNearLimit: percentage >= 90,
    isAtLimit: percentage >= 100,
    isValid: length >= VALIDATION_RULES.MIN_LENGTH && length <= maxLength,
  };
}

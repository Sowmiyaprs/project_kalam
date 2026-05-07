/**
 * Authentication Validation Utilities
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    return { isValid: false, error: 'Password is required', errors: ['Password is required'] };
  }
  
  if (password.length < 8) {
    errors.push('At least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('One number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('One special character');
  }
  
  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? 'Password does not meet requirements' : null,
    errors,
  };
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None', color: 'gray' };
  
  let strength = 0;
  
  // Length
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  
  // Character types
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;
  
  // Determine label and color
  let label, color;
  if (strength < 30) {
    label = 'Weak';
    color = 'red';
  } else if (strength < 60) {
    label = 'Fair';
    color = 'orange';
  } else if (strength < 80) {
    label = 'Good';
    color = 'yellow';
  } else {
    label = 'Strong';
    color = 'green';
  }
  
  return { strength, label, color };
};

export const validateFullName = (name) => {
  if (!name) {
    return { isValid: false, error: 'Full name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: 'Name can only contain letters and spaces' };
  }
  
  return { isValid: true, error: null };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: null };
};

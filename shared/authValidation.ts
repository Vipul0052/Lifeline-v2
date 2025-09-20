export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignUpForm = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  const emailValidation = validateEmail(data.email);
  const passwordValidation = validatePassword(data.password);
  const confirmPasswordValidation = validateConfirmPassword(data.password, data.confirmPassword);
  
  errors.push(...emailValidation.errors);
  errors.push(...passwordValidation.errors);
  errors.push(...confirmPasswordValidation.errors);
  
  if (data.name) {
    const nameValidation = validateName(data.name);
    errors.push(...nameValidation.errors);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignInForm = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  const emailValidation = validateEmail(data.email);
  const passwordValidation = validatePassword(data.password);
  
  errors.push(...emailValidation.errors);
  errors.push(...passwordValidation.errors);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
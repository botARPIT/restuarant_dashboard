// Security utility functions for input sanitization, validation, and security best practices

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The raw user input
 * @returns Sanitized input with HTML entities escaped
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/&/g, '&amp;') // Escape HTML entities
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;');
};

/**
 * Sanitizes HTML content while preserving safe tags
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML with only safe tags
 */
export const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return '';
  
  // Define safe HTML tags and attributes
  const safeTags = ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'span', 'div'];
  const safeAttributes = ['href', 'title', 'class', 'id'];
  
  // Remove all HTML tags except safe ones
  let sanitized = html;
  
  // Remove unsafe tags
  const unsafeTagRegex = /<(?!\/?(b|i|em|strong|a|br|p|span|div)\b)[^>]*>/gi;
  sanitized = sanitized.replace(unsafeTagRegex, '');
  
  // Remove unsafe attributes
  safeTags.forEach(tag => {
    const tagRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
    sanitized = sanitized.replace(tagRegex, (match) => {
      // Keep only safe attributes
      let cleanMatch = `<${tag}`;
      safeAttributes.forEach(attr => {
        const attrRegex = new RegExp(`${attr}=["'][^"']*["']`, 'gi');
        const attrMatch = match.match(attrRegex);
        if (attrMatch) {
          cleanMatch += ` ${attrMatch[0]}`;
        }
      });
      cleanMatch += '>';
      return cleanMatch;
    });
  });
  
  return sanitized;
};

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @returns True if phone number is valid
 */
export const validatePhone = (phone: string): boolean => {
  if (typeof phone !== 'string') return false;
  
  // Remove all non-digit characters except + for international format
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it's a valid international phone number
  const phoneRegex = /^[\+]?[1-9][\d]{7,15}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number;
  label: string;
  color: string;
  errors: string[];
} => {
  if (typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      label: 'Invalid',
      color: 'text-rose-500',
      errors: ['Password must be a string']
    };
  }
  
  const errors: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }
  
  // Character variety checks
  if (/(?=.*[a-z])/.test(password)) score += 1;
  else errors.push('Password must contain at least one lowercase letter');
  
  if (/(?=.*[A-Z])/.test(password)) score += 1;
  else errors.push('Password must contain at least one uppercase letter');
  
  if (/(?=.*\d)/.test(password)) score += 1;
  else errors.push('Password must contain at least one number');
  
  if (/(?=.*[@$!%*?&])/.test(password)) score += 1;
  else errors.push('Password must contain at least one special character');
  
  // Common password check
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
    score = Math.max(0, score - 2);
  }
  
  // Sequential character check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password contains too many repeated characters');
    score = Math.max(0, score - 1);
  }
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const colors = ['text-rose-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-emerald-500', 'text-emerald-600'];
  
  const isValid = score >= 4 && errors.length === 0;
  
  return {
    isValid,
    score: Math.min(score, 5),
    label: labels[Math.min(score, 5)] || 'Invalid',
    color: colors[Math.min(score, 5)] || 'text-slate-500',
    errors
  };
};

/**
 * Validates URL format
 * @param url - URL to validate
 * @returns True if URL is valid
 */
export const validateURL = (url: string): boolean => {
  if (typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Prevents SQL injection by escaping special characters
 * @param input - Input to escape
 * @returns Escaped input
 */
export const escapeSQL = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
};

/**
 * Generates a secure random token
 * @param length - Length of the token
 * @returns Secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Use crypto.randomBytes if available (Node.js), otherwise fallback to Math.random
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
};

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;
  
  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);
    
    if (!attempt || now > attempt.resetTime) {
      // Reset or create new attempt record
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (attempt.count >= this.maxAttempts) {
      return false;
    }
    
    attempt.count++;
    return true;
  }
  
  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return this.maxAttempts;
    
    const now = Date.now();
    if (now > attempt.resetTime) return this.maxAttempts;
    
    return Math.max(0, this.maxAttempts - attempt.count);
  }
  
  getResetTime(identifier: string): number | null {
    const attempt = this.attempts.get(identifier);
    return attempt ? attempt.resetTime : null;
  }
}

/**
 * CSRF token utility
 */
export class CSRFProtection {
  private static tokens: Set<string> = new Set();
  
  static generateToken(): string {
    const token = generateSecureToken(32);
    this.tokens.add(token);
    return token;
  }
  
  static validateToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    return this.tokens.has(token);
  }
  
  static removeToken(token: string): void {
    this.tokens.delete(token);
  }
  
  static cleanup(): void {
    // In production, you might want to implement token expiration
    // For now, we'll keep tokens in memory
  }
}

/**
 * Input length validation
 * @param input - Input to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @returns Validation result
 */
export const validateLength = (input: string, minLength: number, maxLength: number): {
  isValid: boolean;
  error?: string;
} => {
  if (typeof input !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }
  
  const length = input.trim().length;
  
  if (length < minLength) {
    return { isValid: false, error: `Input must be at least ${minLength} characters long` };
  }
  
  if (length > maxLength) {
    return { isValid: false, error: `Input must be less than ${maxLength} characters long` };
  }
  
  return { isValid: true };
};

/**
 * Sanitizes file name to prevent path traversal attacks
 * @param filename - File name to sanitize
 * @returns Sanitized file name
 */
export const sanitizeFilename = (filename: string): string => {
  if (typeof filename !== 'string') return '';
  
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\.\./g, '') // Prevent path traversal
    .replace(/^\.+/, '') // Remove leading dots
    .trim();
};

/**
 * Validates and sanitizes JSON input
 * @param jsonString - JSON string to validate
 * @returns Parsed and validated object or null if invalid
 */
export const validateAndParseJSON = (jsonString: string): any => {
  if (typeof jsonString !== 'string') return null;
  
  try {
    const parsed = JSON.parse(jsonString);
    
    // Additional validation: check for circular references and excessive nesting
    const seen = new WeakSet();
    const validateObject = (obj: any, depth: number = 0): boolean => {
      if (depth > 10) return false; // Prevent excessive nesting
      if (obj === null || typeof obj !== 'object') return true;
      
      if (seen.has(obj)) return false; // Prevent circular references
      seen.add(obj);
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (!validateObject(obj[key], depth + 1)) {
            seen.delete(obj);
            return false;
          }
        }
      }
      
      seen.delete(obj);
      return true;
    };
    
    return validateObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
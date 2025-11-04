export const COMMON_MESSAGES = {
    UNKNOWN_ERROR: 'Something went wrong. Please try again later.',
    UNAUTHORIZED: 'Unauthorized access.',
    BAD_REQUEST: 'Invalid request. Please check your input.',
    INTERNAL_SERVER_ERROR: 'Internal server error occurred. Please try again later.',
  };
  
  export const AUTH_MESSAGES = {
    REGISTER_SUCCESS: 'User registered successfully.',
    LOGIN_SUCCESS: 'Login successful.',
    EMAIL_ALREADY_EXISTS: 'This email is already registered.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_CREATION_FAILED: 'Unable to create user. Please try again later.',
  };
  
  export const VALIDATION_MESSAGES = {
    NAME_REQUIRED: 'Name is required.',
    NAME_STRING: 'Name must be a string.',
    EMAIL_REQUIRED: 'Email is required.',
    EMAIL_INVALID: 'Please enter a valid email address.',
    PASSWORD_REQUIRED: 'Password is required.',
    PASSWORD_STRING: 'Password must be a string.',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
    PASSWORD_TOO_LONG: 'Password must not exceed 20 characters.',
    PASSWORD_LOWERCASE: 'Password must contain at least one lowercase letter (a-z).',
    PASSWORD_UPPERCASE: 'Password must contain at least one uppercase letter (A-Z).',
    PASSWORD_NUMBER: 'Password must contain at least one number (0-9).',
    PASSWORD_SPECIAL: 'Password must contain at least one special character (!@#$%^&* etc.).',
  };
  
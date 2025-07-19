const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware configurations for different endpoint types
 * Protects against brute force attacks and API abuse
 */
const rateLimiters = {
  // Strict limits for authentication endpoints
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window per IP
    message: {
      error: 'Too many authentication attempts from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60), // seconds
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many authentication attempts from this IP, please try again later.',
        retryAfter: Math.ceil(15 * 60),
      });
    },
  }),

  // Moderate limits for general API operations
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window per IP
    message: {
      error: 'Too many API requests from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many API requests from this IP, please try again later.',
        retryAfter: Math.ceil(15 * 60),
      });
    },
  }),

  // Stricter limits for file operations (upload/download)
  files: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 file operations per window per IP
    message: {
      error: 'Too many file operations from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many file operations from this IP, please try again later.',
        retryAfter: Math.ceil(15 * 60),
      });
    },
  }),

  // Very strict limits for sensitive operations (keys, balance, etc.)
  sensitive: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window per IP
    message: {
      error: 'Too many requests to sensitive endpoint from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests to sensitive endpoint from this IP, please try again later.',
        retryAfter: Math.ceil(15 * 60),
      });
    },
  }),

  // Extra strict limits for plugin operations
  plugins: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 plugin operations per window per IP
    message: {
      error: 'Too many plugin requests from this IP, please try again later.',
      retryAfter: Math.ceil(15 * 60),
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many plugin requests from this IP, please try again later.',
        retryAfter: Math.ceil(15 * 60),
      });
    },
  }),
};

module.exports = rateLimiters;
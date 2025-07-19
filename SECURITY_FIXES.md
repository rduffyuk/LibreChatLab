# Security Vulnerabilities and Fixes for LibreChatLab

This document outlines the security vulnerabilities detected by CodeQL and their recommended fixes.

## 🚨 High Priority Issues

### 1. Polynomial Regular Expression (ReDoS) Vulnerabilities

#### Issue #42: packages/data-provider/src/utils.ts:36
**Problem**: Unbounded character class repetition in template variable replacement
```javascript
const regex = /\${([^}]+)}/g;  // Line 30
```
**Fix**: Add length limits to prevent excessive backtracking
```javascript
const regex = /\${([^}]{1,100})}/g;  // Limit to 100 chars
```

#### Issue #41: packages/api/src/mcp/utils.ts:18
**Problem**: Alternation with overlapping quantifiers causing ReDoS
```javascript
.replace(/^_+|_+$/g, '')  // Vulnerable pattern
```
**Fix**: Split into separate, safer operations
```javascript
.replace(/^_+/, '')   // Remove leading underscores
.replace(/_+$/, '')   // Remove trailing underscores
```

#### Issue #40: packages/api/src/endpoints/openai/llm.ts:191
**Problem**: Greedy dot-star quantifier causing backtracking
```javascript
/gpt-4o.*search/  // Vulnerable pattern
```
**Fix**: Use more specific pattern or string methods
```javascript
// Option 1: More specific regex
/^gpt-4o[^]*?search/
// Option 2: String methods (preferred)
modelOptions.model.startsWith('gpt-4o') && modelOptions.model.includes('search')
```

#### Issues #39 & #38: client/src/hooks/Artifacts/useArtifacts.ts:83
**Problem**: Multiple nested quantifiers with alternations
```javascript
/:::artifact(?:\{[^}]*\})?(?:\s|\n)*(?:```[\s\S]*?```(?:\s|\n)*)?:::/m
```
**Fix**: Add length limits and simplify pattern
```javascript
/:::artifact(?:\{[^}]{0,200}\})?[\s\n]{0,50}(?:```[\s\S]{1,10000}?```[\s\n]{0,50})?:::/m
```

### 2. Missing Rate Limiting (Issues #22-#37)

**Affected Routes:**
- `/api/oauth` (line 109)
- `/api/plugins` (lines 7)
- `/api/mcp` (lines 15, 65)
- `/api/files` (lines 268, 378)
- `/api/keys` (lines 6, 11, 17, 29)
- `/api/images` (line 14)
- `/api/avatar` (line 10)
- `/api/balance` (line 6)
- `/api/actions` (line 22)
- Main server (line 114)

**Fix**: Implement rate limiting middleware

Create `api/middleware/rateLimiter.js`:
```javascript
const rateLimit = require('express-rate-limit');

// Different rate limits for different endpoint types
const rateLimiters = {
  // Strict limits for authentication
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Moderate limits for API operations
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many API requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Stricter limits for file operations
  files: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 file operations per window
    message: 'Too many file operations, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Very strict limits for sensitive operations
  sensitive: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window
    message: 'Too many requests to sensitive endpoint, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),
};

module.exports = rateLimiters;
```

**Apply rate limiting in server/index.js:**
```javascript
const rateLimiters = require('./middleware/rateLimiter');

// Apply rate limiting to routes
app.use('/api/oauth', rateLimiters.auth, routes.oauth);
app.use('/api/plugins', rateLimiters.api, routes.plugins);
app.use('/api/mcp', rateLimiters.api, routes.mcp);
app.use('/api/files', rateLimiters.files, await routes.files.initialize());
app.use('/api/keys', rateLimiters.sensitive, routes.keys);
app.use('/images/', rateLimiters.files, validateImageRequest, routes.staticRoute);
app.use('/api/balance', rateLimiters.api, routes.balance);
app.use('/api/actions', rateLimiters.api, routes.actions);
```

### 3. Path Traversal Vulnerabilities (Issues #18-#20)

#### Issue #20: api/server/routes/files/files.js:420
#### Issue #19: api/server/routes/files/files.js:410
#### Issue #18: api/server/routes/files/images.js:44

**Problem**: Direct use of user-controlled paths in file operations
```javascript
await fs.unlink(req.file.path);  // Vulnerable
```

**Fix**: Add path validation utility

Create `api/utils/pathValidator.js`:
```javascript
const path = require('path');

/**
 * Validates that a file path is within expected directory bounds
 * @param {string} filePath - The file path to validate
 * @param {string} allowedBasePath - The base path that files should be within
 * @returns {boolean} - True if path is safe, false otherwise
 */
function isPathSafe(filePath, allowedBasePath) {
  const resolvedPath = path.resolve(filePath);
  const resolvedBasePath = path.resolve(allowedBasePath);
  return resolvedPath.startsWith(resolvedBasePath);
}

/**
 * Safely deletes a file with path validation
 * @param {string} filePath - Path to file to delete
 * @param {string} allowedBasePath - Base path for validation
 * @param {Object} logger - Logger instance
 * @returns {Promise<boolean>} - Success status
 */
async function safeUnlink(filePath, allowedBasePath, logger) {
  if (!filePath || !isPathSafe(filePath, allowedBasePath)) {
    logger.error('Attempted to delete file outside allowed directory:', filePath);
    return false;
  }
  
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    logger.error('Failed to delete file:', filePath, error);
    return false;
  }
}

module.exports = { isPathSafe, safeUnlink };
```

**Apply fixes to file routes:**
```javascript
const { safeUnlink } = require('../../utils/pathValidator');

// Replace vulnerable unlink calls:
await fs.unlink(req.file.path);

// With secure validation:
const uploadsBasePath = path.resolve(req.app.locals.paths.uploads);
await safeUnlink(req.file.path, uploadsBasePath, logger);
```

### 4. Missing CSRF Protection (Issue #21)

**Problem**: No CSRF middleware on line 62 of api/server/index.js

**Fix**: Add CSRF protection
```javascript
const csrf = require('csurf');

// Add CSRF protection (after session middleware)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Apply to state-changing routes
app.use('/api/', csrfProtection);

// Provide CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

## 🛠️ Implementation Priority

### Phase 1 (Immediate - High Risk)
1. **Fix ReDoS vulnerabilities** - Can cause service disruption
2. **Add rate limiting** - Prevents brute force and DoS attacks
3. **Fix path traversal** - Prevents file system access

### Phase 2 (Soon - Medium Risk)
1. **Add CSRF protection** - Prevents cross-site request forgery
2. **Enhanced logging** - Better attack detection

### Phase 3 (Ongoing - Maintenance)
1. **Regular security audits** - Automated scanning
2. **Dependency updates** - Keep libraries current
3. **Penetration testing** - Professional security assessment

## 🧪 Testing Security Fixes

### 1. Test ReDoS Fixes
```javascript
// Test with potentially malicious inputs
const testInputs = [
  'a'.repeat(10000),  // Long string
  '${' + 'a'.repeat(1000) + '}',  // Long template variable
  '___'.repeat(1000),  // Many underscores
];

// Measure execution time - should be reasonable
```

### 2. Test Rate Limiting
```bash
# Test rate limiting with curl
for i in {1..20}; do
  curl -w "%{http_code}\n" http://localhost:3080/api/balance
done
# Should return 429 after limit reached
```

### 3. Test Path Validation
```javascript
// Test path traversal attempts
const maliciousPaths = [
  '../../../etc/passwd',
  '..\\..\\..\\windows\\system32\\config\\sam',
  '/etc/passwd',
  'C:\\Windows\\System32\\config\\SAM'
];

// All should be rejected by isPathSafe()
```

## 📋 Security Checklist

- [ ] Fix all ReDoS vulnerabilities
- [ ] Implement rate limiting on all API endpoints  
- [ ] Add path validation to file operations
- [ ] Enable CSRF protection
- [ ] Test all fixes thoroughly
- [ ] Update security documentation
- [ ] Set up automated security scanning
- [ ] Plan regular security reviews

## 🔒 Additional Security Recommendations

1. **Input Validation**: Implement comprehensive input validation
2. **Authentication**: Review authentication mechanisms
3. **Authorization**: Ensure proper access controls
4. **Logging**: Enhanced security event logging
5. **Monitoring**: Real-time security monitoring
6. **Dependencies**: Regular dependency security audits
7. **Headers**: Security headers (HSTS, CSP, etc.)
8. **Encryption**: Ensure data encryption in transit and at rest

---

**Note**: These fixes address the specific vulnerabilities found by CodeQL. For production deployment, consider a comprehensive security audit and penetration testing.
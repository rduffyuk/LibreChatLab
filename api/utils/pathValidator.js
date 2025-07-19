const path = require('path');
const fs = require('fs').promises;

/**
 * Security utility for validating file paths to prevent directory traversal attacks
 */

/**
 * Validates that a file path is within expected directory bounds
 * Prevents directory traversal attacks like ../../../etc/passwd
 * 
 * @param {string} filePath - The file path to validate
 * @param {string} allowedBasePath - The base path that files should be within
 * @returns {boolean} - True if path is safe, false otherwise
 */
function isPathSafe(filePath, allowedBasePath) {
  if (!filePath || !allowedBasePath) {
    return false;
  }

  try {
    const resolvedPath = path.resolve(filePath);
    const resolvedBasePath = path.resolve(allowedBasePath);
    
    // Check if the resolved path starts with the allowed base path
    // This prevents directory traversal attacks
    return resolvedPath.startsWith(resolvedBasePath);
  } catch (error) {
    // If path resolution fails, consider it unsafe
    return false;
  }
}

/**
 * Safely deletes a file with path validation
 * 
 * @param {string} filePath - Path to file to delete
 * @param {string} allowedBasePath - Base path for validation
 * @param {Object} logger - Logger instance (optional)
 * @returns {Promise<boolean>} - Success status
 */
async function safeUnlink(filePath, allowedBasePath, logger = console) {
  if (!filePath) {
    logger.warn('[pathValidator] No file path provided to safeUnlink');
    return false;
  }

  if (!isPathSafe(filePath, allowedBasePath)) {
    logger.error('[pathValidator] Attempted to delete file outside allowed directory:', {
      filePath,
      allowedBasePath,
      resolved: path.resolve(filePath),
      allowedResolved: path.resolve(allowedBasePath),
    });
    return false;
  }
  
  try {
    await fs.unlink(filePath);
    logger.debug('[pathValidator] Successfully deleted file:', filePath);
    return true;
  } catch (error) {
    // File might not exist or permission denied
    if (error.code === 'ENOENT') {
      logger.debug('[pathValidator] File already deleted or does not exist:', filePath);
      return true; // Consider this successful since the file is gone
    }
    
    logger.error('[pathValidator] Failed to delete file:', {
      filePath,
      error: error.message,
      code: error.code,
    });
    return false;
  }
}

/**
 * Validates and normalizes a filename to prevent path traversal
 * 
 * @param {string} filename - The filename to validate
 * @param {number} maxLength - Maximum allowed length (default: 255)
 * @returns {string|null} - Sanitized filename or null if invalid
 */
function sanitizeFilename(filename, maxLength = 255) {
  if (!filename || typeof filename !== 'string') {
    return null;
  }

  // Remove directory traversal attempts
  let sanitized = path.basename(filename);
  
  // Replace potentially dangerous characters
  sanitized = sanitized.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
  
  // Prevent hidden files (starting with .)
  if (sanitized.startsWith('.')) {
    sanitized = '_' + sanitized;
  }
  
  // Limit length
  if (sanitized.length > maxLength) {
    const ext = path.extname(sanitized);
    const name = path.basename(sanitized, ext);
    const maxNameLength = maxLength - ext.length;
    sanitized = name.substring(0, maxNameLength) + ext;
  }
  
  return sanitized || null;
}

/**
 * Creates a safe file path within a base directory
 * 
 * @param {string} basePath - Base directory path
 * @param {...string} pathSegments - Path segments to join
 * @returns {string|null} - Safe path or null if invalid
 */
function createSafePath(basePath, ...pathSegments) {
  if (!basePath) {
    return null;
  }

  try {
    // Join all path segments
    const fullPath = path.join(basePath, ...pathSegments);
    
    // Validate the resulting path is safe
    if (isPathSafe(fullPath, basePath)) {
      return fullPath;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  isPathSafe,
  safeUnlink,
  sanitizeFilename,
  createSafePath,
};
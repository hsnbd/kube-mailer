// Common utility functions

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generates a unique mail ID
 * @returns {string} - Unique identifier
 */
function generateMailId() {
  return `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates a standardized API response
 * @param {boolean} success - Whether operation was successful
 * @param {string} message - Response message
 * @param {Object} data - Additional data
 * @returns {Object} - Standardized response
 */
function createApiResponse(success, message, data = {}) {
  return {
    success,
    message,
    timestamp: new Date().toISOString(),
    ...data
  };
}

/**
 * Logs service activity
 * @param {string} service - Service name
 * @param {string} action - Action performed
 * @param {Object} details - Additional details
 */
function logActivity(service, action, details = {}) {
  console.log(`[${service.toUpperCase()}] ${action}`, {
    timestamp: new Date().toISOString(),
    ...details
  });
}

/**
 * Creates error response for API endpoints
 * @param {string} error - Error type
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Object} - Error response
 */
function createErrorResponse(error, message, status = 500) {
  return {
    error,
    message,
    status,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  validateEmail,
  generateMailId,
  createApiResponse,
  logActivity,
  createErrorResponse
};

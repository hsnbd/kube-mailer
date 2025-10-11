// Common types for the mail system

/**
 * @typedef {Object} MailRequest
 * @property {string} to - Recipient email address
 * @property {string} subject - Email subject
 * @property {string} body - Email body content
 */

/**
 * @typedef {Object} DecoratedMail
 * @property {string} id - Unique mail identifier
 * @property {string} to - Recipient email address
 * @property {string} subject - Decorated email subject
 * @property {string} body - Decorated email body
 * @property {string} originalBody - Original email body
 * @property {Object} metadata - Mail processing metadata
 */

/**
 * @typedef {Object} MailResponse
 * @property {boolean} success - Whether the operation was successful
 * @property {string} id - Mail identifier
 * @property {string} message - Response message
 * @property {string} [messageId] - Email provider message ID
 * @property {string} timestamp - Processing timestamp
 */

module.exports = {
  // Mail status constants
  MAIL_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SENT: 'sent',
    FAILED: 'failed'
  },

  // Service ports
  PORTS: {
    UI: 3000,
    PRIMARY: 3001,
    DECORATOR: 3002,
    WORKER: 3003
  },

  // API endpoints
  ENDPOINTS: {
    HEALTH: '/health',
    SEND_MAIL: '/api/mail/send',
    DECORATE_MAIL: '/api/mail/decorate',
    MAIL_STATUS: '/api/mail/status'
  }
};

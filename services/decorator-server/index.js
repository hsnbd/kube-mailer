const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
const WORKER_SERVICE_URL = process.env.WORKER_SERVICE_URL || 'http://localhost:3003';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'decorator-server', timestamp: new Date().toISOString() });
});

// Mail decoration endpoint
app.post('/api/mail/decorate', async (req, res) => {
  try {
    const { to, subject, body, timestamp, source } = req.body;

    console.log(`Decorating mail: ${to} - ${subject}`);

    // Generate unique ID for tracking
    const mailId = `mail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Decorate the email content
    const decoratedMail = {
      id: mailId,
      to,
      subject: `[KUBE-MAILER] ${subject}`,
      body: decorateBody(body, timestamp, source),
      originalBody: body,
      metadata: {
        processedAt: new Date().toISOString(),
        processedBy: 'decorator-server',
        source,
        originalTimestamp: timestamp
      }
    };

    console.log(`Mail decorated with ID: ${mailId}`);

    // Forward to worker service
    const workerResponse = await axios.post(`${WORKER_SERVICE_URL}/api/mail/send`, decoratedMail);

    console.log('Mail successfully forwarded to worker service');

    res.json({
      success: true,
      id: mailId,
      message: 'Email decorated and forwarded to worker'
    });

  } catch (error) {
    console.error('Error decorating mail:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service unavailable',
        message: 'Worker service is not available'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to decorate mail'
      });
    }
  }
});

// Function to decorate email body
function decorateBody(originalBody, timestamp, source) {
  const header = `
=== KUBE-MAILER SYSTEM ===
Processed: ${new Date().toISOString()}
Source: ${source}
Original Timestamp: ${timestamp}
================================

`;

  const footer = `

================================
This email was processed by the Kube-Mailer microservice system.
If you received this email in error, please contact the administrator.
================================
  `;

  return header + originalBody + footer;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Decorator server running on port ${PORT}`);
  console.log(`Worker service URL: ${WORKER_SERVICE_URL}`);
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DECORATOR_SERVICE_URL = process.env.DECORATOR_SERVICE_URL || 'http://localhost:3002';

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'primary-server', timestamp: new Date().toISOString() });
});

// Mail endpoint
app.post('/api/mail/send', async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide to, subject, and body'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    console.log(`Received mail request: ${to} - ${subject}`);

    // Forward to decorator service
    const decoratorResponse = await axios.post(`${DECORATOR_SERVICE_URL}/api/mail/decorate`, {
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
      source: 'primary-server'
    });

    console.log('Mail successfully processed by decorator service');

    res.json({
      success: true,
      message: 'Email queued for sending',
      id: decoratorResponse.data.id
    });

  } catch (error) {
    console.error('Error processing mail request:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service unavailable',
        message: 'Decorator service is not available'
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process mail request'
      });
    }
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Primary server running on port ${PORT}`);
  console.log(`Decorator service URL: ${DECORATOR_SERVICE_URL}`);
});

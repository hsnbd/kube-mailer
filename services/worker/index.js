const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Email transporter setup (using Gmail for demo - configure for your provider)
let transporter;

try {
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} catch (error) {
  console.warn('Email transporter not configured. Using mock mode.');
  transporter = null;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'worker', 
    timestamp: new Date().toISOString(),
    emailConfigured: !!transporter
  });
});

// Mail sending endpoint
app.post('/api/mail/send', async (req, res) => {
  try {
    const { id, to, subject, body, metadata } = req.body;

    console.log(`Processing mail with ID: ${id}`);
    console.log(`Sending to: ${to}`);

    if (!transporter) {
      // Mock mode - simulate sending
      console.log('MOCK EMAIL SEND:');
      console.log('================');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${body}`);
      console.log('================');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({
        success: true,
        id,
        message: 'Email sent successfully (mock mode)',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Real email sending
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully: ${info.messageId}`);

    res.json({
      success: true,
      id,
      messageId: info.messageId,
      message: 'Email sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error sending email:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      message: error.message,
      id: req.body.id
    });
  }
});

// Get email status (for future implementation)
app.get('/api/mail/status/:id', (req, res) => {
  const { id } = req.params;
  
  // This would typically query a database for mail status
  res.json({
    id,
    status: 'sent', // mock status
    timestamp: new Date().toISOString()
  });
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
  console.log(`Worker service running on port ${PORT}`);
  console.log(`Email configured: ${!!transporter}`);
  
  if (!transporter) {
    console.log('Configure EMAIL_USER and EMAIL_PASS environment variables to enable real email sending');
  }
});
